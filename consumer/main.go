package main

import (
	"context"

	"common/config"
)

func main() {
	appConfig := &appConfig{}
	config.MustGetEnv(appConfig, context.Background())

	app := NewApp(appConfig)
	app.Run()
}
