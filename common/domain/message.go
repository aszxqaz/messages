package domain

import "time"

type Message struct {
	Id                int       `json:"id"`
	CreatedAt         time.Time `json:"created_at"`
	Processed         bool      `json:"processed"`
	ProcessingDelayMs int       `json:"processing_delay"`
	Content           string    `json:"content"`
}

type Statistics struct {
	TotalMessages       int `json:"total_messages"`
	UnprocessedMessages int `json:"unprocessed_messages"`
	ProcessedMessages   int `json:"processed_messages"`
}

func NewStatistics(messages []*Message) *Statistics {
	totalMessages := len(messages)
	unprocessedMessages := 0
	processedMessages := 0

	for _, message := range messages {
		if !message.Processed {
			unprocessedMessages++
		} else {
			processedMessages++
		}
	}

	return &Statistics{
		TotalMessages:       totalMessages,
		UnprocessedMessages: unprocessedMessages,
		ProcessedMessages:   processedMessages,
	}
}
