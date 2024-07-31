package main

import (
	"common/config"
	"common/repositories"
	"consumer/services"
	"context"
	"database/sql"
	"log"
	"strings"
	"time"

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

	for {
		err := app.consumer.Consume(context.Background(), app.messageHandler.Topics(), app.messageConsumerHandler)
		if err != nil {
			log.Printf("Error consuming from consumer group: %v.", err)
			app.consumer.Close()
			break
		}
	}
}

func createConsumerGroup(config *config.KafkaConfig) sarama.ConsumerGroup {
	brokers := strings.Split(config.Brokers, ",")
	consumerConfig := sarama.NewConfig()
	consumerConfig.Consumer.Offsets.AutoCommit.Enable = false
	consumerConfig.Consumer.MaxProcessingTime = 11 * time.Second
	consumerConfig.Consumer.Group.Rebalance.GroupStrategies = []sarama.BalanceStrategy{sarama.NewBalanceStrategyRoundRobin()}
	consumer, err := sarama.NewConsumerGroup(brokers, "message-consumer", consumerConfig)
	if err != nil {
		log.Fatalf("Error creating consumer group: %v\n", err)
	}
	return consumer
}

// func (app *app) Run() {
// 	consumer := createConsumer(app.config.Kafka)
// 	partitionList, err := consumer.Partitions(events.TOPIC_MESSAGE_CREATED)
// 	if err != nil {
// 		log.Fatalf("Error getting partition list: %v\n", err)
// 	}

// 	var (
// 		messages = make(chan *sarama.ConsumerMessage, 1024)
// 		wg       sync.WaitGroup
// 	)

// 	ci := 1

// 	for _, partition := range partitionList {
// 		pc, err := consumer.ConsumePartition(events.TOPIC_MESSAGE_CREATED, partition, sarama.OffsetNewest)
// 		if err != nil {
// 			log.Printf("Error creating consumer for partition %d: %v\n", partition, err)
// 			continue
// 		}

// 		wg.Add(1)
// 		go func(pc sarama.PartitionConsumer, ci int) {
// 			defer wg.Done()
// 			for message := range pc.Messages() {
// 				log.Printf("Consumed message from partition %d at offset %d by consumer #%d: %s\n", partition, message.Offset, ci, string(message.Value))
// 				messages <- message

// 			}
// 		}(pc, ci)

// 		ci += 1
// 	}
// 	wg.Wait()
// }

// func createConsumer(config *config.KafkaConfig) sarama.Consumer {
// 	brokers := strings.Split(config.Brokers, ",")

// 	consumerConfig := sarama.NewConfig()
// 	consumerConfig.Consumer.Offsets.AutoCommit.Enable = false
// 	c, err := sarama.NewConsumer(brokers, nil)
// 	if err != nil {
// 		log.Fatalf("Error creating consumer: %v\n", err)
// 	}
// 	return c
// }
