import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import portlandBg from "../assets/portlandbg.jpg";
import placeholderImage from "../assets/placeholder.png";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [savedEvents, setSavedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Admin specific states
  const [submissions, setSubmissions] = useState([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const saved = localStorage.getItem("savedEvents");
    if (saved) {
      setSavedEvents(JSON.parse(saved));
    }

    if (user.role === "admin") {
      fetchSubmissions();
    }
  }, [user, navigate]);

  const fetchSubmissions = async () => {
    try {
      setIsAdminLoading(true);
      const response = await fetch("http://localhost:3001/api/events/submissions");
      if (!response.ok) throw new Error("Failed to fetch submissions");
      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/events/submissions/${id}/approve`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to approve");
      setSubmissions(submissions.filter(s => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this submission?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/events/submissions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to reject");
      setSubmissions(submissions.filter(s => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const removeEvent = (e, eventId) => {
    e.stopPropagation();
    const updated = savedEvents.filter((event) => (event._id || event.id) !== eventId);
    setSavedEvents(updated);
    localStorage.setItem("savedEvents", JSON.stringify(updated));
  };

  if (!user) return null;

  return (
    <section
      className="min-h-screen bg-cover bg-center relative flex items-start pt-24 pb-20"
      style={{
        backgroundImage: `url(${portlandBg})`,
      }}
    >
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter">
                My <span className="text-accent">Profile</span>
              </h1>
              <p className="text-slate-400">Welcome back, {user.username}. Manage your activity and content here.</p>
            </motion.div>
          </header>

          {/* Account Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Account Details</h3>
              <div className="space-y-4 text-slate-400">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Username</span>
                  <span className="text-white font-medium">{user.username}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Role</span>
                  <span className="text-accent font-bold uppercase text-xs tracking-widest">{user.role}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span>Status</span>
                  <span className="text-green-500 font-medium">Active</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Personal Dashboard</h3>
                <p className="text-slate-400 text-sm mb-6">
                  You've saved {savedEvents.length} events so far. Keep exploring Portland to find more exciting experiences!
                </p>
              </div>
              <div className="flex gap-4">
                <Link 
                  to="/events"
                  className="px-8 py-3 bg-accent text-white font-bold rounded-xl hover:brightness-110 transition-all text-sm shadow-lg shadow-accent/20"
                >
                  Explore More Events
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Admin Pending Section */}
          {user.role === 'admin' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Pending <span className="text-accent">Approvals</span></h2>
                <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-bold border border-accent/20">
                  {submissions.length} Submissions
                </span>
              </div>

              {isAdminLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : submissions.length > 0 ? (
                <div className="grid gap-6">
                  <AnimatePresence>
                    {submissions.map((sub) => (
                      <motion.div
                        key={sub._id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 backdrop-blur-sm"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold text-white">{sub.name}</h3>
                            <span className="text-[10px] bg-white/10 text-accent px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">{sub.type}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-400">
                            <p className="flex items-center gap-2">
                              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Date:</span> {sub.date}
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Time:</span> {sub.time}
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Location:</span> {sub.location}
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Organizer:</span> {sub.organizer}
                            </p>
                          </div>
                          <p className="mt-6 text-slate-300 text-sm leading-relaxed line-clamp-2">{sub.description}</p>
                        </div>
                        
                        <div className="flex gap-4 w-full md:w-auto">
                          <button 
                            onClick={() => handleReject(sub._id)}
                            className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-500 transition-all font-bold border border-white/10"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleApprove(sub._id)}
                            className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-accent hover:brightness-110 text-white transition-all font-bold shadow-lg shadow-accent/20 border border-white/10"
                          >
                            Approve
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-12 text-center text-slate-500">
                  All caught up! No pending submissions.
                </div>
              )}
            </motion.div>
          )}

          {/* Saved Events Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Saved <span className="text-accent">Events</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {savedEvents.map((event) => (
                  <motion.div
                    key={event._id || event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="relative aspect-video overflow-hidden rounded-[2rem] mb-4 border border-white/10">
                      <img
                        src={event.image || placeholderImage}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => removeEvent(e, event._id || event.id)}
                          className="p-2.5 rounded-full bg-red-500/80 text-white backdrop-blur-md hover:bg-red-600 transition-all shadow-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-sm text-slate-400">{event.date}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {savedEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-20 text-center"
              >
                <p className="text-slate-500 text-lg mb-8">
                  Your list is empty. Start saving some events!
                </p>
                <Link
                  to="/events"
                  className="px-8 py-3 bg-accent text-white font-bold rounded-xl hover:brightness-110 transition-all"
                >
                  Browse Events
                </Link>
              </motion.div>
            )}
          </div>

          {/* Logout Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-20"
          >
            <button
              onClick={handleLogout}
              className="px-12 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all backdrop-blur-md shadow-xl"
            >
              Log out
            </button>
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative bg-slate-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl z-10 border border-white/10"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all"
              >
                ✕
              </button>

              <div className="relative h-64 md:h-80">
                <img
                  src={selectedEvent.image || placeholderImage}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              </div>

              <div className="p-8 md:p-12 -mt-20 relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(selectedEvent.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-accent/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {selectedEvent.name}
                </h2>
                <div className="flex flex-col gap-2 mb-8 text-slate-400 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-accent">📅</span> {selectedEvent.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-accent">📍</span> {selectedEvent.location}
                  </p>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-10">
                  {selectedEvent.description}
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full py-4 bg-accent text-white font-bold rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-accent/20"
                  >
                    Close
                  </button>
                  <button
                    onClick={(e) => {
                      removeEvent(e, selectedEvent._id || selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    className="w-full py-4 text-red-400 font-bold rounded-2xl border border-red-500/20 hover:bg-red-500/10 transition-all"
                  >
                    Remove from Saved
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Profile;
