import React, { useState } from "react";
import { ChevronRight, Sparkles, CheckCircle2, ShieldCheck, Thermometer, Clock, X, Phone, User, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Checkup details interface
export interface CheckupPackage {
  id: string;
  titleLine1: string;
  titleLine2: string;
  fullName: string;
  badge: string;
  parametersCount: number;
  regularPrice: number;
  memberPrice: number;
  reportTurnaround: string;
  fastingRequired: string;
  sampleType: string;
  description: string;
  parameters: string[];
}

export const CHECKUP_PACKAGES: CheckupPackage[] = [
  {
    id: "full-body",
    titleLine1: "Full Body",
    titleLine2: "Checkup",
    fullName: "Metrogram Comprehensive Full Body Checkup",
    badge: "Most Popular • 83 Parameters",
    parametersCount: 83,
    regularPrice: 2499,
    memberPrice: 799,
    reportTurnaround: "Within 24 Hours",
    fastingRequired: "10-12 Hours Fasting Required",
    sampleType: "Blood Specimen & Urine Routine",
    description: "Holistic evaluation of vital organs including Liver, Kidney, Heart, Thyroid, Blood Glucose, Bone Health, and Complete Hemogram with AI-audited clinical accuracy.",
    parameters: [
      "Complete Blood Count (CBC - 24 Parameters)",
      "Liver Function Test (LFT - 12 Parameters)",
      "Kidney Function Test (KFT - 8 Parameters)",
      "Lipid Profile & Cholesterol (8 Parameters)",
      "Thyroid Profile Total (T3, T4, TSH)",
      "Fasting Blood Sugar & HbA1c Glycated Hemoglobin",
      "Vitamin D (25-OH) & Vitamin B12 Levels",
      "Serum Calcium, Uric Acid & Electrolytes",
      "Complete Urine Examination (Routine & Microscopic)"
    ]
  },
  {
    id: "sexual-health",
    titleLine1: "Sexual",
    titleLine2: "Health",
    fullName: "Confidential Sexual Health & Wellness Screening",
    badge: "100% Confidential • Home Sample",
    parametersCount: 16,
    regularPrice: 1999,
    memberPrice: 649,
    reportTurnaround: "Same-Day Secure Report",
    fastingRequired: "No Fasting Required",
    sampleType: "Sterile Blood & Urine Specimen",
    description: "Complete confidential screening for vital sexual wellness, infectious markers, hormonal balance, and reproductive wellness delivered with end-to-end privacy encryption.",
    parameters: [
      "HIV I & II Screening (4th Gen Duo Ag/Ab)",
      "VDRL / RPR Syphilis Serology Screening",
      "Hepatitis B Surface Antigen (HBsAg)",
      "Hepatitis C Total Antibodies (HCV)",
      "Serum Testosterone Total & Free Ratio",
      "Prolactin & Reproductive Hormones",
      "Urine Routine & Microscopic Screening",
      "Clinical Pathologist Consultation Note"
    ]
  },
  {
    id: "womens-health",
    titleLine1: "Women's",
    titleLine2: "Health",
    fullName: "Specialized Women's Vital Care & Hormone Profile",
    badge: "Hormone, Thyroid & Bone Care",
    parametersCount: 68,
    regularPrice: 2299,
    memberPrice: 749,
    reportTurnaround: "Within 24 Hours",
    fastingRequired: "8-10 Hours Fasting Recommended",
    sampleType: "Blood Specimen",
    description: "Tailored specifically for women's physiological milestones — evaluating thyroid regulation, hormonal balance, anemia indices, calcium metabolism, and reproductive wellness.",
    parameters: [
      "Thyroid Function Panel (FT3, FT4, Ultra-sensitive TSH)",
      "Iron Deficiency Panel (Serum Ferritin, Iron, TIBC)",
      "Calcium, Phosphorus & Alkaline Phosphatase (Bone Care)",
      "Vitamin D3 & Vitamin B12 Vital Levels",
      "Complete Hemogram with ESR (Anemia Markers)",
      "Female Hormone Screening (LH, FSH, Prolactin)",
      "HbA1c & Fasting Glucose Screening",
      "Lipid Profile for Cardiovascular Wellness"
    ]
  },
  {
    id: "allergy-checkup",
    titleLine1: "Allergy",
    titleLine2: "Checkup",
    fullName: "Advanced Comprehensive Allergy & Immunity Panel",
    badge: "Food & Inhalant IgE Panel",
    parametersCount: 45,
    regularPrice: 2899,
    memberPrice: 899,
    reportTurnaround: "24-48 Hours",
    fastingRequired: "No Fasting Required",
    sampleType: "Blood Specimen",
    description: "Precise quantitative ImmunoCAP IgE evaluation for environmental allergens, dust mites, pollen, mold, animal dander, and common dietary food triggers.",
    parameters: [
      "Total Serum IgE Quantitative Level",
      "Absolute Eosinophil Count (AEC) & Differential",
      "Food Allergen Mix (Milk, Egg, Wheat, Peanut, Soya)",
      "Inhalant Allergen Mix (Pollen, House Dust Mite)",
      "Mold & Fungal Spores Sensitivity Panel",
      "Animal Epithelia & Dander Screening",
      "Immune System Cellular Balance Markers",
      "Allergy Severity Grading & Trigger Chart"
    ]
  }
];

// Additional checkup packages for "View All Checkups" modal
const ALL_PACKAGES: CheckupPackage[] = [
  ...CHECKUP_PACKAGES,
  {
    id: "cardiac-care",
    titleLine1: "Heart &",
    titleLine2: "Cardiac",
    fullName: "Advanced Cardiac Risk & Lipid Screening",
    badge: "Heart Health • 52 Parameters",
    parametersCount: 52,
    regularPrice: 2199,
    memberPrice: 699,
    reportTurnaround: "Same-Day Report",
    fastingRequired: "12 Hours Fasting Required",
    sampleType: "Blood Specimen",
    description: "Comprehensive cardiovascular risk assessment evaluating lipid fractions, apolipoproteins, high-sensitivity CRP, and metabolic markers.",
    parameters: [
      "hs-CRP (High-Sensitivity C-Reactive Protein)",
      "Comprehensive Lipid Profile (Cholesterol, HDL, LDL, VLDL, Triglycerides)",
      "Apolipoprotein A1 & Apolipoprotein B",
      "Homocysteine Cardiac Risk Factor",
      "Fasting Blood Sugar & HbA1c",
      "Electrolytes (Sodium, Potassium, Chloride)"
    ]
  },
  {
    id: "senior-citizen",
    titleLine1: "Senior",
    titleLine2: "Citizen",
    fullName: "Golden Age Senior Citizen Comprehensive Care",
    badge: "Age 50+ Specialized • 78 Parameters",
    parametersCount: 78,
    regularPrice: 2999,
    memberPrice: 949,
    reportTurnaround: "Within 24 Hours",
    fastingRequired: "10-12 Hours Fasting",
    sampleType: "Blood Specimen & Urine Routine",
    description: "Specialized geriatric screening tailored for early detection of chronic conditions, arthritis markers, kidney filtration, bone density markers, and cardiovascular status.",
    parameters: [
      "Complete Hemogram & ESR",
      "Full Liver & Kidney Function Panels with eGFR",
      "Arthritis Screening (Rheumatoid Factor & Uric Acid)",
      "Cardiac Risk Profile & Extended Lipid Panel",
      "Bone Health (Calcium, Phosphorus, Vitamin D3)",
      "HbA1c Average 3-Month Glucose",
      "Urine Routine & Microalbuminuria Screening"
    ]
  }
];

export const MostBookedCheckups: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<CheckupPackage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);
  
  // Booking Form State
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingCity, setBookingCity] = useState("Patna");
  const [bookingAddress, setBookingAddress] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const handleOpenDetail = (pkg: CheckupPackage) => {
    setSelectedPackage(pkg);
    setIsDetailModalOpen(true);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    if (bookingPhone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmittingBooking(true);
    setTimeout(() => {
      setIsSubmittingBooking(false);
      setIsDetailModalOpen(false);
      toast.success(
        `Booking Confirmed! Certified Phlebotomist scheduled for ${selectedPackage?.fullName}. Confirmation sent via SMS & WhatsApp.`
      );
      setBookingName("");
      setBookingPhone("");
      setBookingAddress("");
      setBookingDate("");
    }, 800);
  };

  return (
    <section
      id="checkups"
      className="py-20 sm:py-24 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 relative overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#97144D]/5 dark:bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-rose-500/5 dark:bg-rose-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Section Title, Subtitle & Call to Action   */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-5">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>PREVENTIVE HEALTHCARE</span>
            </div>

            {/* Main Headline matching the reference image */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Most Booked <br />
              Checkups
            </h2>

            {/* Descriptive Paragraph matching the reference image */}
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-md">
              India's fastest AI powered &amp; temperature - controlled supply chain to collect and test your blood in freshest state.
            </p>

            {/* Action Button matching reference pill style in Metrogram's theme */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAllModalOpen(true)}
                className="rounded-full border-2 border-[#97144D] dark:border-rose-400/80 text-[#97144D] dark:text-rose-300 font-bold px-7 py-3 text-sm hover:bg-[#97144D] hover:text-white dark:hover:bg-[#97144D] dark:hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#97144D]/20 cursor-pointer inline-flex items-center gap-2 group active:scale-95"
              >
                <span>View All Checkups</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Quality Commitment Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-[#97144D] dark:text-rose-400" />
                <span>Cold-Chain Specimen Control</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#97144D] dark:text-rose-400" />
                <span>NABL Accredited Labs</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Asymmetric 4-Card Bento Grid in Metrogram Theme */}
          {/* ======================================================== */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              {/* ---------------------------------------------------- */}
              {/* SUB-COLUMN 1: TALL (Card 1) + SHORT (Card 3)         */}
              {/* ---------------------------------------------------- */}
              <div className="flex flex-col gap-4 sm:gap-5">
                
                {/* CARD 1: Full Body Checkup (Tall Card) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenDetail(CHECKUP_PACKAGES[0])}
                  onKeyDown={(e) => e.key === "Enter" && handleOpenDetail(CHECKUP_PACKAGES[0])}
                  className="group relative rounded-[28px] p-6 sm:p-7 min-h-[240px] sm:min-h-[260px] flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-300 hover:-translate-y-1.5 text-white bg-gradient-to-br from-[#97144D] via-[#a81655] to-[#c2185b] shadow-xl shadow-[#97144D]/25 hover:shadow-2xl hover:shadow-[#97144D]/45"
                >
                  {/* Frosted / Ambient Circular Light Highlight */}
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/20 blur-2xl pointer-events-none transition-opacity group-hover:opacity-90" />
                  <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-rose-300/15 blur-xl pointer-events-none" />

                  {/* Top Header: Title + Circular Arrow */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-xs">
                      Full Body
                      <br />
                      Checkup
                    </h3>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#97144D] flex items-center justify-center shadow-md shadow-black/15 group-hover:scale-110 group-hover:bg-white transition-all shrink-0">
                      <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform stroke-[3]" />
                    </div>
                  </div>

                  {/* Bottom Area: Male & Female Figure Silhouette Pictogram + Member Price Badge */}
                  <div className="relative z-10 flex items-end justify-between pt-6">
                    {/* SVG matching the reference pictogram */}
                    <div className="transition-transform duration-300 group-hover:scale-105">
                      <svg
                        viewBox="0 0 64 64"
                        fill="currentColor"
                        className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-sm"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        {/* Male silhouette */}
                        <circle cx="18" cy="12" r="5.5" />
                        <path d="M10 23c0-2 1.6-3.8 3.8-3.8h8.4c2.2 0 3.8 1.8 3.8 3.8v15c0 1-.8 1.8-1.8 1.8h-1.4v17c0 1-.8 1.8-1.8 1.8h-2c-1 0-1.8-.8-1.8-1.8V40h-2v17c0 1-.8 1.8-1.8 1.8h-2c-1 0-1.8-.8-1.8-1.8V23z" />
                        {/* Female silhouette */}
                        <circle cx="44" cy="12" r="5.5" />
                        <path d="M38 20c-1.8 0-3.2 1.4-3.2 3.2l-3.2 18c-.2 1.1.7 2 1.8 2h4.2v14c0 1 .8 1.8 1.8 1.8h2c1 0 1.8-.8 1.8-1.8V43.2h3.2v14c0 1 .8 1.8 1.8 1.8h2c1 0 1.8-.8 1.8-1.8V43.2h4.2c1.1 0 2-.9 1.8-2l-3.2-18c0-1.8-1.4-3.2-3.2-3.2h-9z" />
                      </svg>
                    </div>

                    {/* Member Savings Pill */}
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-white tracking-wide border border-white/30">
                      ₹799 <span className="opacity-75 font-normal text-[10px]">with Card</span>
                    </div>
                  </div>
                </div>

                {/* CARD 3: Women's Health (Compact Card) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenDetail(CHECKUP_PACKAGES[2])}
                  onKeyDown={(e) => e.key === "Enter" && handleOpenDetail(CHECKUP_PACKAGES[2])}
                  className="group relative rounded-[28px] p-6 sm:p-7 min-h-[145px] sm:min-h-[155px] flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-300 hover:-translate-y-1.5 text-white bg-gradient-to-br from-[#851044] via-[#97144D] to-[#ba1e62] shadow-xl shadow-[#851044]/25 hover:shadow-2xl hover:shadow-[#851044]/45"
                >
                  {/* Frosted / Ambient Circular Light Highlight */}
                  <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/20 blur-xl pointer-events-none" />

                  {/* Header: Title + Circular Arrow */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-xs">
                      Women's
                      <br />
                      Health
                    </h3>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#97144D] flex items-center justify-center shadow-md shadow-black/15 group-hover:scale-110 group-hover:bg-white transition-all shrink-0">
                      <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform stroke-[3]" />
                    </div>
                  </div>

                  {/* Subtle Subtitle / Parameters Tag */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-rose-100 font-medium pt-3">
                    <span>68 Vital Parameters</span>
                    <span className="font-bold text-white bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] border border-white/30">
                      ₹749
                    </span>
                  </div>
                </div>

              </div>

              {/* ---------------------------------------------------- */}
              {/* SUB-COLUMN 2: SHORT (Card 2) + TALL (Card 4)         */}
              {/* ---------------------------------------------------- */}
              <div className="flex flex-col gap-4 sm:gap-5">
                
                {/* CARD 2: Sexual Health (Compact Card) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenDetail(CHECKUP_PACKAGES[1])}
                  onKeyDown={(e) => e.key === "Enter" && handleOpenDetail(CHECKUP_PACKAGES[1])}
                  className="group relative rounded-[28px] p-6 sm:p-7 min-h-[145px] sm:min-h-[155px] flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-300 hover:-translate-y-1.5 text-white bg-gradient-to-br from-[#740c39] via-[#8e1248] to-[#ad1457] shadow-xl shadow-[#740c39]/25 hover:shadow-2xl hover:shadow-[#740c39]/45"
                >
                  {/* Frosted / Ambient Circular Light Highlight */}
                  <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/20 blur-xl pointer-events-none" />

                  {/* Header: Title + Circular Arrow */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-xs">
                      Sexual
                      <br />
                      Health
                    </h3>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#97144D] flex items-center justify-center shadow-md shadow-black/15 group-hover:scale-110 group-hover:bg-white transition-all shrink-0">
                      <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform stroke-[3]" />
                    </div>
                  </div>

                  {/* Privacy Tag */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-rose-100 font-medium pt-3">
                    <span>100% Confidential</span>
                    <span className="font-bold text-white bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] border border-white/30">
                      ₹649
                    </span>
                  </div>
                </div>

                {/* CARD 4: Allergy Checkup (Tall Card) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenDetail(CHECKUP_PACKAGES[3])}
                  onKeyDown={(e) => e.key === "Enter" && handleOpenDetail(CHECKUP_PACKAGES[3])}
                  className="group relative rounded-[28px] p-6 sm:p-7 min-h-[240px] sm:min-h-[260px] flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-300 hover:-translate-y-1.5 text-white bg-gradient-to-br from-[#ab1556] via-[#ba1e62] to-[#880e4f] shadow-xl shadow-[#ab1556]/25 hover:shadow-2xl hover:shadow-[#ab1556]/45"
                >
                  {/* Frosted / Ambient Circular Light Highlight */}
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/20 blur-2xl pointer-events-none" />

                  {/* Allergen Spores Graphic Area matching reference image */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="transition-transform duration-300 group-hover:scale-105">
                      <svg
                        viewBox="0 0 100 100"
                        fill="currentColor"
                        className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-sm"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        {/* Primary Spiky Allergen Particle */}
                        <g transform="translate(24, 20)">
                          <circle cx="16" cy="16" r="14" />
                          <circle cx="16" cy="-2" r="3.5" />
                          <circle cx="16" cy="34" r="3.5" />
                          <circle cx="-2" cy="16" r="3.5" />
                          <circle cx="34" cy="16" r="3.5" />
                          <circle cx="3" cy="3" r="3" />
                          <circle cx="29" cy="3" r="3" />
                          <circle cx="3" cy="29" r="3" />
                          <circle cx="29" cy="29" r="3" />
                        </g>
                        {/* Secondary smaller allergen particle */}
                        <g transform="translate(60, 52)">
                          <circle cx="10" cy="10" r="9" />
                          <circle cx="10" cy="-1" r="2.5" />
                          <circle cx="10" cy="21" r="2.5" />
                          <circle cx="-1" cy="10" r="2.5" />
                          <circle cx="21" cy="10" r="2.5" />
                          <circle cx="2" cy="2" r="2" />
                          <circle cx="18" cy="2" r="2" />
                          <circle cx="2" cy="18" r="2" />
                          <circle cx="18" cy="18" r="2" />
                        </g>
                        {/* Floating micro pollen dots */}
                        <circle cx="16" cy="55" r="2.2" opacity="0.9" />
                        <circle cx="70" cy="22" r="2.2" opacity="0.9" />
                        <circle cx="82" cy="36" r="1.8" opacity="0.8" />
                        <circle cx="10" cy="36" r="1.6" opacity="0.7" />
                      </svg>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-white tracking-wide border border-white/30">
                      ₹899 <span className="opacity-75 font-normal text-[10px]">with Card</span>
                    </div>
                  </div>

                  {/* Bottom: Title + Circular Arrow matching reference image */}
                  <div className="relative z-10 flex items-end justify-between gap-3 pt-6">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-xs">
                      Allergy
                      <br />
                      Checkup
                    </h3>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#97144D] flex items-center justify-center shadow-md shadow-black/15 group-hover:scale-110 group-hover:bg-white transition-all shrink-0">
                      <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform stroke-[3]" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* CHECKUP DETAIL & BOOKING MODAL                          */}
      {/* ======================================================== */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-0 shadow-2xl bg-white dark:bg-[#0F172A]">
          {selectedPackage && (
            <div>
              {/* Modal Banner Header in Metrogram Theme */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-[#97144D] via-[#a81655] to-[#c2185b] text-white relative">
                <DialogHeader className="text-left space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md mb-2 w-fit">
                    <Sparkles className="h-3 w-3" />
                    <span>{selectedPackage.badge}</span>
                  </div>
                  <DialogTitle className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {selectedPackage.fullName}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-rose-100 max-w-lg leading-relaxed">
                    {selectedPackage.description}
                  </DialogDescription>
                </DialogHeader>

                {/* Price Display */}
                <div className="mt-4 pt-4 border-t border-white/20 flex items-baseline gap-3">
                  <div className="text-3xl font-black text-white">
                    ₹{selectedPackage.memberPrice}
                  </div>
                  <div className="text-sm line-through text-rose-200">
                    Regular: ₹{selectedPackage.regularPrice}
                  </div>
                  <div className="bg-emerald-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-auto">
                    Save {Math.round(((selectedPackage.regularPrice - selectedPackage.memberPrice) / selectedPackage.regularPrice) * 100)}% with Card
                  </div>
                </div>
              </div>

              {/* Package Specs */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-slate-500 dark:text-slate-400 font-medium">Turnaround</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPackage.reportTurnaround}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-slate-500 dark:text-slate-400 font-medium">Preparation</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPackage.fastingRequired}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                    <div className="text-slate-500 dark:text-slate-400 font-medium">Sample Specimen</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPackage.sampleType}</div>
                  </div>
                </div>

                {/* Parameters List */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    What's Included ({selectedPackage.parametersCount} Tests &amp; Profiles)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                    {selectedPackage.parameters.map((param, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="h-4 w-4 text-[#97144D] dark:text-rose-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{param}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Booking Form */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                    Book Home Blood Collection with Metrogram Card
                  </h4>
                  <form onSubmit={handleBookSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Full Name *
                        </label>
                        <Input
                          placeholder="e.g. Ramesh Kumar"
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          required
                          className="h-10 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          WhatsApp / Phone Number *
                        </label>
                        <Input
                          placeholder="10-digit mobile number"
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          maxLength={10}
                          required
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          District / City in Bihar
                        </label>
                        <select
                          value={bookingCity}
                          onChange={(e) => setBookingCity(e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="Patna">Patna</option>
                          <option value="Muzaffarpur">Muzaffarpur</option>
                          <option value="Gaya">Gaya</option>
                          <option value="Bhagalpur">Bhagalpur</option>
                          <option value="Darbhanga">Darbhanga</option>
                          <option value="Begusarai">Begusarai</option>
                          <option value="Purnia">Purnia</option>
                          <option value="Other Bihar District">Other Bihar District</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Preferred Home Visit Date
                        </label>
                        <Input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Home Address / Locality
                      </label>
                      <Input
                        placeholder="House no., Landmark, Pincode"
                        value={bookingAddress}
                        onChange={(e) => setBookingAddress(e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsDetailModalOpen(false)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmittingBooking}
                        className="bg-[#97144D] hover:bg-[#820d3f] text-white font-bold px-6 h-11 text-xs sm:text-sm rounded-xl shadow-md shadow-[#97144D]/25 cursor-pointer"
                      >
                        {isSubmittingBooking ? "Scheduling Phlebotomist..." : `Confirm Booking • ₹${selectedPackage.memberPrice}`}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* "VIEW ALL CHECKUPS" FULL CATALOG MODAL                   */}
      {/* ======================================================== */}
      <Dialog open={isAllModalOpen} onOpenChange={setIsAllModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
          <DialogHeader className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20 w-fit">
              <Sparkles className="h-3 w-3" />
              <span>METROGRAM CARD DIAGNOSTICS</span>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              All Most Booked Health Checkups
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm">
              Show your Metrogram Card or book home specimen collection with certified phlebotomists across Bihar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {ALL_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col justify-between hover:border-[#97144D]/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#97144D] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/40">
                      {pkg.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {pkg.reportTurnaround}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#97144D] dark:group-hover:text-rose-400 transition-colors">
                    {pkg.fullName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-[#97144D] dark:text-rose-400">
                      ₹{pkg.memberPrice}{" "}
                      <span className="text-xs line-through text-slate-400 font-normal ml-1">
                        ₹{pkg.regularPrice}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">With Metrogram Card</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsAllModalOpen(false);
                      handleOpenDetail(pkg);
                    }}
                    className="bg-[#97144D] hover:bg-[#820d3f] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    View &amp; Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </section>
  );
};
