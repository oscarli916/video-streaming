package internal

import (
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type TRoomMap struct {
	Mutex sync.RWMutex
	Map   map[string][]TParticipant
}

func (r *TRoomMap) Init() {
	r.Map = make(map[string][]TParticipant)
}

func (r *TRoomMap) CreateRoom() string {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	id := uuid.New().String()

	r.Map[id] = []TParticipant{}

	return id
}

func (r *TRoomMap) ListRooms() map[string][]TParticipant {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	return r.Map
}

func (r *TRoomMap) GetRoom(id string) []TParticipant {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	return r.Map[id]
}

func (r *TRoomMap) DeleteRoom(id string) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	delete(r.Map, id)
}

func (r *TRoomMap) JoinParticipant(id string, host bool, conn *websocket.Conn) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	p := TParticipant{host, conn}
	r.Map[id] = append(r.Map[id], p)
}
