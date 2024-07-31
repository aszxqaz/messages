package main

import (
	"api/controllers"
	"api/services"
	"common/config"
	"common/repositories"
	"database/sql"
)

type appConfig struct {
	Database *config.DatabaseConfig `env:""`
	Kafka    *config.KafkaConfig    `env:""`
	Port     int                    `env:"PORT"`
}

type App interface {
	Run() error
}

type app struct {
	config        *appConfig
	db            *sql.DB
	eventProducer services.EventProducer
	httpLis       HttpListener
}

func NewApp(appConfig *appConfig) App {
	db := config.GetPgDbConn(appConfig.Database)
	eventProducer := services.NewEventProducer(appConfig.Kafka)
	messageRepository := repositories.NewMessageRepository(db)
	messageService := services.NewMessageService(messageRepository, eventProducer)
	messageController := controllers.NewMessageController(messageService)

	return &app{
		config:        appConfig,
		db:            db,
		eventProducer: eventProducer,
		httpLis:       NewHttpListener(messageController),
	}
}

func (app *app) Run() error {
	defer app.db.Close()
	defer app.eventProducer.Close()

	err := app.httpLis.Listen(app.config.Port)
	return err
}
