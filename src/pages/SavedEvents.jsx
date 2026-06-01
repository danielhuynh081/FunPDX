import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import FilterBar from "../components/FilterBar";
import portlandBg from "../assets/portlandbg.jpg";

const SavedEvents = () => {
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
              Let the anticipation begin!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SavedEvents;
