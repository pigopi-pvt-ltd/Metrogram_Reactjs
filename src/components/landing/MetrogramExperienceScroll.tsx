import React, { useState, useEffect, useRef } from "react";
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Clock, Award, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface ExperienceStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  bulletPoints: string[];
  image: string;
  alt: string;
  statLabel: string;
  statValue: string;
}

export const EXPERIENCE_STEPS: ExperienceStep[] = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "Choose precision",
    subtitle: "On time, every time!",
    badge: "60-Minute Promise",
    description: "Prompt home blood sample collection delivered right to your doorstep across Bihar with zero delay.",
    bulletPoints: [
      "98% on time collections with a 60 minutes promise",
      "99% reports are delivered on time within 6 hours",
      "Real-time live SMS & WhatsApp tracking of your assigned phlebotomist"
    ],
    image: "/experience/ontime-collection.jpg",
    alt: "Metrogram On-Time Blood Collection Specialist",
    statValue: "98%",
    statLabel: "On-Time Dispatch"
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Not a pilot, Just as precise",
    subtitle: "Meet our expert eMedics!",
    badge: "Certified Clinical Phlebotomy",
    description: "Highly trained healthcare professionals dedicated to hygienic, sterile, and standardized medical care.",
    bulletPoints: [
      "Hygienic, well groomed, and professional eMedics",
      "With over 100 hours of rigorous pre-analytical training",
      "DMLT & BMLT certified, background verified, and fully vaccinated"
    ],
    image: "/experience/expert-medic.jpg",
    alt: "Metrogram Trained Professional eMedic",
    statValue: "100+",
    statLabel: "Hours Training"
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "No more painful pricks",
    subtitle: "Experience painless testing!",
    badge: "Single-Prick Protocol",
    description: "Ultra-fine German vacuum needles designed for smooth, gentle, single-prick venipuncture.",
    bulletPoints: [
      "Our eMedics are trained for a single, painless prick",
      "Don't believe us? We asked our customers and here is what they said: 98% experienced no pain during sample collection!",
      "The most organised temperature-controlled sample collection box and sterile seal"
    ],
    image: "/experience/painless-testing.jpg",
    alt: "Metrogram Painless Sample Collection",
    statValue: "98%",
    statLabel: "Zero-Pain Score"
  },
  {
    id: "step-4",
    stepNumber: "04",
    title: "Trust our fully automated and certified labs",
    subtitle: "For accurate testing",
    badge: "NABL & eQAS Standard",
    description: "Advanced clinical analyzers with robotic sample processing and barcoded tracking for zero human error.",
    bulletPoints: [
      "Certified laboratories operating under strict NABL diagnostic guidelines",
      "eQAS external quality assurance partnership with AIIMS and CMC Vellore",
      "We have our own fully automated labs in all regional hubs across Bihar"
    ],
    image: "/experience/automated-labs.jpg",
    alt: "Metrogram Automated Pathology Diagnostic Laboratory",
    statValue: "100%",
    statLabel: "Barcoded Quality"
  }
];

