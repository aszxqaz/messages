FROM golang:1.22.4 as builder

WORKDIR /app
COPY ./api ./api
COPY ./common ./common

WORKDIR /app/api
RUN go mod download
RUN go build -v -o /app/api/api

FROM scratch

COPY --from=builder /app/api/api /app/api/api

CMD ["/app/api/api"]
