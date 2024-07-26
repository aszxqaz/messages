package services

import (
	"api/commands"
	"common/domain"
	"common/events"
	"common/repositories"
	"fmt"
	"log"
	"strings"
)

type MessageService interface {
	CreateMessage(commands.CreateMessageCommand) (message *domain.Message, err error)
	FindAll() ([]*domain.Message, error)
}

type messageService struct {
	eventProducer     EventProducer
	messageRepository repositories.MessageRepository
}

// CreateMessage implements the MessageService interface.
func (s *messageService) CreateMessage(command commands.CreateMessageCommand) (message *domain.Message, err error) {
	if strings.TrimSpace(command.Content) == "" {
		return nil, fmt.Errorf("content cannot be empty")
	}
	log.Printf("Creating message: %+v", command)
	message = &domain.Message{
		Content:           command.Content,
		ProcessingDelayMs: command.ProcessingDelayMs,
	}

	err = s.messageRepository.Insert(message)
	if err != nil {
		return nil, fmt.Errorf("failed to insert message: %w", err)
	}

	err = s.eventProducer.Produce(events.MessageCreated{Message: *message})
	if err != nil {
		return nil, fmt.Errorf("failed to produce event: %w", err)
	}

	return message, nil
}

// FindAll implements the MessageService interface.
func (s *messageService) FindAll() ([]*domain.Message, error) {
	messages, err := s.messageRepository.FindAll()
	if err != nil {
		return nil, fmt.Errorf("failed to find all messages: %w", err)
	}
	return messages, nil
}

func NewMessageService(messageRepository repositories.MessageRepository, eventProducer EventProducer) MessageService {
	return &messageService{eventProducer, messageRepository}
}
