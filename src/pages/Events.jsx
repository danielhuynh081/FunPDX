import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import FilterBar from "../components/FilterBar";
import portlandBg from "../assets/portlandbg.jpg";
import placeholderImage from "../assets/placeholder.png";

const events = [
  {
    id: 1,
    name: "Tech Conference 2026",
    date: "June 15, 2026",
    location: "Portland Convention Center",
    description:
      "A gathering of tech enthusiasts, startups, and industry leaders to discuss the latest trends in technology.",
    image: null,
    link: "https://www.techconference2026.com",
    tags: ["Tech", "Conference", "Networking"],
  },
  {
    id: 2,
    name: "Portland Music Festival",
    date: "July 10, 2026",
    location: "Tom McCall Waterfront Park",
    description:
      "An outdoor music festival featuring local and national artists across multiple stages.",
    image: null,
    link: "https://www.portlandmusicfestival.com",
    tags: ["Music", "Festival", "Outdoor"],
  },
  {
    id: 3,
    name: "Food Truck Rally",
    date: "August 5, 2026",
    location: "Portland State University",
    description:
      "A gathering of Portland's best food trucks offering a variety of cuisines.",
    image: null,
    link: "https://www.foodtruckrally.com",
    tags: ["Food", "Truck", "Rally", "music"],
  },
  {
    id: 1,
    name: "Tech Conference 2026",
    date: "June 15, 2026",
    location: "Portland Convention Center",
    description:
      "A gathering of tech enthusiasts, startups, and industry leaders to discuss the latest trends in technology.",
    image: null,
    link: "https://www.techconference2026.com",
    tags: ["Tech", "Conference", "Networking"],
  },
  {
    id: 2,
    name: "Portland Music Festival",
    date: "July 10, 2026",
    location: "Tom McCall Waterfront Park",
    description:
      "An outdoor music festival featuring local and national artists across multiple stages.",
    image: null,
    link: "https://www.portlandmusicfestival.com",
    tags: ["Music", "Festival", "Outdoor"],
  },
  {
    id: 3,
    name: "Food Truck Rally",
    date: "August 5, 2026",
    location: "Portland State University",
    description:
      "A gathering of Portland's best food trucks offering a variety of cuisines.",
    image: null,
    link: "https://www.foodtruckrally.com",
    tags: ["Food", "Truck", "Rally", "music"],
  },
  {
    id: 1,
    name: "Tech Conference 2026",
    date: "June 15, 2026",
    location: "Portland Convention Center",
    description:
      "A gathering of tech enthusiasts, startups, and industry leaders to discuss the latest trends in technology.",
    image: null,
    link: "https://www.techconference2026.com",
    tags: ["Tech", "Conference", "Networking"],
  },
  {
    id: 2,
    name: "Portland Music Festival",
    date: "July 10, 2026",
    location: "Tom McCall Waterfront Park",
    description:
      "An outdoor music festival featuring local and national artists across multiple stages.",
    image: null,
    link: "https://www.portlandmusicfestival.com",
    tags: ["Music", "Festival", "Outdoor"],
  },
  {
    id: 3,
    name: "Food Truck Rally",
    date: "August 5, 2026",
    location: "Portland State University",
    description:
      "A gathering of Portland's best food trucks offering a variety of cuisines.",
    image: null,
    link: "https://www.foodtruckrally.com",
    tags: ["Food", "Truck", "Rally", "music"],
  },
  {
    id: 1,
    name: "Tech Conference 2026",
    date: "June 15, 2026",
    location: "Portland Convention Center",
    description:
      "A gathering of tech enthusiasts, startups, and industry leaders to discuss the latest trends in technology.",
    image: null,
    link: "https://www.techconference2026.com",
    tags: ["Tech", "Conference", "Networking"],
  },
  {
    id: 2,
    name: "Portland Music Festival",
    date: "July 10, 2026",
    location: "Tom McCall Waterfront Park",
    description:
      "An outdoor music festival featuring local and national artists across multiple stages.",
    image: null,
    link: "https://www.portlandmusicfestival.com",
    tags: ["Music", "Festival", "Outdoor"],
  },
  {
    id: 3,
    name: "Food Truck Rally",
    date: "August 5, 2026",
    location: "Portland State University",
    description:
      "A gathering of Portland's best food trucks offering a variety of cuisines.",
    image: null,
    link: "https://www.foodtruckrally.com",
    tags: ["Food", "Truck", "Rally", "music"],
  },
  {
    id: 1,
    name: "Tech Conference 2026",
    date: "June 15, 2026",
    location: "Portland Convention Center",
    description:
      "A gathering of tech enthusiasts, startups, and industry leaders to discuss the latest trends in technology.",
    image: null,
    link: "https://www.techconference2026.com",
    tags: ["Tech", "Conference", "Networking"],
  },
  {
    id: 2,
    name: "Portland Music Festival",
    date: "July 10, 2026",
    location: "Tom McCall Waterfront Park",
    description:
      "An outdoor music festival featuring local and national artists across multiple stages.",
    image: null,
    link: "https://www.portlandmusicfestival.com",
    tags: ["Music", "Festival", "Outdoor"],
  },
  {
    id: 3,
    name: "Food Truck Rally",
    date: "August 5, 2026",
    location: "Portland State University",
    description:
      "A gathering of Portland's best food trucks offering a variety of cuisines.",
    image: null,
    link: "https://www.foodtruckrally.com",
    tags: ["Food", "Truck", "Rally", "music"],
  },
];

const ITEMS_PER_PAGE = 12;

const Events = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    "All",
    ...new Set(
      events.flatMap((event) => event.tags.map((t) => t.toLowerCase()))
    ),
  ].map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1));

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      event.tags.some((t) => t.toLowerCase() === activeCategory.toLowerCase());
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

            <div className="mb-4">
              <Pagination />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
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
                      key={event.id}
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
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                            {event.tags[0]}
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
                  className="inline-block w-full text-center py-4 bg-accent text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-accent/20"
                >
                  Get Tickets / View Details
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Events;
