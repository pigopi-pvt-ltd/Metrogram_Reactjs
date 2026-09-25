import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Clock, Award, Building2, Phone, Calendar, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface SpecialtySlide {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  highlightText?: string;
  regularPrice?: string;
  memberPrice?: string;
  ctaText: string;
  ctaType: "book" | "partner";
  image: string;
  alt: string;
  features: string[];
}

export const SPECIALTY_SLIDES: SpecialtySlide[] = [
  {
    id: "nutri-dna",
    tabLabel: "NutriDNA Test",
    badge: "Genomic & Metabolic Science",
    title: "NutriDNA Test",
    subtitle: "One test to decode your nutrition, fitness, and metabolism.",
    highlightText: "Personalized Genomic Blueprint",
    regularPrice: "₹5,999",
    memberPrice: "₹2,499",
    ctaText: "Book Now",
    ctaType: "book",
    image: "/banners/nutri-dna.jpg",
    alt: "NutriDNA Test DNA Double Helix with Nutrition",
    features: [
      "120+ Genetic Biomarkers Analyzed",
      "Food Sensitivity & Macro Metabolism",
      "Vitamin Absorption & Fitness Traits",
      "Painless Saliva / Specimen Swab Collection"
    ]
  },
  {
    id: "gut-microbiome",
    tabLabel: "Gut Microbiome",
    badge: "Digestive Ecosystem Care",
    title: "Gut Microbiome Test",
    subtitle: "Track how your gut ecosystem impacts your overall health",
    highlightText: "Next-Gen DNA Sequencing",
    regularPrice: "₹4,200",
    memberPrice: "₹1,899",
    ctaText: "Book Now",
    ctaType: "book",
    image: "/banners/gut-microbiome.jpg",
    alt: "Gut Microbiome 3D Wireframe Stomach Ecosystem",
    features: [
      "Complete Microbiome Flora Diversity Index",
      "Good vs Pathogenic Bacteria Profiling",
      "Gut-Brain & Immunity Health Score",
      "Actionable Dietary & Probiotic Plan"
    ]
  },
  {
    id: "thyroid-checkup",
    tabLabel: "Thyroid Checkup",
    badge: "Hormone & Endocrine Profile",
    title: "Comprehensive Thyroid Checkup",
    subtitle: "Manage your hormonal health and detect early autoimmune conditions",
    highlightText: "@₹699 with Metrogram Card",
    regularPrice: "₹1,999",
    memberPrice: "₹699",
    ctaText: "Book Now",
    ctaType: "book",
    image: "/banners/thyroid-checkup.jpg",
    alt: "Comprehensive Thyroid Hormonal Neck Examination",
    features: [
      "FT3, FT4 & Ultra-Sensitive TSH",
      "Anti-TPO Autoimmune Thyroid Antibodies",
      "Metabolism & Energy Biomarkers",
      "Rapid Same-Day Digital Lab Report"
    ]
  },
  {
    id: "children-checkup",
    tabLabel: "Children's Health",
    badge: "60+ Parameters • Pediatric Care",
    title: "Advanced Children's Checkup",
    subtitle: "Immunity | Metabolism | Organ function & more",
    highlightText: "Complete Pediatric Wellness",
    regularPrice: "₹2,499",
    memberPrice: "₹849",
    ctaText: "Book Now",
    ctaType: "book",
    image: "/banners/children-checkup.jpg",
    alt: "Advanced Children's Health Checkup Mother Hugging Child",
    features: [
      "Complete Pediatric Blood Count & Immunity",
      "Bone Growth Markers (Calcium, Vit D3)",
      "Liver & Kidney Pediatric Baseline",
      "Gentle Micro-Needle Pediatric Phlebotomy"
    ]
  },
  {
    id: "clinic-partner",
    tabLabel: "Own a Clinic?",
    badge: "Diagnostic B2B Partnership",
    title: "Own a clinic?",
    subtitle: "Unlock full diagnostic capabilities today. Trusted by 4000+ clinics",
    highlightText: "Zero Capex • High Margin",
    regularPrice: "Free Setup",
    memberPrice: "Partner Tier",
    ctaText: "Partner With Us",
    ctaType: "partner",
    image: "/banners/clinic-partner.jpg",
    alt: "Doctor with Stethoscope Partner with Metrogram Diagnostics",
    features: [
      "Zero Setup Cost & Hardware Required",
      "Daily Specimen Pickup by Phlebotomists",
      "Up to 45% Diagnostic Referral Revenue",
      "Instant Cloud Portal for Patient Reports"
    ]
  }
];

