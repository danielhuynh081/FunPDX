import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
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
    tags: ["Food", "Truck", "Rally"],
  },
];

const Events = () => {
  const [search, setSearch] = useState("");
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState(null);

  return (
    <section
      id="events"
      className="min-h-screen bg-cover bg-center relative flex items-start pt-16 md:pt-32 "
      style={{
        backgroundImage: `url(${portlandBg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="EventPage container mx-auto px-6 relative z-10">
        <div className="max-w-8xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tighter leading-tight">
              Events
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="EventPageContents relative w-full rounded-2xl bg-white/10 p-6 md:p-8 backdrop-blur-md border border-black/20"
          >
            {/* Filter Buttons */}
            <button
              className="  top-4 max-w-sm rounded-2xl bg-white border border-black/20"
              onClick={() => setFilter("on")}
            >
              filter
            </button>
            {/* Search bar */}
            <div className="absolute right-6 top-4 w-full max-w-sm rounded-2xl bg-white border border-black/20">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-black placeholder-gray-300 focus:outline-none transition-colors"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            {/* Grid Layout */}
            <div className="grid grid-cols-3 gap-10 sm:grid-cols-2 md:grid-cols-3 pt-11">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl mb-20 bg-zinc-100/90 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div>
                    <img
                      src={event.image || placeholderImage}
                      alt={event.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.onerror = null; // Prevents infinite loops if placeholder fails
                        e.target.src = placeholderImage;
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {event.name}
                  </h3>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
              >
                ✕
              </button>

              <img
                src={selectedEvent.image || placeholderImage}
                alt={selectedEvent.name}
                className="w-full h-60 object-cover rounded-xl mb-4 my-8"
              />

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedEvent.name}
              </h2>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {selectedEvent.date}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {selectedEvent.location}
              </p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedEvent.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={selectedEvent.link}
                target="_blank"
                rel="noreferrer"
                className="block text-center w-full bg-black/90 hover:bg-black/80 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Visit Event Website
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {filter && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
              >
                ✕
              </button>

              <img
                src={selectedEvent.image || placeholderImage}
                alt={selectedEvent.name}
                className="w-full h-60 object-cover rounded-xl mb-4 my-8"
              />

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedEvent.name}
              </h2>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {selectedEvent.date}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {selectedEvent.location}
              </p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedEvent.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={selectedEvent.link}
                target="_blank"
                rel="noreferrer"
                className="block text-center w-full bg-black/90 hover:bg-black/80 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Visit Event Website
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Events;
