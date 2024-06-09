# Building the binary of the App
FROM golang:1.22 AS build

WORKDIR /code

COPY . .

RUN go mod download

# Builds the application as a staticly linked one, to allow it to run on alpine
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o main .

# Moving the binary to the 'final Image' to make it smaller
FROM alpine:latest as release

WORKDIR /app

COPY --from=build /code/main .
COPY ./config.yml .

# Add packages
RUN apk -U upgrade \
    && apk add --no-cache dumb-init ca-certificates \
    && chmod +x /app/main

EXPOSE 8000

ENTRYPOINT ["/usr/bin/dumb-init", "./main"]