import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import Events from "./pages/Events";
import SavedEvents from "./pages/SavedEvents";

const App = () => {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scroll(0, 0);
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/events" element={<Events />} />
        <Route path="/savedevents" element={<SavedEvents />} />
      </Routes>
    </div>
  );
};

export default App;
