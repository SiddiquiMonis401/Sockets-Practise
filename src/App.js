import "./App.css";
import { useEffect, useState } from "react";

import { io } from "socket.io-client";
import CreateNewRoom from "./components/CreateNewRoom";
import RoomsList from "./components/RoomsList";
import ChatBox from "./components/ChatBox";
import AddMessage from "./components/AddMessage";

import axios from "axios";

// Sockets - start
const socket = io("ws://localhost:8000/", {
  reconnectionDelayMax: 10000,
});

function App() {
  // States - Data - Start
  const [roomsList, setRoomsList] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentSelectedRoom, setCurrentSelectedRoom] = useState(null);
  const [username, setUsername] = useState('');
  const [file, setFile] = useState('');
  const [image, setImage] = useState(null);
  const [isUsernameEntered, setIsUsernameEntered] = useState(false);
  // State - Data - Ends

  const addMessageToRoom = (room, msg, username) => {
    setMessages((prev) => {
      const currentRoomMessageQueue = prev[room] || [];
      const updatedMessages = [...currentRoomMessageQueue, {msg, username}];
      return {
        ...prev,
        [room]: updatedMessages,
      };
    });
  };

  const onRoomSelect = (room) => {
    setCurrentSelectedRoom(room);
    socket.emit("join_room", room);
  };

  useEffect(() => {
    // This events are state independent
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("add_rooms_to_list", (rooms) => {
      setRoomsList(rooms);
    });

    socket.on("room_created", (room) => {
      onAddNewRoomToList(room);
    });

    // This is dependent on currentSelectedRoom
    socket.on("new_message_from_server", ({ msg, room, username }) => {
      addMessageToRoom(room, msg, username);
    });
  }, []);
  // Sockets - end

  const onAddNewRoomToList = (room) => {
    setRoomsList((prev) => [...prev, room]);
  };

  // Username change handler
  const onChangeUsername = ({ target: { value = "" } = {} }) => {
    setUsername(value);
  };

  const onChangeFile = ({ target }) => {
    setFile(target.files[0]);
  }

  const onSubmitUsername = () => {
    setIsUsernameEntered(true);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('userprofile', file);
    axios.post('http://localhost:8000/user_profile', formData, { headers: {
      'content-type': 'multipart/form-data'
    } }).then(res => {
      console.log('here', res.data.data);
      setImage('http://localhost:8000/images/' + res?.data?.data?.path.split('/')[1]);
    });
  };

  return (
    <div className="App">
      {true ? (
        <div className="user-name-section">
          <h1>Please enter your username to continue</h1>
          <input value={username} onChange={onChangeUsername} />
          <input type="file" name="userprofile" onChange={onChangeFile} />
          {image && <img src={image} alt="user_avatar" />}
          <button onClick={onSubmitUsername}>Enter username</button>
        </div>
      ) : (
        <>
          <div className="header_section">
            <header className="header">
              This is my first socket IO project !
            </header>
            <div className="create-room-container">
              <CreateNewRoom
                roomsList={roomsList}
                onAddNewRoomToList={onAddNewRoomToList}
                socket={socket}
              />
            </div>
          </div>
          <div className="chat-window">
            <RoomsList
              currentSelectedRoom={currentSelectedRoom}
              setCurrentSelectedRoom={onRoomSelect}
              roomsList={roomsList}
            />
            <div className="sub-1-chat-window">
              <ChatBox
                roomsList={roomsList}
                currentSelectedRoom={currentSelectedRoom}
                messages={messages}
              />
              <AddMessage
                username={username}
                socket={socket}
                currentSelectedRoom={currentSelectedRoom}
                setMessages={addMessageToRoom}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
