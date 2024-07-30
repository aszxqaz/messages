package main

import (
	"common/config"
	"context"
	"log"
)

func main() {
	apiConfig := &appConfig{}
	config.MustGetEnv(apiConfig, context.Background())

	app := NewApp(apiConfig)
	err := app.Run()
	if err != nil {
		log.Fatalf("Error running the application: %v\n", err)
	}
}
