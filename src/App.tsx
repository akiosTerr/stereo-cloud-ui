import { Link, Route, Routes} from 'react-router-dom'
import './App.css'
import { useAuth } from './hooks/auth_hook'
import { SetAuthCtx } from './Contexts'
import VideoTable from './components/VideoTable'
import Player from './components/Player'
import { AiFillHome } from 'react-icons/ai'

function App() {
  const { loggedIn, login, logout } = useAuth();

  return (
    <>
        <SetAuthCtx.Provider value={{ isLoggedIn: loggedIn, login, logout }}>
          <nav>
            <Link to="/"><AiFillHome size={24}/></Link>
          </nav>
          <Routes>
            <Route path="/" element={<VideoTable/>} />
            <Route path="/player/" element={<Player />} />
          </Routes>
        </SetAuthCtx.Provider>
    </>
  )
}

export default App
