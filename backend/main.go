package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/oscarli916/video-streaming/internal"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Accepting all requests
	},
}

var AllRooms internal.TRoomMap

type resp struct {
	Message string `json:"message"`
	Data    any    `json:"data"`
}

func RoomRequestHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	query := r.URL.Query()
	id := query.Get("id")

	switch r.Method {
	case "GET":
		rooms := AllRooms.ListRooms()
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(resp{Message: "success", Data: rooms})
	case "POST":
		id := AllRooms.CreateRoom()
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(resp{Message: "success", Data: id})
	case "DELETE":
		AllRooms.DeleteRoom(id)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(resp{Message: "success", Data: id})
	}

}

type brodcastMsg struct {
	id     string
	client *websocket.Conn
	data   map[string]interface{}
}

var brodcast = make(chan brodcastMsg)

func broadcaster() {
	for {
		msg := <-brodcast
		for _, client := range AllRooms.Map[msg.id] {

			if client.Conn != msg.client {
				err := client.Conn.WriteJSON(msg.data)
				if err != nil {
					log.Println("write error:", err)
					return
					// log.Fatal(err)
					// client.Conn.Close()
				}
			}
		}
	}
}

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("client joined")
	query := r.URL.Query()
	id := query.Get("id")

	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade error:", err)
		return
	}
	defer c.Close()

	AllRooms.JoinParticipant(id, false, c)

	go broadcaster()

	for {
		var msg brodcastMsg

		err := c.ReadJSON(&msg.data)
		if err != nil {
			log.Println("read error:", err)
			return
			// log.Fatal("read error:", err)
		}

		msg.id = id
		msg.client = c

		log.Println("received data from client: ", msg.data)

		brodcast <- msg
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	AllRooms.Init()
	http.HandleFunc("/room", RoomRequestHandler)
	http.HandleFunc("/ws", WebSocketHandler)

	PORT := os.Getenv("PORT")

	log.Println("starting server on port " + PORT)
	err = http.ListenAndServe(":"+PORT, nil)
	if err != nil {
		log.Fatal(err)
	}
}
