package services

import (
	"common/events"
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/IBM/sarama"
)

type EventProducer interface {
	Produce(event events.Event) error
	Close()
}

type eventProducer struct {
	sarama.SyncProducer
}

func (p *eventProducer) Produce(event events.Event) error {
	topic := reflect.TypeOf(event).Name()
	value, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("failed to marshal event: %w", err)
	}

	msg := &sarama.ProducerMessage{
		Topic: topic,
		Value: sarama.ByteEncoder(value),
	}

	_, _, err = p.SendMessage(msg)
	if err != nil {
		return fmt.Errorf("failed to send event to Kafka: %w", err)
	}
	return nil
}

func (p *eventProducer) Close() {
	p.SyncProducer.Close()
}

func NewEventProducer(producer sarama.SyncProducer) EventProducer {
	return &eventProducer{producer}
}
