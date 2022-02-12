import React from 'react'

function ChatBox({messages, currentSelectedRoom, roomsList}) {
  

    if(roomsList?.length === 0) {
        return (
            <div className="no-room-selected">
                No Room is created Till now!!
            </div>
        );
    }

    if(!currentSelectedRoom) {
        return (
            <div className="no-room-selected">
                No Room is selected Right Now
            </div>
        );
    }

    if(currentSelectedRoom && (messages[currentSelectedRoom]?.length === 0 || !messages[currentSelectedRoom])) {
        return (<div className="no-messages">
            No Messages are sent in this Room - Since you have joined that
        </div>);
    }
        
    return (
        <div className="chat-box">
            {messages[currentSelectedRoom]?.map((msg, index) => <p key={index}>{msg}</p>)}
        </div>
    )
}

export default ChatBox