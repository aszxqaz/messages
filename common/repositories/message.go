package repositories

import (
	"common/domain"
	"database/sql"
)

type MessageRepository interface {
	Insert(message *domain.Message) error
	MarkProcessed(id int) error
	FindAll() ([]*domain.Message, error)
}

type pgMessageRepository struct {
	db *sql.DB
}

func NewMessageRepository(db *sql.DB) MessageRepository {
	return &pgMessageRepository{db: db}
}

func (r *pgMessageRepository) Insert(message *domain.Message) error {
	query := `INSERT INTO messages (content, processing_delay) VALUES ($1, $2) RETURNING id, created_at`
	err := r.db.QueryRow(query, message.Content, message.ProcessingDelayMs).Scan(&message.Id, &message.CreatedAt)
	return err
}

func (r *pgMessageRepository) MarkProcessed(id int) error {
	query := `UPDATE messages SET processed = true WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *pgMessageRepository) FindAll() ([]*domain.Message, error) {
	query := `
		SELECT 
			id, 
			content, 
			processed, 
			processing_delay, 
			created_at 
		FROM messages
		ORDER BY id ASC
		`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	messages := []*domain.Message{}
	for rows.Next() {
		var message domain.Message
		err := rows.Scan(
			&message.Id,
			&message.Content,
			&message.Processed,
			&message.ProcessingDelayMs,
			&message.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, &message)
	}

	return messages, nil
}
