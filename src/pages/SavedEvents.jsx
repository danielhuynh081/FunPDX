import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import portlandBg from "../assets/portlandbg.jpg";
import placeholderImage from "../assets/placeholder.png";

const SavedEvents = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("savedEvents");
    if (saved) {
      setSavedEvents(JSON.parse(saved));
    }
  }, []);

  const removeEvent = (e, eventId) => {
    e.stopPropagation();
    const updated = savedEvents.filter((event) => (event._id || event.id) !== eventId);
    setSavedEvents(updated);
    localStorage.setItem("savedEvents", JSON.stringify(updated));
  };

  return (
    <section
      id="savedevents"
      className="min-h-screen bg-cover bg-center relative flex items-start pt-16 md:pt-32"
      style={{
        backgroundImage: `url(${portlandBg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter">
              Saved <span className="text-accent">Events</span>
            </h1>
            <p className="text-slate-400 mb-8 max-w-xl">
              Your personal shortlist of upcoming experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            <AnimatePresence>
              {savedEvents.map((event, index) => (
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
                  <div className="relative aspect-video overflow-hidden rounded-2xl mb-4">
                    <img
                      src={event.image || placeholderImage}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => removeEvent(e, event._id || event.id)}
                        className="p-2 rounded-full bg-red-500/80 text-white backdrop-blur-md hover:bg-red-600 transition-all"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
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
              className="text-center py-20"
            >
              <p className="text-slate-500 text-lg mb-8">
                You haven't saved any events yet.
              </p>
              <a
                href="/events"
                className="px-8 py-3 bg-accent text-white font-bold rounded-xl hover:bg-blue-600 transition-all"
              >
                Browse Events
              </a>
            </motion.div>
          )}
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
              className="relative bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-10"
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              </div>

              <div className="p-8 md:p-12 -mt-20 relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(selectedEvent.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {selectedEvent.name}
                </h2>
                <div className="flex flex-col gap-2 mb-8 text-slate-400">
                  <p className="flex items-center gap-2">
                    📅 {selectedEvent.date}
                  </p>
                  <p className="flex items-center gap-2">
                    📍 {selectedEvent.location}
                  </p>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-10">
                  {selectedEvent.description}
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={selectedEvent.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full text-center py-4 bg-accent text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-accent/20"
                  >
                    Get Tickets / View Details
                  </a>
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

export default SavedEvents;
