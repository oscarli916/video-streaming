import axios from "axios";

const RoomAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_ROOM_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const listRooms = async () => {
  const result = await RoomAxiosInstance.get("/room");
  return result;
};

export const createRoom = async () => {
  const result = await RoomAxiosInstance.post("/room");
  return result;
};
