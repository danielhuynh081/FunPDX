import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import portlandBg from "../assets/portlandbg.jpg";
import placeholderImage from "../assets/placeholder.png";

const Hero = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/events");
        const data = await response.json();
        setFeaturedEvents(data.slice(0, 4));
        setTrendingEvents(data.slice(0, 6)); // Just a slice for demo
        setUpcomingEvents(data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen text-white">
      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-10 px-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${portlandBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#020617]"></div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight">
              Discover what's <br /> happening in <span className="text-accent">Portland</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-lg">
              Find concerts, food festivals, tech meetups, and more. <br /> Events for every vibe.
            </p>



            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold">1,423</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Events This Month</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold">28,000+</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Members</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold">150+</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Venues</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold">230</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Trending This Week</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Section */}
      <section className=" px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              🔥 Trending This Week
            </h2>
            <Link to="/events" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              View all 
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x">
            {trendingEvents.map((event) => (
              <div 
                key={event._id}
                className="min-w-[320px] md:min-w-[380px] group cursor-pointer snap-start"
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4">
                  <img 
                    src={event.image || placeholderImage} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={event.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <button className="absolute top-4 right-4 p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all border border-white/10">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-lg bg-accent text-white text-[10px] font-bold uppercase tracking-widest">
                      {event.tags?.[0] || 'Event'}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{event.name}</h3>
                <div className="space-y-1.5 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date} • {event.time?.split(' - ')?.[0]}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-green-400 font-bold">{event.price}</span>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {Math.floor(Math.random() * 500) + 100}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Hero;
