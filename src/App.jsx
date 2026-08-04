import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import SubmitEvent from "./pages/SubmitEvent";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scroll(0, 0);
  }, []);

  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/events" element={<Events />} />
          <Route path="/submit-event" element={<SubmitEvent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
