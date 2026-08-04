import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import portlandBg from "../assets/portlandbg.jpg";

const FIELD_ICONS = {
  name: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  date: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  time: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  location: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  price: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1m0-24v1" /></svg>,
  tags: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  image: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  type: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  organizer: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
};

const TimeWheel = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: "12", minute: "00", period: "PM" };
    const parts = timeStr.split(" ");
    if (parts.length !== 2) return { hour: "12", minute: "00", period: "PM" };
    const [time, period] = parts;
    const timeParts = time.split(":");
    if (timeParts.length !== 2) return { hour: "12", minute: "00", period: "PM" };
    const [hour, minute] = timeParts;
    return { hour, minute, period };
  };

  const { hour, minute, period } = parseTime(value);
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ["AM", "PM"];

  const updateTime = (h, m, p) => {
    onChange(`${h}:${m} ${p}`);
  };

  return (
    <div className="relative">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
          {label} <span className="text-accent">*</span>
        </label>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-slate-800/50 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white cursor-pointer hover:border-accent transition-all flex items-center relative group text-sm"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-hover:text-accent transition-colors">
            {FIELD_ICONS.time}
          </div>
          <span>{value || "Select Time"}</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[109]" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-[110] top-full left-0 mt-2 p-3 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex gap-3 w-[260px]"
            >
              <div className="flex-1 h-40 overflow-y-auto scrollbar-hide text-center">
                <div className="text-[9px] font-bold text-slate-500 mb-2">HOUR</div>
                {hours.map(h => (
                  <div
                    key={h}
                    onClick={() => updateTime(h, minute, period)}
                    className={`py-1.5 cursor-pointer rounded-lg transition-colors text-sm ${h === hour ? 'bg-accent text-white font-bold' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    {h}
                  </div>
                ))}
              </div>
              <div className="flex-1 h-40 overflow-y-auto scrollbar-hide text-center border-x border-white/5 px-1">
                <div className="text-[9px] font-bold text-slate-500 mb-2">MIN</div>
                {minutes.map(m => (
                  <div
                    key={m}
                    onClick={() => updateTime(hour, m, period)}
                    className={`py-1.5 cursor-pointer rounded-lg transition-colors text-sm ${m === minute ? 'bg-accent text-white font-bold' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    {m}
                  </div>
                ))}
              </div>
              <div className="flex-1 text-center">
                <div className="text-[9px] font-bold text-slate-500 mb-2">AM/PM</div>
                {periods.map(p => (
                  <div
                    key={p}
                    onClick={() => updateTime(hour, minute, p)}
                    className={`py-5 cursor-pointer rounded-lg transition-colors text-sm ${p === period ? 'bg-accent text-white font-bold' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, onBlur, type = "text", placeholder, required = false, icon }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-accent transition-colors">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onMouseDown={(e) => {
            if (type === "date") e.preventDefault();
          }}
          onClick={(e) => {
            if (type === "date" && e.target.showPicker) e.target.showPicker();
          }}
          required={required}
          className={`w-full bg-slate-800/50 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm [color-scheme:dark] ${type === "date" ? "select-none caret-transparent" : ""}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

const SubmitEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    category: "",
    otherCategory: "",
    price: "",
    type: "",
    otherType: "",
    organizer: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [showOtherType, setShowOtherType] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "" });

  const categories = ["Music", "Food", "Arts", "Sports", "Technology", "Education", "Health", "Other"];
  const eventTypes = ["Concert", "Festival", "Workshop", "Conference", "Market", "Art Show", "Sports", "Networking", "Community"];

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") setShowOtherCategory(value === "Other");
    if (name === "type") setShowOtherType(value === "Other");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceBlur = (e) => {
    let value = e.target.value.trim();
    if (value === "" || value === "0" || value.toLowerCase() === "free") {
      setFormData(prev => ({ ...prev, price: "Free" }));
    } else if (/^\d+(\.\d{1,2})?$/.test(value)) {
      setFormData(prev => ({ ...prev, price: `$${value}` }));
    }
  };

  const handleTimeChange = (name, newTime) => {
    setFormData(prev => ({ ...prev, [name]: newTime }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime) {
      setAlert({ show: true, message: "Please select both start and end times." });
      return;
    }

    const parseTimeToMinutes = (timeStr) => {
      const parts = timeStr.split(" ");
      const [time, period] = parts;
      let [hours, minutes] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    if (parseTimeToMinutes(formData.endTime) <= parseTimeToMinutes(formData.startTime)) {
      setAlert({ show: true, message: "End time must be after start time." });
      return;
    }

    if ((showOtherCategory && !formData.otherCategory) || (showOtherType && !formData.otherType)) {
      setAlert({ show: true, message: "Please specify 'Other' field value." });
      return;
    }

    setIsSubmitting(true);

    try {
      const dupResponse = await fetch("http://localhost:3001/api/events/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, date: formData.date, location: formData.location }),
      });
      const dupData = await dupResponse.json();
      if (dupData.duplicate) {
        setAlert({ show: true, message: "A similar event already exists or is pending approval." });
        setIsSubmitting(false);
        return;
      }

      const finalCategory = showOtherCategory ? formData.otherCategory : formData.category;
      const finalType = showOtherType ? formData.otherType : formData.type;
      
      const eventToSubmit = {
        ...formData,
        type: finalType,
        time: `${formData.startTime} - ${formData.endTime}`,
        tags: [finalCategory],
        createdBy: user?.username || 'anonymous',
        requester: user,
      };

      delete eventToSubmit.startTime;
      delete eventToSubmit.endTime;
      delete eventToSubmit.category;
      delete eventToSubmit.otherCategory;
      delete eventToSubmit.otherType;

      const response = await fetch("http://localhost:3001/api/events/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventToSubmit),
      });

      if (!response.ok) throw new Error("Submission failed");
      navigate("/events");
    } catch (error) {
      console.error(error);
      setAlert({ show: true, message: "Error connecting to server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative pt-24 pb-12 px-6"
      style={{ backgroundImage: `url(${portlandBg})` }}
    >
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"></div>
      
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 30, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-0 left-1/2 z-[200] w-full max-w-sm"
          >
            <div className="mx-4 bg-red-500/10 border border-red-500/50 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 shadow-2xl shadow-red-500/20">
              <div className="bg-red-500 p-2 rounded-full">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white text-sm font-semibold">{alert.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="hidden md:flex md:w-[30%] bg-gradient-to-br from-accent to-blue-700 p-8 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 leading-tight">Submit Event</h2>
              <p className="text-blue-100 text-xs leading-relaxed">
                Share your upcoming event with the community. It will be reviewed by our team before going live.
              </p>
            </div>
            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">Process</p>
              <p className="text-[9px] text-blue-100/80">Submit → Review → Published</p>
            </div>
          </div>

          <div className="flex-1 p-8 md:p-12">
            <h1 className="text-3xl font-bold text-white mb-8">Event Details</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputField label="Event Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Portland Jazz Night" required icon={FIELD_ICONS.name} />
                </div>
                <InputField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} required icon={FIELD_ICONS.date} />
                <InputField label="Organizer" name="organizer" value={formData.organizer} onChange={handleChange} placeholder="e.g. PDX Arts Collective" required icon={FIELD_ICONS.organizer} />
                <TimeWheel label="Start Time" value={formData.startTime} onChange={(time) => handleTimeChange("startTime", time)} />
                <TimeWheel label="End Time" value={formData.endTime} onChange={(time) => handleTimeChange("endTime", time)} />
                <div className="md:col-span-2">
                  <InputField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Full address or venue name" required icon={FIELD_ICONS.location} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Category <span className="text-accent">*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm">
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Event Type <span className="text-accent">*</span></label>
                  <select name="type" value={formData.type} onChange={handleChange} required className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm">
                    <option value="" disabled>Select Type</option>
                    {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                {showOtherCategory && <InputField label="Specify Category" name="otherCategory" value={formData.otherCategory} onChange={handleChange} placeholder="Type your category..." required icon={FIELD_ICONS.tags} />}
                {showOtherType && <InputField label="Specify Type" name="otherType" value={formData.otherType} onChange={handleChange} placeholder="Type your event type..." required icon={FIELD_ICONS.type} />}
                <InputField label="Price / Entry Fee" name="price" value={formData.price} onChange={handleChange} onBlur={handlePriceBlur} placeholder="e.g. Free or $10" required icon={FIELD_ICONS.price} />
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Description <span className="text-accent">*</span></label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm resize-none" placeholder="Tell people what your event is about..." />
                </div>
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button type="button" onClick={() => navigate("/events")} className="flex-1 px-8 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] px-8 py-4 rounded-2xl bg-accent text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitEvent;
