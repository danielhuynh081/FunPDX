import React from "react";
import { motion } from "framer-motion";

import portlandBg from "../assets/portlandbg.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen bg-cover bg-center relative flex items-center"
      style={{
        backgroundImage: `url(${portlandBg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-accent font-semibold tracking-widest uppercase text-sm mb-4 block">
              Based in Portland
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-tight">
              Discover Portland <br />
              <span className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-tight">
                Events.
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-200 mb-12 max-w-xl leading-relaxed"
          >
            Concerts, nightlife, markets, festivals, and local experiences.
            <br />
            Find new things to do in Portland!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center space-x-8"
          >
            <a
              href="/events"
              className="px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-accent/20"
            >
              Explore Events
            </a>
            <a
              href="/savedevents"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md"
            >
              View Saved
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
