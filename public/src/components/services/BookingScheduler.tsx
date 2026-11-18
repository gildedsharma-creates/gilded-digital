"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Smartphone, TrendingUp, Calendar, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const SERVICES = [
  {
    id: "Web Development",
    title: "Web Development",
    tagline: "Next.js, React, E-Commerce & Custom SaaS",
    icon: Globe,
  },
  {
    id: "Mobile Application",
    title: "Mobile Application",
    tagline: "Cross-platform iOS & Android apps with React Native",
    icon: Smartphone,
  },
  {
    id: "Digital Marketing",
    title: "Digital Marketing",
    tagline: "SEO optimization, conversion funnels & brand growth",
    icon: TrendingUp,
  },
] as const;

const TIME_SLOTS = [
  "10:00 AM IST",
  "11:30 AM IST",
  "02:00 PM IST",
  "04:00 PM IST",
  "06:30 PM IST",
  "08:00 PM IST",
];

export default function BookingScheduler() {
  // Default tomorrow's date in YYYY-MM-DD
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const [serviceType, setServiceType] = useState<string>("Web Development");
  const [appointmentDate, setAppointmentDate] = useState<string>(getTomorrowDate());
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectScope, setProjectScope] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Fetch already-booked slots whenever date changes
  useEffect(() => {
    if (!appointmentDate) return;
    let active = true;

    async function fetchAvailability() {
      setLoadingSlots(true);
      setTimeSlot("");
      try {
        const res = await fetch(`/api/bookings?date=${appointmentDate}`);
        const json = await res.json();
        if (active && json.success) {
          setBookedSlots(json.bookedSlots || []);
        }
      } catch (err) {
        console.error("Failed to check slot availability:", err);
      } finally {
        if (active) setLoadingSlots(false);
      }
    }

    fetchAvailability();
    return () => {
      active = false;
    };
  }, [appointmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!timeSlot) {
      setErrorMsg("Please select an available time slot.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          serviceType,
          projectScope,
          appointmentDate,
          timeSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not complete booking.");
      }

      setIsConfirmed(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-xl rounded-3xl border border-amber-500/30 bg-neutral-900/70 p-8 text-center shadow-2xl"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-bold text-white">Consultation Scheduled!</h2>
        <p className="mt-2 text-neutral-400">
          Thank you, <span className="font-semibold text-neutral-200">{clientName}</span>. Kundan (Gilded Sharma) has received your request for{" "}
          <span className="text-amber-400">{serviceType}</span>.
        </p>

        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm text-neutral-300 space-y-1.5">
          <p>
            <span className="text-neutral-500">Date:</span> {appointmentDate}
          </p>
          <p>
            <span className="text-neutral-500">Time:</span> {timeSlot}
          </p>
          <p>
            <span className="text-neutral-500">Confirmation sent to:</span> {clientEmail}
          </p>
        </div>

        <button
          onClick={() => {
            setIsConfirmed(false);
            setProjectScope("");
            setTimeSlot("");
          }}
          className="mt-8 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition-transform hover:scale-105"
        >
          Book Another Session
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* 1. Choose Digital Service */}
      <div>
        <label className="mb-4 block text-sm font-semibold uppercase tracking-wider text-amber-400">
          1. Select Service Category
        </label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const isSelected = serviceType === service.id;
            return (
              <motion.button
                type="button"
                key={service.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setServiceType(service.id)}
                className={`relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/5"
                    : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                }`}
              >
                <div
                  className={`mb-3 rounded-xl p-2.5 ${
                    isSelected ? "bg-amber-400 text-neutral-950" : "bg-neutral-800 text-amber-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white">{service.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">{service.tagline}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Date & Time Slot Selection */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <label htmlFor="appointment-date" className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
            <Calendar className="h-4 w-4" />
            <span>2. Pick a Date</span>
          </label>
          <input
            id="appointment-date"
            type="date"
            required
            min={getTomorrowDate()}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-neutral-100 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
            <Clock className="h-4 w-4" />
            <span>3. Available Time Slots</span>
          </label>
          {loadingSlots ? (
            <div className="flex items-center gap-2 py-3 text-sm text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
              <span>Checking availability...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isChosen = timeSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setTimeSlot(slot)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                      isBooked
                        ? "cursor-not-allowed border-neutral-800/50 bg-neutral-900/30 text-neutral-600 line-through"
                        : isChosen
                        ? "border-amber-400 bg-amber-400 text-neutral-950"
                        : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-amber-500/40"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Client & Project Details */}
      <div className="space-y-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
          4. Your Project Details
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Rahul Verma"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Email Address *</label>
            <input
              type="email"
              required
              placeholder="rahul@company.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Phone / WhatsApp *</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">
            Tell me about your goals, timeline & budget *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Describe the website, mobile app, or digital marketing campaign you want to build..."
            value={projectScope}
            onChange={(e) => setProjectScope(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-amber-400 disabled:opacity-60 sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Confirming Booking...</span>
            </>
          ) : (
            <span>Confirm Discovery Call</span>
          )}
        </motion.button>
      </div>
    </form>
  );
}