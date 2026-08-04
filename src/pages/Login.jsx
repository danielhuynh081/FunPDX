import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      const result = register(username, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } else {
      const result = login(username, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isRegister ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent/20"
          >
            {isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
