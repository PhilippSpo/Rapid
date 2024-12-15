import { useState } from "react";

type SignUpProps = {
  onSubmit: (values: { name: string }) => void;
};

export const SignUpForm = (props: SignUpProps) => {
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit({ name });
      }}
    >
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <button type="submit">Teilnehmen</button>
    </form>
  );
};
