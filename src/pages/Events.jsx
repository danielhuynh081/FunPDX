import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import FilterBar from "../components/FilterBar";
import portlandBg from "../assets/portlandbg.jpg";
import placeholderImage from "../assets/placeholder.png";

const ITEMS_PER_PAGE = 12;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedEvents, setSavedEvents] = useState(() => {
    const saved = localStorage.getItem("savedEvents");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  const toggleSaveEvent = (e, event) => {
    e.stopPropagation();
    const isSaved = savedEvents.some((item) => item._id === event._id || item.id === event.id);
    if (isSaved) {
      setSavedEvents(savedEvents.filter((item) => (item._id || item.id) !== (event._id || event.id)));
    } else {
      setSavedEvents([...savedEvents, event]);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3001/api/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = [
    "All",
    ...new Set(
      events.flatMap((event) => (event.tags || []).map((t) => t.toLowerCase()))
    ),
  ].map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1));

  const filteredEvents = events.filter((event) => {
    const matchesSearch = (event.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      (event.tags || []).some((t) => t.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to page 1 when filter changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const Pagination = () =>
    totalPages > 1 && (
      <div className="flex justify-end items-center gap-4 py-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all text-sm"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-lg border transition-all text-sm ${
                currentPage === i + 1
                  ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all text-sm"
        >
          Next
        </button>
      </div>
    );

  return (
    <section
      id="events"
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
              Upcoming <span className="text-accent">Events</span>
            </h1>
            <p className="text-slate-400 mb-8 max-w-xl">
              Discover what's happening in the city. Filter by category or
              search for specific keywords.
            </p>
          </motion.div>

          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
              <FilterBar
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={handleCategoryChange}
              />

              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-all backdrop-blur-md"
                  onChange={handleSearchChange}
                  value={search}
                />
              </div>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
              {isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400 animate-pulse">Loading events...</p>
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-red-400 text-lg mb-4">Oops! {error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage + activeCategory + search}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="contents"
                  >
                    {paginatedEvents.map((event, index) => (
                      <motion.div
                        key={event._id || event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.03,
                          ease: "easeOut" 
                        }}
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
                              onClick={(e) => toggleSaveEvent(e, event)}
                              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                                savedEvents.some((item) => (item._id || item.id) === (event._id || event.id))
                                  ? "bg-accent text-white"
                                  : "bg-black/20 text-white hover:bg-black/40"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill={
                                  savedEvents.some((item) => (item._id || item.id) === (event._id || event.id))
                                    ? "currentColor"
                                    : "none"
                                }
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                              {(event.tags && event.tags[0]) || "Event"}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-sm text-slate-400">{event.date}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {paginatedEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-slate-500 text-lg">
                  No events found matching your criteria.
                </p>
              </motion.div>
            )}
          </div>
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
                  {selectedEvent.tags.map((tag) => (
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
                <a
                  href={selectedEvent.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block w-full text-center py-4 bg-accent text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-accent/20 mb-3"
                >
                  Get Tickets / View Details
                </a>
                <button
                  onClick={(e) => toggleSaveEvent(e, selectedEvent)}
                  className={`w-full py-4 font-bold rounded-2xl transition-all border ${
                    savedEvents.some((item) => (item._id || item.id) === (selectedEvent._id || selectedEvent.id))
                      ? "bg-white/10 text-white border-white/20"
                      : "bg-transparent text-white border-white/20 hover:bg-white/5"
                  }`}
                >
                  {savedEvents.some((item) => (item._id || item.id) === (selectedEvent._id || selectedEvent.id))
                    ? "❤️ Saved"
                    : "🤍 Save Event"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Events;
