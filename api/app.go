package main

import (
	"database/sql"
)

type App interface {
	Run() error
}

type app struct {
	db *sql.DB
}

func (a *app) Run() error {
	return nil
}

func NewApp(db *sql.DB) (App, error) {
	return &app{db}, nil
}
