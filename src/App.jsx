import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Shell from './layout/Shell'
import Decypher from './pages/Decypher'
import Escape from './pages/Escape'
import Game1 from './pages/Game1'
import Game2 from './pages/Game2'
import Game3 from './pages/Game3'
import Game4 from './pages/Game4'
import Home from './pages/Home'
import Invite from './pages/Invite'
import SpeakerInvite from './pages/SpeakerInvite'
import ProgressProvider from './state/ProgressProvider'

function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Home />} />
            <Route path="game/1" element={<Game1 />} />
            <Route path="game/2" element={<Game2 />} />
            <Route path="game/3" element={<Game3 />} />
            <Route path="game/4" element={<Game4 />} />
            <Route path="decypher" element={<Decypher />} />
            <Route path="invite" element={<Invite />} />
            <Route path="invite/:slug" element={<SpeakerInvite />} />
            <Route path="escape" element={<Escape />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ProgressProvider>
    </BrowserRouter>
  )
}

export default App
