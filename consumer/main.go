package main

import (
	"consumer/services"
	"context"
	"log"
	"strings"
	"sync"

	"common/config"
	"common/repositories"
	"common/sigchan"

	"github.com/IBM/sarama"
)

type appConfig struct {
	Database       *config.DatabaseConfig `env:""`
	Kafka          *config.KafkaConfig    `env:""`
	ConsumersCount int                    `env:"CONSUMERS_COUNT, required"`
}

func main() {
	appConfig := &appConfig{}
	config.MustGetEnv(appConfig, context.Background())

	db := config.GetPgDbConn(appConfig.Database)
	defer db.Close()

	consumer := createConsumerGroup(appConfig.Kafka)
	defer consumer.Close()

	messageRepository := repositories.NewMessageRepository(db)
	messageHandler := services.NewMessageHandler(messageRepository)
	messageConsumerHandler := services.NewConsumerHandler(messageHandler)

	var consumersWg sync.WaitGroup
	done := make(chan struct{})

	sigchan.DoneOnQuitSig(done)

	for cn := range appConfig.ConsumersCount {
		consumersWg.Add(1)
		go func(cn int) {
		out:
			for {
				select {
				case <-done:
					log.Printf("Shutting down consumer %d", cn+1)
					consumer.Close()
					break out
				default:
					consumer.Consume(context.Background(), messageHandler.Topics(), messageConsumerHandler)
				}
			}
			consumersWg.Done()
		}(cn)
	}

	consumersWg.Wait()
}

func createConsumerGroup(config *config.KafkaConfig) sarama.ConsumerGroup {
	brokers := strings.Split(config.Brokers, ",")
	consumer, err := sarama.NewConsumerGroup(brokers, "message-consumer", nil)
	if err != nil {
		log.Fatalf("Error creating consumer group: %v\n", err)
	}
	return consumer
}
