import "./App.css";
import IsAnon from "./components/IsAnon";
import IsPrivate from "./components/IsPrivate";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AreasPage from "./pages/AreasPage";
import Header from "./components/Header";
import HabitPage from "./pages/HabitPage";
import { ToastContainer } from "react-toastify";
import DailyHabitsPage from "./pages/DailyHabitsPage";

function App() {
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route
            path="/signup"
            element={
              <IsAnon>
                <SignUpPage />
              </IsAnon>
            }
          />
          <Route
            path="/login"
            element={
              <IsAnon>
                <LoginPage />
              </IsAnon>
            }
          />
          <Route
            path="/"
            element={
              <IsPrivate>
                <HomePage />
              </IsPrivate>
            }
          />
          <Route
            path="/areas"
            element={
              <IsPrivate>
                <AreasPage />
              </IsPrivate>
            }
          />
          <Route path="/habits" element={<IsPrivate>
            <HabitPage />
          </IsPrivate>}
          />
          <Route path="/dailyhabits" element={<IsPrivate>
            <DailyHabitsPage />
          </IsPrivate>}
          />
        </Routes>
        <ToastContainer
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover  
            />
      </div>
    </>
  );
}

export default App;
