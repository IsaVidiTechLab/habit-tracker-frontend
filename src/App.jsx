import './App.css'
import IsAnon from './components/IsAnon'
import IsPrivate from './components/IsPrivate'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage'
function App() {

  return (
    <>
     <div>
      <Routes>
        <Route path="/signup" element={<IsAnon><SignUpPage /></IsAnon>} />
        <Route path="/login" element={<IsAnon><LoginPage /></IsAnon>} />
        <Route path='/' element={<HomePage/>}/>
      </Routes>
     </div>
    </>
  )
}

export default App
