import React from 'react'

function RoomsList({ roomsList, setCurrentSelectedRoom, currentSelectedRoom }) {
  return (
    <>
        <div className="rooms_list">
        <header>Rooms</header>
            <ul>
                {
                    roomsList.map((room) => (
                        <li className={`${room === currentSelectedRoom ? 'selected-room' : ''}`} onClick={() => setCurrentSelectedRoom(room)} key={room}>
                            {room}
                        </li>    
                    ))
                }
            </ul>
        </div>
    </>
  )
}

export default RoomsList