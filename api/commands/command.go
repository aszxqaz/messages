package commands

import (
	"errors"
)

type CreateMessageCommand struct {
	Content           string `json:"content"`
	ProcessingDelayMs int    `json:"processing_delay"`
}

var ErrEmptyContent = errors.New("content cannot be empty")

func (c *CreateMessageCommand) Validate() error {
	if len(c.Content) == 0 {
		return ErrEmptyContent
	}
	return nil
}