export const FeaturedSpecialtyShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSlide, setModalSlide] = useState<SpecialtySlide>(SPECIALTY_SLIDES[0]);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCity, setFormCity] = useState("Patna");
  const [formNotes, setFormNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Fast auto-rotation timer (3.8 seconds per slide) with pause on hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, activeIndex]);

  const handleNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % SPECIALTY_SLIDES.length);
    setTimeout(() => setIsAnimating(false), 350);
  };

  const handlePrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + SPECIALTY_SLIDES.length) % SPECIALTY_SLIDES.length);
    setTimeout(() => setIsAnimating(false), 350);
  };

  const handleSelectSlide = (idx: number) => {
    if (idx === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(idx);
    setTimeout(() => setIsAnimating(false), 350);
  };

  const handleOpenActionModal = (slide: SpecialtySlide) => {
    setModalSlide(slide);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      toast.error("Please fill in your name and contact phone number.");
      return;
    }
    if (formPhone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      if (modalSlide.ctaType === "partner") {
        toast.success(
          "Clinic Partnership Inquiry received! Our B2B Medical Partner Team will contact you within 2 hours."
        );
      } else {
        toast.success(
          `Booking Confirmed for ${modalSlide.title}! Certified Phlebotomist scheduled with Metrogram Card discount.`
        );
      }
      setFormName("");
      setFormPhone("");
      setFormNotes("");
    }, 700);
  };

  return (
    <section
      ref={sectionRef}
      id="specialties"
      className="py-16 sm:py-20 bg-slate-50/80 dark:bg-[#080D18] border-b border-slate-200 dark:border-slate-800 relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ADVANCED SPECIALTY DIAGNOSTICS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Diagnostic Specialties &amp; Partnerships
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl">
              High-precision genetic sequencing, microbiome screening, specialized endocrine panels, and B2B clinic networks powered by Metrogram.
            </p>
          </div>

          {/* Quick Prev / Next Controls */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              type="button"
              onClick={handlePrevSlide}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#97144D] dark:hover:text-rose-400 hover:border-[#97144D]/40 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Previous Specialty"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNextSlide}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#97144D] dark:hover:text-rose-400 hover:border-[#97144D]/40 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Next Specialty"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* FAST TAB SWITCHER PILLS (With Metrogram Theme Color)     */}
        {/* -------------------------------------------------------- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {SPECIALTY_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className={`relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? "bg-[#97144D] text-white border-[#97144D] shadow-md shadow-[#97144D]/30 scale-102"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#97144D]/40 hover:text-[#97144D]"
                }`}
              >
                <span>{slide.tabLabel}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* -------------------------------------------------------- */}
        {/* REVEAL & EXIT STACKED CONTAINER                          */}
        {/* -------------------------------------------------------- */}
        <div className="relative mt-2 min-h-[380px] sm:min-h-[340px] md:min-h-[320px] lg:min-h-[340px] rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          {SPECIALTY_SLIDES.map((slide, idx) => {
            const isCurrent = idx === activeIndex;
            const isPrev =
              idx === (activeIndex - 1 + SPECIALTY_SLIDES.length) % SPECIALTY_SLIDES.length;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-stretch justify-between overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isCurrent
                    ? "opacity-100 translate-y-0 scale-100 z-10 pointer-events-auto"
                    : isPrev
                    ? "opacity-0 -translate-y-8 scale-[0.97] z-0 pointer-events-none"
                    : "opacity-0 translate-y-8 scale-[0.97] z-0 pointer-events-none"
                }`}
              >
                {/* LEFT CONTENT AREA */}
                <div className="w-full md:w-7/12 lg:w-3/5 p-6 sm:p-8 lg:p-12 flex flex-col justify-between z-10 bg-white dark:bg-[#0F172A]">
                  <div>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20 mb-3">
                      <Sparkles className="h-3 w-3" />
                      <span>{slide.badge}</span>
                    </div>

                    {/* Main Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      {slide.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mt-2 max-w-xl font-medium">
                      {slide.subtitle}
                    </p>

                    {/* Feature Highlights Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      {slide.features.slice(0, 4).map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#97144D] dark:text-rose-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Row: Theme-Colored Button + Price / Margin */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                    {/* Action Button styled in Metrogram Axis Burgundy Theme */}
                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(slide)}
                      className="bg-[#97144D] hover:bg-[#820d3f] text-white font-black px-7 py-3 rounded-full text-sm shadow-lg shadow-[#97144D]/30 hover:shadow-xl hover:shadow-[#97144D]/40 transition-all duration-300 cursor-pointer flex items-center gap-2.5 active:scale-95 group"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Pricing / Value Prop Badge */}
                    {slide.memberPrice && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#97144D] dark:text-rose-400">
                          {slide.memberPrice}
                        </span>
                        {slide.regularPrice && (
                          <span className="text-xs line-through text-slate-400">
                            {slide.regularPrice}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          Metrogram Card Rate
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT IMAGE AREA */}
                <div className="w-full md:w-5/12 lg:w-2/5 relative min-h-[220px] md:min-h-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle Gradient Blend Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/20 to-transparent dark:from-[#0F172A] dark:via-[#0F172A]/20 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Dots & Auto-play indicator */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {SPECIALTY_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? "w-8 bg-[#97144D] shadow-sm shadow-[#97144D]/40"
                  : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-[#97144D]/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* ======================================================== */}
      {/* QUICK BOOKING / PARTNER APPLICATION MODAL                */}
      {/* ======================================================== */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg p-0 rounded-3xl border-0 shadow-2xl bg-white dark:bg-[#0F172A] overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-[#97144D] via-[#a81655] to-[#c2185b] text-white">
            <DialogHeader className="text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md mb-1 w-fit">
                <Sparkles className="h-3 w-3" />
                <span>{modalSlide.badge}</span>
              </div>
              <DialogTitle className="text-2xl font-black text-white">
                {modalSlide.ctaType === "partner" ? "Clinic Diagnostic Partnership" : `Schedule ${modalSlide.title}`}
              </DialogTitle>
              <DialogDescription className="text-xs text-rose-100">
                {modalSlide.ctaType === "partner"
                  ? "Join 4000+ empanelled clinics across Bihar with zero hardware cost & high margins."
                  : "Fast home specimen collection with certified phlebotomists and Metrogram Card discounts."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {modalSlide.ctaType === "partner" ? "Doctor / Clinic Owner Name *" : "Patient Full Name *"}
              </label>
              <Input
                placeholder="e.g. Dr. A. K. Sharma / Ramesh Kumar"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="h-10 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <Input
                  placeholder="10-digit mobile"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
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
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
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

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {modalSlide.ctaType === "partner" ? "Clinic Name & Address" : "Home Address / Landmark"}
              </label>
              <Input
                placeholder={modalSlide.ctaType === "partner" ? "e.g. LifeCare Clinic, Kankarbagh" : "Locality, Road, Pincode"}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="h-10 text-sm"
              />
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
                {isSubmitting ? "Processing..." : modalSlide.ctaType === "partner" ? "Submit Clinic Inquiry" : `Confirm Booking • ${modalSlide.memberPrice || "Free"}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
