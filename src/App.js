import './App.css';
import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';
import CreateNewRoom from './components/CreateNewRoom';
import RoomsList from './components/RoomsList';
import ChatBox from './components/ChatBox';
import AddMessage from './components/AddMessage';

// Sockets - start
const socket = io("ws://localhost:8000/", {
  reconnectionDelayMax: 10000,
});


function App() {

  // States - Data - Start
  const [roomsList, setRoomsList] = useState([]);
  const [messages,  setMessages] = useState({});
  const [currentSelectedRoom, setCurrentSelectedRoom] = useState(null);
  // State - Data - Ends


  const addMessageToRoom = (room, msg) => {
    setMessages(prev => {
      const currentRoomMessageQueue = messages[room] || [];
      const updatedMessages = [...currentRoomMessageQueue,msg];
      return {
        ...prev,
        [room]: updatedMessages,
      }
    });
  }


  useEffect(() => {

    // This events are state independent
    socket.on('connect', () => {
      console.log('connected')
    });

    socket.on('add_rooms_to_list', (rooms) => {
      console.log('rooms', rooms);
      setRoomsList(rooms);
    })
  
    socket.on('room_created', (room) => {
      console.log('on new room edition', room);
      onAddNewRoomToList(room);
    })

  }, []);

 

  useEffect(() => {

    // This is dependent on currentSelectedRoom
    socket.on('new_message_from_server', ({msg, room}) => {
      console.log('new message has been recieved',  currentSelectedRoom, room);
      if(room === currentSelectedRoom) {
        console.log('currentSelectedRoom', currentSelectedRoom);
        addMessageToRoom(currentSelectedRoom, msg);
      }
    })
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectedRoom]);
  // Sockets - end

  const onAddNewRoomToList = (room) => {
    setRoomsList(prev => ([...prev,  room]));
  }


  return (
    <div className="App">
      <header className="header">
        This is my first socket IO project !
      </header>
      <div className="create-room-container">
        <CreateNewRoom roomsList={roomsList} onAddNewRoomToList={onAddNewRoomToList} socket={socket} />
      </div>
      <div className="chat-window">
        <RoomsList currentSelectedRoom={currentSelectedRoom} setCurrentSelectedRoom={setCurrentSelectedRoom} roomsList={roomsList} />
        <div className="sub-1-chat-window">
          <ChatBox roomsList={roomsList} currentSelectedRoom={currentSelectedRoom} messages={messages} />
          <AddMessage socket={socket} currentSelectedRoom={currentSelectedRoom} setMessages={addMessageToRoom} />
        </div>
      </div>
    </div>
  );
}

export default App;
