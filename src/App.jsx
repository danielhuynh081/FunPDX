import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";

const App = () => {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scroll(0, 0);
  }, []);

  return (
    <div>
      <Navbar />
      <main>
        <Hero></Hero>
      </main>
    </div>
  );
};

export default App;
