import { Link, Route, Routes, HashRouter as Router } from 'react-router-dom'
import './App.css'
import Uploader from './components/Uploader'
import { useAuth } from './hooks/auth_hook'
import { SetAuthCtx } from './Contexts'
import VideoTable from './components/VideoTable'
import Player from './components/Player'

function App() {
  const { loggedIn, login, logout } = useAuth();

  return (
    <>
        <SetAuthCtx.Provider value={{ isLoggedIn: loggedIn, login, logout }}>
          <nav>
            <Link to="/">Home</Link> | <Link to="/upload">Upload</Link>
          </nav>
          <Routes>
            <Route path="/" element={<VideoTable/>} />
            <Route path="/upload" element={<Uploader />} />
            <Route path="/player/:id" element={<Player />} />
          </Routes>
        </SetAuthCtx.Provider>
    </>
  )
}

export default App
