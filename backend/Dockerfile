# Dockerfile for Backend

FROM golang:1.22-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o /tenthousandhours

EXPOSE 8080

CMD ["/tenthousandhours"]
