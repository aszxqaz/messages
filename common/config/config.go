package config

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
	"github.com/sethvargo/go-envconfig"
)

type DatabaseConfig struct {
	User     string `env:"DB_USER, required"`
	DbName   string `env:"DB_NAME, required"`
	Host     string `env:"DB_HOST, required"`
	Port     int    `env:"DB_PORT, required"`
	Password string `env:"DB_PASSWORD, required"`
}

type KafkaConfig struct {
	Brokers string `env:"KAFKA_SERVERS, required"`
}

func MustGetEnv[T any](config *T, ctx context.Context) {
	err := envconfig.Process(ctx, config)
	if err != nil {
		log.Fatalf("Error loading config: %v\n", err)
		os.Exit(1)
	}
}

func GetPgDbConn(config *DatabaseConfig) *sql.DB {
	pgDsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.Host, config.Port, config.User, config.Password, config.DbName,
	)
	db, err := sql.Open("postgres", pgDsn)
	if err != nil {
		log.Fatalf("Error opening database: %v\n", err)
		os.Exit(1)
	}
	return db
}
