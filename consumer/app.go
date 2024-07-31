package main

import (
	"common/config"
	"common/repositories"
	"consumer/services"
	"context"
	"database/sql"
	"log"
	"strings"
	"sync"

	"github.com/IBM/sarama"
)

type appConfig struct {
	Database       *config.DatabaseConfig `env:""`
	Kafka          *config.KafkaConfig    `env:""`
	ConsumersCount int                    `env:"CONSUMERS_COUNT, required"`
}

type App interface {
	Run()
}

type app struct {
	config                 *appConfig
	db                     *sql.DB
	consumer               sarama.ConsumerGroup
	messageRepository      repositories.MessageRepository
	messageHandler         services.EventHandler
	messageConsumerHandler sarama.ConsumerGroupHandler
}

func NewApp(appConfig *appConfig) App {
	db := config.GetPgDbConn(appConfig.Database)
	consumer := createConsumerGroup(appConfig.Kafka)
	messageRepository := repositories.NewMessageRepository(db)
	messageHandler := services.NewMessageHandler(messageRepository)
	messageConsumerHandler := services.NewConsumerHandler(messageHandler)
	return &app{
		config:                 appConfig,
		db:                     db,
		consumer:               consumer,
		messageRepository:      messageRepository,
		messageHandler:         messageHandler,
		messageConsumerHandler: messageConsumerHandler,
	}
}

func (app *app) Run() {
	defer app.db.Close()
	defer app.consumer.Close()

	var wg sync.WaitGroup

	for cn := range app.config.ConsumersCount {
		log.Printf("Starting consumer %d/%d...\n", cn+1, app.config.ConsumersCount)
		wg.Add(1)
		go func(cn int) {
			for {
				err := app.consumer.Consume(context.Background(), app.messageHandler.Topics(), app.messageConsumerHandler)
				log.Printf("Consumer %d consumer messages: %v\n", cn+1, err)
				if err != nil {
					log.Printf("Error consuming from consumer group #%d: %v. Exiting.", cn+1, err)
					app.consumer.Close()
					wg.Done()
					break
				}
			}
		}(cn)
	}
	wg.Wait()
}

func createConsumerGroup(config *config.KafkaConfig) sarama.ConsumerGroup {
	brokers := strings.Split(config.Brokers, ",")
	consumerConfig := sarama.NewConfig()
	consumerConfig.Consumer.Offsets.AutoCommit.Enable = false
	consumerConfig.Consumer.Group.Rebalance.GroupStrategies = []sarama.BalanceStrategy{sarama.NewBalanceStrategyRoundRobin()}
	consumer, err := sarama.NewConsumerGroup(brokers, "message-consumer", consumerConfig)
	if err != nil {
		log.Fatalf("Error creating consumer group: %v\n", err)
	}
	return consumer
}
