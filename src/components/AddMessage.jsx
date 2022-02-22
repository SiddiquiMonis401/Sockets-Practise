import React, { useState } from 'react'

function AddMessage({ setMessages, socket, currentSelectedRoom, username }) {

  const [message, setMessage] = useState('');

  const onSendNewMessage = () => {

    setMessages(currentSelectedRoom, message, username);
    socket.emit('new_message_from_client', { msg: message, room: currentSelectedRoom, username });
    setMessage('');
  
  }

  return (
    <div className="add-message">
        <input value={message} onChange={(event) => setMessage(event.target.value)} />
        <button onClick={onSendNewMessage}>Send Message</button>
    </div>
  )
}

export default AddMessage