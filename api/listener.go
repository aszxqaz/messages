package main

import (
	"api/controllers"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

const (
	baseApiUrl = "/api/v1"
)

type HttpListener interface {
	Listen(port int) error
}

type httpLis struct {
	app *fiber.App
}

func NewHttpListener(mc controllers.MessageController) HttpListener {
	app := fiber.New()

	messages := app.Group(baseApiUrl + "/messages")
	messages.Get("/", mc.List)
	messages.Post("/", mc.Create)
	messages.Get("/statistics", mc.Statistics)

	return &httpLis{
		app: app,
	}
}

func (hl *httpLis) Listen(port int) error {
	err := hl.app.Listen(fmt.Sprintf(":%d", port))
	return err
}
