import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoom, listRooms } from "../utils/axios/room";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RoomPage = () => {
  const { data } = useQuery({
    queryKey: ["listRooms"],
    queryFn: async () => {
      const result = await listRooms();
      return result.data.data;
    },
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onCreateClickHandler = async () => {
    await createRoom();
    queryClient.invalidateQueries({ queryKey: ["listRooms"] });
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-end">
        <Button variant="contained" onClick={onCreateClickHandler}>
          create room
        </Button>
      </div>
      <p>List of rooms available:</p>
      <div className="flex flex-col gap-4">
        {data &&
          Object.keys(data).map((e) => {
            return (
              <div
                key={e}
                className="flex flex-col justify-around border-gray-500 rounded border w-full h-[100px] p-2"
              >
                <div>Room id: {e}</div>
                <Button
                  variant="contained"
                  className="w-[200px]"
                  onClick={() => navigate(`/room/${e}`)}
                >
                  join room
                </Button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RoomPage;
