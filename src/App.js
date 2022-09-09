import { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import Menu from './components/Menu';
import Solo from './components/Solo';
import Settings from './components/Settings';
import Multiplayer from './components/Multiplayer';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Menu />}/>
        <Route path='solo' element={<Solo />}/>
        <Route path='multiplayer' element={<Multiplayer />}/>
        <Route path='settings' element={<Settings />}/>
      </Routes>
    </div>
  );
}

export default App;
