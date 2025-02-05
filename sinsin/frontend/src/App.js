// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Lobby from './pages/Lobby';
import GameRoom from './pages/GameRoom';
import MainForest from './pages/forests/MainForest';
import TwistedForest from './pages/forests/TwistedForest';
import DryForest from './pages/forests/DryForest';
import BreathingForest from './pages/forests/BreathingForest';
import FoggyForest from './pages/forests/FoggyForest';
import FairyForest from './pages/forests/FairyForest';
import TimeForest from './pages/forests/TimeForest';
import { GameProvider } from 'contexts/GameContext';

function App() {
 return (
   <GameProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game/:roomId" element={<GameRoom />}>
          <Route path="main" element={<MainForest />} />
          <Route path="twisted" element={<TwistedForest />} />
          <Route path="dry" element={<DryForest />} />
          <Route path="breathing" element={<BreathingForest />} />
          <Route path="foggy" element={<FoggyForest />} />
          <Route path="fairy" element={<FairyForest />} />
          <Route path="time" element={<TimeForest />} />
        </Route>
      </Routes>
    </BrowserRouter>
   </GameProvider>
 );
}

export default App;

// 각 컴포넌트의 background-image 부분:
/*
Login, Register, ForgotPassword: background-image: url('/forest-bg.gif')
MainForest: background-image: url('/main-forest-bg.png')
TwistedForest: background-image: url('/twisted-forest-bg.png')
DryForest: background-image: url('/dry-forest-bg.png')
BreathingForest: background-image: url('/breathing-forest-bg.png')
FoggyForest: background-image: url('/foggy-forest-bg.png')
FairyForest: background-image: url('/fairy-forest-bg.png')
TimeForest: background-image: url('/time-forest-bg.png')
*/