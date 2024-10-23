package internal

import "github.com/gorilla/websocket"

type TParticipant struct {
	Host bool
	Conn *websocket.Conn
}
