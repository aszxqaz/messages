package services

import (
	"common/events"
	"common/repositories"
	"encoding/json"
	"log"
	"time"
)

type EventHandler interface {
	Handle(topic string, eventBytes []byte)
	Topics() []string
}

type messageEventHandler struct {
	handlers          *EventHandlerStore
	messageRepository repositories.MessageRepository
	topics            []string
}

func NewMessageHandler(messageRepository repositories.MessageRepository) EventHandler {
	handlers := NewEventHandlerStore()
	h := &messageEventHandler{handlers, messageRepository, []string{}}

	h.registerHandler(events.TOPIC_MESSAGE_CREATED, h.handleMessageCreated)

	return h
}

func (h *messageEventHandler) registerHandler(topic string, handler EventHandlerFunc) {
	h.handlers.RegisterHandler(topic, handler)
	h.topics = append(h.topics, topic)
}

func (h *messageEventHandler) Handle(topic string, eventBytes []byte) {
	err, found := h.handlers.Dispatch(topic, eventBytes)
	if !found {
		log.Printf("No handler registered for topic: %s", topic)
		return
	}
	if err != nil {
		log.Printf("Error handling event: %v", err)
	}
}

func (h *messageEventHandler) Topics() []string {
	return h.topics
}

func (h *messageEventHandler) handleMessageCreated(eventBytes []byte) error {
	event := events.MessageCreated{}

	if err := json.Unmarshal(eventBytes, &event); err != nil {
		log.Printf("Failed to unmarshal event: %v", err)
		return nil
	}

	delay := time.Duration(event.ProcessingDelayMs) * time.Millisecond
	time.Sleep(delay)
	time.AfterFunc(delay, func() {
		if err := h.messageRepository.MarkProcessed(event.Id); err != nil {
			log.Printf("Failed to mark message as processed: %v", err)
		}
	})

	return nil
}