export const MetrogramExperienceScroll: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Booking Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStepData, setActiveStepData] = useState<ExperienceStep>(EXPERIENCE_STEPS[0]);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userCity, setUserCity] = useState("Patna");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll listener for sticky active indicator (bidirectional)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.4;
      cardRefs.current.forEach((el, index) => {
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height + 60) {
            setActiveStep(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenModal = (step: ExperienceStep) => {
    setActiveStepData(step);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      toast.error("Please enter your name and contact phone number.");
      return;
    }
    if (userPhone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      toast.success(
        `Doorstep collection confirmed for ${userName}! Certified eMedic scheduled with 60-min promise.`
      );
      setUserName("");
      setUserPhone("");
    }, 700);
  };

  const scrollToStep = (index: number) => {
    setActiveStep(index);
    const target = cardRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="experience"
      className="py-20 sm:py-24 bg-slate-50/70 dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 relative select-none"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-7xl mx-auto">
        
        {/* ======================================================== */}
        {/* SECTION HEADER: Matches Metrogram's current design system*/}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
            <Activity className="h-3.5 w-3.5" />
            <span>THE METROGRAM EXPERIENCE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Healthcare Built Around Precision
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Experience standardized clinical pathology: on-time doorstep visits, certified eMedics, gentle single-prick collection, and automated NABL testing.
          </p>

          {/* Quick-Jump Step Switchers */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {EXPERIENCE_STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => scrollToStep(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 border ${
                  activeStep === idx
                    ? "bg-[#97144D] text-white border-[#97144D] shadow-sm shadow-[#97144D]/30 scale-105"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#97144D]/40 hover:text-[#97144D]"
                }`}
              >
                <span>{step.stepNumber}.</span>
                <span>{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* STICKY STACKED OVERWRITE CARDS (Forward & Reverse Scroll) */}
        {/* ======================================================== */}
        <div className="relative space-y-16 sm:space-y-24 pb-12">
          {EXPERIENCE_STEPS.map((step, idx) => {
            return (
              <div
                key={step.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="sticky rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-900/5 dark:shadow-black/50 overflow-hidden transition-all duration-300 hover:border-[#97144D]/40"
                style={{
                  top: `${95 + idx * 14}px`,
                  zIndex: 10 + idx,
                }}
              >
                {/* Subtle Brand Ambient Accent Light */}
                <div className="absolute top-0 right-10 w-72 h-72 bg-[#97144D]/5 dark:bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* LEFT: Section Title & Step Indicator */}
                  <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20 w-fit">
                      <Sparkles className="h-3 w-3" />
                      <span>STEP {step.stepNumber} • {step.badge}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      The Metrogram <br />
                      Experience
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Stat Highlight Card */}
                    <div className="pt-2">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 inline-block">
                        <div className="text-2xl sm:text-3xl font-black text-[#97144D] dark:text-rose-400">
                          {step.statValue}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                          {step.statLabel}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CENTER: Portrait Photo Frame */}
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-900/10 dark:shadow-black/60 group">
                      <img
                        src={step.image}
                        alt={step.alt}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Subtle Bottom Scrim for Title */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-3 right-3 text-center">
                        <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          {step.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Content, Bullets & Button */}
                  <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                    <div>
                      <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {step.title}
                      </h4>
                      <p className="text-base sm:text-lg font-bold text-[#97144D] dark:text-rose-400 mt-1">
                        {step.subtitle}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {step.bulletPoints.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-[#97144D] dark:text-rose-400 shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Action Button styled in Metrogram Theme */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(step)}
                        className="bg-[#97144D] hover:bg-[#820d3f] text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm shadow-[#97144D]/25 hover:shadow-md hover:shadow-[#97144D]/35 transition-all duration-300 cursor-pointer flex items-center gap-2 group active:scale-95"
                      >
                        <span>Book Doorstep Collection</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ======================================================== */}
      {/* QUICK BOOKING MODAL (Theme-Compliant)                    */}
      {/* ======================================================== */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg p-0 rounded-3xl border-0 shadow-2xl bg-white dark:bg-[#0F172A] overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-[#97144D] via-[#a81655] to-[#c2185b] text-white">
            <DialogHeader className="text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md mb-1 w-fit">
                <Sparkles className="h-3 w-3" />
                <span>{activeStepData.badge}</span>
              </div>
              <DialogTitle className="text-2xl font-black text-white">
                Book The Metrogram Experience
              </DialogTitle>
              <DialogDescription className="text-xs text-rose-100">
                Doorstep blood specimen collection with certified phlebotomists and Metrogram Card discounts.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Patient Full Name *
              </label>
              <Input
                placeholder="e.g. Ramesh Kumar"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="h-10 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mobile Number *
                </label>
                <Input
                  placeholder="10-digit mobile"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  maxLength={10}
                  required
                  className="h-10 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  City / District in Bihar
                </label>
                <select
                  value={userCity}
                  onChange={(e) => setUserCity(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Patna">Patna</option>
                  <option value="Muzaffarpur">Muzaffarpur</option>
                  <option value="Gaya">Gaya</option>
                  <option value="Bhagalpur">Bhagalpur</option>
                  <option value="Darbhanga">Darbhanga</option>
                  <option value="Begusarai">Begusarai</option>
                  <option value="Purnia">Purnia</option>
                  <option value="Other District">Other District</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#97144D] hover:bg-[#820d3f] text-white font-bold px-6 h-11 text-xs sm:text-sm rounded-xl shadow-md shadow-[#97144D]/25 cursor-pointer"
              >
                {isSubmitting ? "Scheduling eMedic..." : "Confirm Doorstep Visit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
