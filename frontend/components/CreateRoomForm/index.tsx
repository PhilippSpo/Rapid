const CreateRoomForm = (props: { onSubmit: () => void }) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit();
      }}
    >
      <button type="submit">Raum erstellen</button>
    </form>
  );
};
export default CreateRoomForm;
