package controllers

import (
	"api/commands"
	"api/services"
	"common/domain"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type MessageController interface {
	Create(c *fiber.Ctx) error
	List(c *fiber.Ctx) error
	Statistics(c *fiber.Ctx) error
}

type messageController struct {
	messageService services.MessageService
}

// Create implements MessageController interface.
func (mc *messageController) Create(c *fiber.Ctx) error {
	command := commands.CreateMessageCommand{}
	err := c.BodyParser(&command)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := command.Validate(); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	message, err := mc.messageService.CreateMessage(command)
	if err != nil {
		log.Printf("Error creating message: %v", err)
		return mc.serverError(c)
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"message": message,
	})
}

// List implements MessageController interface.
func (mc *messageController) List(c *fiber.Ctx) error {
	messages, err := mc.messageService.FindAll()
	if err != nil {
		log.Printf("Error finding all messages: %v", err)
		return mc.serverError(c)
	}

	return c.JSON(fiber.Map{
		"messages": messages,
	})
}

// Statistics implements MessageController interface.
func (mc *messageController) Statistics(c *fiber.Ctx) error {
	messages, err := mc.messageService.FindAll()
	if err != nil {
		log.Printf("Error finding all messages: %v", err)
		return mc.serverError(c)
	}

	statistics := domain.NewStatistics(messages)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"statistics": statistics,
	})
}

func (mc *messageController) serverError(c *fiber.Ctx) error {
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": "Something went wrong",
	})
}

func NewMessageController(messageService services.MessageService) MessageController {
	return &messageController{messageService: messageService}
}
