import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FIELD_ICONS = {
  name: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  date: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  time: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  location: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  price: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1m0-24v1" /></svg>,
  tags: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  image: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
};

const TimeWheel = React.memo(({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  // Parse initial value (expected format: "HH:MM AM/PM")
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
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
        )}
      </AnimatePresence>
    </div>
  );
});

const InputField = React.memo(({ label, name, value, onChange, onBlur, type = "text", placeholder, required = false, icon, inputRef }) => {
  // Use a local ref to maintain focus if necessary
  const localRef = useRef(null);
  
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
          ref={(node) => {
            localRef.current = node;
            if (inputRef) {
              if (typeof inputRef === 'function') {
                inputRef(node);
              } else {
                inputRef.current = node;
              }
            }
          }}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onMouseDown={(e) => {
            if (type === "date") {
              e.preventDefault();
            }
          }}
          onClick={(e) => {
            if (type === "date" && e.target.showPicker) {
              e.target.showPicker();
            }
          }}
          required={required}
          className={`w-full bg-slate-800/50 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm [color-scheme:dark] ${type === "date" ? "select-none caret-transparent" : ""}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
});

const AddEventModal = ({ isOpen, onClose, onEventAdded, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    category: "",
    otherCategory: "",
    price: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "" });
  const modalRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Auto-hide alert
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // Filter categories to remove "All" and ensure unique list
  const availableCategories = categories.filter(c => c !== "All");

  // Reset state when modal closes or refreshes
  useEffect(() => {
    const resetForm = () => {
      setFormData({
        name: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        description: "",
        category: "",
        otherCategory: "",
        price: ""
      });
      setShowOtherCategory(false);
      setAlert({ show: false, message: "" });
    };

    if (!isOpen) {
      resetForm();
    }
    
    // Handle refresh - though React state doesn't persist across refreshes anyway,
    // this ensures we start fresh if the component mounts.
  }, [isOpen]);

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === "category") {
      if (value === "Other") {
        setShowOtherCategory(true);
      } else {
        setShowOtherCategory(false);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePriceBlur = React.useCallback((e) => {
    let value = e.target.value.trim();
    if (value === "" || value === "0" || value.toLowerCase() === "free") {
      setFormData(prev => ({ ...prev, price: "Free" }));
    } else {
      // Basic format check: if it's just a number, add $
      if (/^\d+(\.\d{1,2})?$/.test(value)) {
        setFormData(prev => ({ ...prev, price: `$${value}` }));
      }
    }
  }, []);

  const handleTimeChange = React.useCallback((name, newTime) => {
    setFormData(prev => ({ ...prev, [name]: newTime }));
  }, []);

  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault();
    
    // Time Selection Validation
    if (!formData.startTime || !formData.endTime) {
      setAlert({ show: true, message: "Please select both start and end times." });
      return;
    }

    // Time Validation
    const parseTimeToMinutes = (timeStr) => {
      const parts = timeStr.split(" ");
      if (parts.length !== 2) return 0;
      const [time, period] = parts;
      const timeParts = time.split(":").map(Number);
      if (timeParts.length !== 2) return 0;
      let [hours, minutes] = timeParts;
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const startMinutes = parseTimeToMinutes(formData.startTime);
    const endMinutes = parseTimeToMinutes(formData.endTime);

    if (endMinutes <= startMinutes) {
      setAlert({ show: true, message: "End time must be after start time." });
      return;
    }
    
    // Validation
    const requiredFields = ['name', 'date', 'startTime', 'endTime', 'location', 'description', 'price', 'category'];
    if (showOtherCategory && !formData.otherCategory) {
      setAlert({ show: true, message: "Please specify the other category." });
      return;
    }

    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setAlert({ show: true, message: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);
    
    const finalCategory = showOtherCategory ? formData.otherCategory : formData.category;
    const tagsArray = [finalCategory];
      
    const eventToSubmit = {
      ...formData,
      time: `${formData.startTime} - ${formData.endTime}`,
      tags: tagsArray,
    };

    // Clean up internal state fields not needed by API
    delete eventToSubmit.startTime;
    delete eventToSubmit.endTime;
    delete eventToSubmit.category;
    delete eventToSubmit.otherCategory;

    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventToSubmit),
      });

      if (response.ok) {
        const newEvent = await response.json();
        onEventAdded(newEvent);
        onClose();
      } else {
        setAlert({ show: true, message: "Failed to add event. Please try again." });
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setAlert({ show: true, message: "Error connecting to server." });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, showOtherCategory, onEventAdded, onClose]);


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm">
          {/* Styled Alert Notification */}
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

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#0f172a] border border-white/10 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[700px]"
          >
            {/* Left side - Decoration/Info */}
            <div className="hidden md:flex md:w-[30%] bg-gradient-to-br from-accent to-blue-700 p-8 flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 leading-tight">Create a New Event</h2>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Share your upcoming event with the community. Fill in the details to get started.
                </p>
              </div>
              
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Live Preview Coming Soon</span>
                </div>
                <p className="text-[9px] text-blue-100/80">Your event will be instantly visible to all users after submission.</p>
              </div>

              {/* Decorative circles */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-4 md:p-6 flex justify-between items-center md:hidden border-b border-white/5">
                <h2 className="text-xl font-bold text-white">New Event</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto md:overflow-y-auto p-6 md:p-8 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <InputField 
                      key="input-name"
                      label="Event Name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Portland Jazz Night" 
                      required 
                      icon={FIELD_ICONS.name}
                    />
                  </div>
                  
                  <InputField 
                    key="input-date"
                    label="Date" 
                    name="date" 
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required 
                    icon={FIELD_ICONS.date}
                  />

                  <TimeWheel 
                    key="input-start-time"
                    label="Start Time"
                    value={formData.startTime}
                    onChange={(time) => handleTimeChange("startTime", time)}
                  />

                  <InputField 
                    key="input-location"
                    label="Location" 
                    name="location" 
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Pioneer Square, Portland" 
                    icon={FIELD_ICONS.location}
                  />

                  <TimeWheel 
                    key="input-end-time"
                    label="End Time"
                    value={formData.endTime}
                    onChange={(time) => handleTimeChange("endTime", time)}
                  />

                  <InputField 
                    key="input-price"
                    label="Entry Price" 
                    name="price" 
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handlePriceBlur}
                    placeholder="Free or $20" 
                    required
                    icon={FIELD_ICONS.price}
                  />

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                      Category <span className="text-accent">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-accent transition-colors">
                        {FIELD_ICONS.tags}
                      </div>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm appearance-none"
                      >
                        <option value="" disabled className="bg-slate-900">Select Category</option>
                        {availableCategories.map(cat => (
                          <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                        ))}
                        <option value="Other" className="bg-slate-900">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {showOtherCategory && (
                    <InputField 
                      key="input-other-category"
                      label="Specify Category" 
                      name="otherCategory" 
                      value={formData.otherCategory}
                      onChange={handleChange}
                      placeholder="e.g. Workshop" 
                      required
                      icon={FIELD_ICONS.tags}
                    />
                  )}

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                      Event Description <span className="text-accent">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none text-sm"
                      placeholder="Tell the city about your event..."
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col-reverse md:flex-row gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl text-slate-400 font-bold hover:bg-white/5 hover:text-white transition-all text-sm"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] px-6 py-3 rounded-xl bg-accent text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Publish Event</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddEventModal;
