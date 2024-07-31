package services

import (
	"github.com/IBM/sarama"
)

type consumerHandler struct {
	evHandler EventHandler
}

// Cleanup implements sarama.ConsumerGroupHandler.
func (c consumerHandler) Cleanup(sarama.ConsumerGroupSession) error {
	return nil
}

// ConsumeClaim implements sarama.ConsumerGroupHandler.
func (c consumerHandler) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for msg := range claim.Messages() {
		err := c.evHandler.Handle(msg.Topic, msg.Value)
		if err == nil {
			session.MarkMessage(msg, "")
			session.Commit()
		}
	}
	return nil
}

// Setup implements sarama.ConsumerGroupHandler.
func (c consumerHandler) Setup(sarama.ConsumerGroupSession) error {
	return nil
}

func NewConsumerHandler(evHandler EventHandler) consumerHandler {
	return consumerHandler{evHandler}
}
