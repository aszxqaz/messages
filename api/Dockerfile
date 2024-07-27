FROM golang:1.22.4 as builder

WORKDIR /app
COPY ./api ./api
COPY ./common ./common

WORKDIR /app/api
RUN go mod download
RUN GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -v -o /app/api/api

FROM scratch

COPY --from=builder /app/api/api /app/api/api

ENTRYPOINT ["/app/api/api"]
