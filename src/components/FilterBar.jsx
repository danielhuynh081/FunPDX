import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FilterBar = ({ categories, activeCategory, onSelectCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-white/5 p-3 rounded-xl border border-white/10 transition-all hover:bg-white/10 ${
          activeCategory !== "All" ? "text-accent border-accent/50" : "text-slate-400"
        }`}
        title="Filter by Category"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {activeCategory !== "All" && (
            <span className="text-[10px] font-bold uppercase tracking-tighter">{activeCategory}</span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="py-2">
              <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">
                Categories
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onSelectCategory(category);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                    activeCategory === category
                      ? "text-accent bg-accent/10 font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {category}
                  {activeCategory === category && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
