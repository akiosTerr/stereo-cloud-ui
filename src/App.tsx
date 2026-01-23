import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useAuth } from './hooks/auth_hook'
import { SetAuthCtx } from './Contexts'
import VideoTable from './components/VideoTable'
import Player from './components/Player'
import Uploader from './components/Uploader'
import Navbar from './components/Navbar'
import Home from './components/Home'

function App() {
  const { loggedIn, login, logout } = useAuth();

  return (
    <>
      <SetAuthCtx.Provider value={{ isLoggedIn: loggedIn, login, logout }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<VideoTable />} />
          <Route path="/player/:playbackId" element={<Player />} />
          <Route path="/upload/" element={<Uploader />} />
        </Routes>
      </SetAuthCtx.Provider>
    </>
  )
}

export default App
