import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FilterBar from "../components/FilterBar";
import AddEventModal from "../components/AddEventModal";
import portlandBg from "../assets/portlandbg.jpg";
import placeholderImage from "../assets/placeholder.png";

const ITEMS_PER_PAGE = 12;

const Pagination = ({ currentPage, totalPages, setCurrentPage }) =>
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

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
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

  const handleDeleteEvent = async (e, eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const queryParams = new URLSearchParams({
        username: user?.username || "",
        role: user?.role || ""
      }).toString();

      const response = await fetch(`http://localhost:3001/api/events/${eventId}?${queryParams}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      setEvents(events.filter((e) => e._id !== eventId));
      if (selectedEvent && selectedEvent._id === eventId) {
        setSelectedEvent(null);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      alert(err.message);
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

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEventToEdit(null);
  };

  const handleEditEvent = (e, event) => {
    e.stopPropagation();
    setEventToEdit(event);
    setIsAddModalOpen(true);
  };

  const categories = [
    "All",
    "Music",
    "Food",
    "Arts",
    "Sports",
    "Technology",
    "Education",
    "Health",
    "Other"
  ];

  // Trending Logic: upcoming 4
  const trendingEvents = [...events]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  const filteredEvents = events
    .filter((event) => {
      // Date filtering: Only show events that haven't passed yet
      // We assume event.date is in YYYY-MM-DD format
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(event.date);
      
      // If date is invalid or in the future/today, keep it
      const isUpcoming = isNaN(eventDate.getTime()) || eventDate >= today;
      
      const matchesSearch = (event.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" ||
        (event.tags || []).some((t) => t.toLowerCase() === activeCategory.toLowerCase());
      
      return isUpcoming && matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by date: closest to farthest
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      // Handle invalid dates by pushing them to the end
      const timeA = isNaN(dateA.getTime()) ? Infinity : dateA.getTime();
      const timeB = isNaN(dateB.getTime()) ? Infinity : dateB.getTime();
      
      return timeA - timeB;
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
        <AddEventModal 
          isOpen={isAddModalOpen} 
          onClose={handleCloseModal} 
          categories={categories}
          eventToEdit={eventToEdit}
        />
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

          {/* Trending Events */}
          {!search && activeCategory === "All" && trendingEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                Trending Now
              </h2>
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
                {trendingEvents.map((event) => (
                  <div 
                    key={event._id} 
                    onClick={() => setSelectedEvent(event)}
                    className="min-w-[300px] h-40 bg-white/5 rounded-2xl border border-white/10 p-4 flex gap-4 cursor-pointer hover:bg-white/10 transition-all snap-start"
                  >
                    <div className="w-24 h-full rounded-xl overflow-hidden shrink-0">
                      <img src={event.image || placeholderImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-white font-bold line-clamp-1">{event.name}</h3>
                        <p className="text-accent text-[10px] font-bold uppercase tracking-widest">{event.tags?.[0]}</p>
                      </div>
                      <div className="text-xs text-slate-400">
                        <p>{event.date}</p>
                        <p className="truncate w-32">{event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-12">
            <div className="flex items-center gap-6 mb-4">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-12 pr-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-all backdrop-blur-md"
                  onChange={handleSearchChange}
                  value={search}
                />
              </div>

              <FilterBar
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={handleCategoryChange}
              />

              <div className="ml-auto">
                <Link 
                  to="/submit-event"
                  className="whitespace-nowrap px-8 py-3 bg-accent text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Submit Event
                </Link>
              </div>
            </div>

            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              setCurrentPage={setCurrentPage} 
            />

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
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            {user && (
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
                            )}
                            {(user?.role === 'admin' || (user && event.createdBy === user.username)) && (
                              <>
                                <button
                                  onClick={(e) => handleEditEvent(e, event)}
                                  className="p-2 rounded-full backdrop-blur-md bg-black/20 text-white hover:bg-accent transition-all opacity-0 group-hover:opacity-100 mr-2"
                                  title="Edit Event"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => handleDeleteEvent(e, event._id || event.id)}
                                  className="p-2 rounded-full backdrop-blur-md bg-black/20 text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                                  title="Delete Event"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </>
                            )}
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
                        <div className="flex flex-col gap-1.5 text-sm text-slate-400">
                          <div className="flex items-center gap-3">
                            <p className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {event.date}
                            </p>
                            {event.time && (
                              <p className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {event.time}
                              </p>
                            )}
                            {event.type && (
                              <p className="flex items-center gap-1.5 ml-auto text-xs font-semibold text-accent/80 uppercase tracking-wider">
                                {event.type}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            {event.location && (
                              <p className="flex items-center gap-1.5 truncate">
                                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.location}
                              </p>
                            )}
                            {event.price && (
                              <p className="flex items-center gap-1 font-semibold text-white bg-white/10 px-2 py-0.5 rounded-md text-xs whitespace-nowrap">
                                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1m0-24v1" />
                                </svg>
                                {event.price}
                              </p>
                            )}
                          </div>
                          {event.organizer && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 italic">
                              <span>By {event.organizer}</span>
                            </div>
                          )}
                        </div>
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
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            setCurrentPage={setCurrentPage} 
          />
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
                  {selectedEvent.type && (
                    <span className="bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                      {selectedEvent.type}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {selectedEvent.name}
                </h2>
                {selectedEvent.organizer && (
                  <p className="text-accent text-sm font-semibold mb-4 uppercase tracking-wider">
                    Organized by {selectedEvent.organizer}
                  </p>
                )}
                <div className="flex flex-col gap-3 mb-8 text-slate-400">
                  <p className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    {selectedEvent.date}
                  </p>
                  {selectedEvent.time && (
                    <p className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      {selectedEvent.time}
                    </p>
                  )}
                  <p className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    {selectedEvent.location}
                  </p>
                  {selectedEvent.price && (
                    <p className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1m0-24v1" />
                        </svg>
                      </span>
                      {selectedEvent.price}
                    </p>
                  )}
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

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        categories={categories}
        eventToEdit={eventToEdit}
      />
    </section>
  );
};

export default Events;
