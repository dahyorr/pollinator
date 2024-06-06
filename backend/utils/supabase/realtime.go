package supabase

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"

	"github.com/spf13/viper"
)

type RealtimeMessage struct {
	Topic   string          `json:"topic"`
	Event   string          `json:"event"`
	Payload json.RawMessage `json:"payload"`
}

type BroadcastPayload struct {
	Messages []RealtimeMessage `json:"messages"`
}

func NewRealtimeMessage(topic string, event string, payload json.RawMessage) *RealtimeMessage {
	return &RealtimeMessage{
		Topic:   topic,
		Event:   event,
		Payload: payload,
	}
}

func BroadcastMessages(messages []RealtimeMessage) *http.Response {

	// Broadcast message to all connected clients
	baseURL := viper.GetString("SUPABASE_API_URL")
	apikey := viper.GetString("SUPABASE_API_KEY")
	path := "/realtime/v1/api/broadcast"
	url, err := url.JoinPath(baseURL, path)
	if err != nil {
		panic(err)
	}
	client := &http.Client{}

	payload := BroadcastPayload{
		Messages: messages,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}

	request, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		panic(err)
	}
	request.Header.Set("apikey", apikey)
	request.Header.Set("Content-Type", "application/json")
	response, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	if response.StatusCode != 202 {
		fmt.Println("Failed to broadcast message")
	}
	defer response.Body.Close()
	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	bodyString := string(bodyBytes)
	fmt.Println(string(body), bodyString)
	return response
}
