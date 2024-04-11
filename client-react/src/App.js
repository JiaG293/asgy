// App.js
import React from 'react';
import './App.css';
import Chat from './components/Chat/Chat';

function App() {
  return (
    <div className="app">
      <div className="app__body">
        <Chat />
      </div>
    </div>
  );
}

export default App;
