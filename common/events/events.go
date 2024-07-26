package events

import (
	"common/domain"
	"reflect"
)

var TOPIC_MESSAGE_CREATED = reflect.TypeOf(MessageCreated{}).Name()

type Event interface {
}

type MessageCreated struct {
	domain.Message
}
