import React, {useState} from 'react'

function CreateNewRoom({ socket, onAddNewRoomToList, roomsList }) {
  const [roomName, setRoomName] = useState('');
  
  const onNewRoomCreation = () => {
      const isRoomExist = roomsList.includes(roomName);
      if(isRoomExist) {
        window.alert('You cannot create the room with same name');
        return;
      };
      socket.emit('create', roomName);
      onAddNewRoomToList(roomName);
      setRoomName('');
  }

  return (
    <>
        <div className="input_box_create_room">
        <input onChange={(event) => setRoomName(event.target.value)} value={roomName} type="text" placeholder="please enter your Room name" />
        <button onClick={onNewRoomCreation}>
            Create New Room
        </button>
        </div>
    </>
  )
}

export default CreateNewRoom