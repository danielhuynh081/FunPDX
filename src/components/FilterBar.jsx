import React from "react";
import { motion } from "framer-motion";

const FilterBar = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-3 py-6">
      {categories.map((category, index) => (
        <motion.button
          key={category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectCategory(category)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
            activeCategory === category
              ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
          }`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterBar;
