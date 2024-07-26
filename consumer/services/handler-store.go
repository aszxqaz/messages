package services

import (
	"sync"
)

type EventHandlerFunc func([]byte) error

type EventHandlerStore struct {
	mu       sync.Mutex
	handlers map[string]func([]byte) error
}

func NewEventHandlerStore() *EventHandlerStore {
	return &EventHandlerStore{handlers: make(map[string]func([]byte) error)}
}

func (erh *EventHandlerStore) RegisterHandler(topic string, handler func([]byte) error) {
	erh.mu.Lock()
	defer erh.mu.Unlock()
	erh.handlers[topic] = handler
}

func (erh *EventHandlerStore) Dispatch(topic string, msg []byte) (error, bool) {
	erh.mu.Lock()
	defer erh.mu.Unlock()

	handler, ok := erh.handlers[topic]
	if !ok {
		return nil, false
	}

	return handler(msg), true
}

func (erh *EventHandlerStore) GetTopics() []string {
	erh.mu.Lock()
	defer erh.mu.Unlock()

	topics := make([]string, 0, len(erh.handlers))
	for topic := range erh.handlers {
		topics = append(topics, topic)
	}
	return topics
}
