import { useState } from "react";

type JoinRoomFormProps = {
  onSubmit: (values: { roomCode: string }) => void;
};

export const JoinRoomForm = (props: JoinRoomFormProps) => {
  const [roomCode, setRoom] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit({ roomCode });
      }}
    >
      <div>
        <label htmlFor="roomCode">Room Code</label>
        <input
          id="roomCode"
          type="text"
          value={roomCode}
          onChange={(event) => setRoom(event.target.value)}
        />
      </div>
      <button type="submit">Teilnehmen</button>
    </form>
  );
};
