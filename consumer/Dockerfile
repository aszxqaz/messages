FROM golang:1.22.4

WORKDIR /app
COPY ./consumer ./consumer
COPY ./common ./common

WORKDIR /app/consumer
RUN go mod download
RUN go build -v -o /app/consumer/consumer

CMD ["/app/consumer/consumer"]
