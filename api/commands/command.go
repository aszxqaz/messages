package commands

import (
	"errors"
)

type CreateMessageCommand struct {
	Content           string `json:"content"`
	ProcessingDelayMs int    `json:"processing_delay"`
}

var ErrEmptyContent = errors.New("content cannot be empty")
var ErrInvalidDelay = errors.New("delay must be a positive integer or zero")

func (c *CreateMessageCommand) Validate() error {
	if len(c.Content) == 0 {
		return ErrEmptyContent
	}
	if c.ProcessingDelayMs < 0 {
		return ErrInvalidDelay
	}
	return nil
}
