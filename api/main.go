package main

import (
	"api/controllers"
	"api/services"
	"common/config"
	"common/repositories"
	"context"
	"log"
	"os"
	"strings"

	"github.com/IBM/sarama"
	"github.com/gofiber/fiber/v2"
)

type apiConfig struct {
	Database *config.DatabaseConfig `env:""`
	Kafka    *config.KafkaConfig    `env:""`
}

func main() {
	apiConfig := &apiConfig{}
	config.MustGetEnv(apiConfig, context.Background())

	db := config.GetPgDbConn(apiConfig.Database)
	defer db.Close()

	producer := getProducer(apiConfig.Kafka)
	defer producer.Close()

	eventProducer := services.NewEventProducer(producer)
	messageRepository := repositories.NewMessageRepository(db)
	messageService := services.NewMessageService(messageRepository, eventProducer)
	messageController := controllers.NewMessageController(messageService)

	app := fiber.New()

	messages := app.Group("/api/v1/messages")
	messages.Get("/", messageController.List)
	messages.Post("/", messageController.Create)
	messages.Get("/statistics", messageController.Statistics)

	app.Listen(":8080")
}

func getProducer(config *config.KafkaConfig) sarama.SyncProducer {
	brokers := strings.Split(config.Brokers, ",")
	producer, err := sarama.NewSyncProducer(brokers, nil)
	if err != nil {
		log.Fatalf("Error creating producer: %v\n", err)
		os.Exit(1)
	}
	return producer
}
