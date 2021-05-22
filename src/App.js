import React from 'react'
import './App.css';
import './css/chat.css'
import Chat from './Components/Chat'
import Map from './Components/Map'

function App() {
  return (
    <div className="App">
        <div className="chat-box">
        <Chat />
      </div>
    </div>
  );
}

export default App;
