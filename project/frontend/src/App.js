import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Lobby from './components/Lobby';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/lobby" element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;