import { useState } from "react";

type SignUpProps = {
  onSubmit: (name: string) => void;
};

export const SignUpForm = (props: SignUpProps) => {
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit(name);
      }}
    >
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit">Teilnehmen</button>
    </form>
  );
};
