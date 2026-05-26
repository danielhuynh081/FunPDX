import React from "react";
import { motion } from "framer-motion";

import portlandBg from "../assets/portlandbg.jpg";
const events = [
  {
    id: 1,
    name: "Tech Conference 2026",
    date: "June 15, 2026",
    location: "Portland Convention Center",
    description:
      "A gathering of tech enthusiasts, startups, and industry leaders to discuss the latest trends in technology.",
    image: "https://source.unsplash.com/400x300/?conference",
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
    image: "https://source.unsplash.com/400x300/?music-festival",
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
    image: "https://source.unsplash.com/400x300/?food-truck",
    link: "https://www.foodtruckrally.com",
    tags: ["Food", "Truck", "Rally"],
  },
];

const Events = () => {
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

      <div className="container mx-auto px-6 relative z-10">
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
            className="w-full rounded-2xl bg-white/10 p-6 md:p-8 backdrop-blur-md border border-white/20"
          >
            {/* Grid Layout */}
            <div className="grid grid-cols-3 gap-10 sm:grid-cols-2 md:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl mb-20 bg-zinc-100/90 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="text-lg font-bold text-gray-900">
                    {event.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    {event.date}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{event.location}</p>
                  <p className="mt-3 text-sm text-gray-800">
                    {event.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Events;
