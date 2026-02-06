import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useAuth } from './hooks/auth_hook'
import { SetAuthCtx } from './Contexts'
import VideoTable from './components/VideoTable'
import Player from './components/Player'
import Uploader from './components/Uploader'
import Navbar from './components/Navbar'
import Home from './components/Home'
import LiveStreams from './components/LiveStreams'
import ProfilePage from './pages/ProfilePage'
import ConfirmEmailPage from './pages/ConfirmEmailPage'

function App() {
  const { loggedIn, login, logout } = useAuth();

  return (
    <>
      <SetAuthCtx.Provider value={{ isLoggedIn: loggedIn, login, logout }}>
        {loggedIn && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/controlpanel" element={<VideoTable />} />
          <Route path="/profile/:channel_name" element={<ProfilePage />} />
          <Route path="/player/:playbackId" element={<Player />} />
          <Route path="/live-streams" element={<LiveStreams />} />
          <Route path="/upload/" element={<Uploader />} />
        </Routes>
      </SetAuthCtx.Provider>
    </>
  )
}

export default App
