import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, FileText, Microscope, Sparkles, CheckCircle2, ShoppingCart, Check, Clock, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface BookedTest {
  id: string;
  name: string;
  category: "Pathology" | "Radiology" | "Psychography";
  tag: string;
  regularPrice: number;
  memberPrice: number;
  discountPercent: number;
  reportTime: string;
  testsCount: number;
  fasting: string;
  sampleType: string;
  description: string;
  parameters: string[];
}

export const MOST_BOOKED_TESTS: BookedTest[] = [
  {
    id: "hba1c",
    name: "Glycosylated Haemoglobin (HbA1c)",
    category: "Pathology",
    tag: "Test",
    regularPrice: 620,
    memberPrice: 290,
    discountPercent: 53,
    reportTime: "6 hours",
    testsCount: 2,
    fasting: "No Fasting Required",
    sampleType: "Blood Specimen (EDTA Whole Blood)",
    description: "Evaluates your average 3-month blood glucose control to detect prediabetes, diabetes mellitus, and monitor glycemic response.",
    parameters: [
      "HbA1c Glycated Hemoglobin Percentage",
      "Estimated Average Glucose (eAG mg/dL)"
    ]
  },
  {
    id: "tft",
    name: "Thyroid Function Test (TFT Total)",
    category: "Pathology",
    tag: "Profile",
    regularPrice: 580,
    memberPrice: 280,
    discountPercent: 51,
    reportTime: "6 hours",
    testsCount: 3,
    fasting: "Overnight fasting recommended",
    sampleType: "Serum Blood Specimen",
    description: "Evaluates thyroid gland performance and metabolic regulation by analyzing circulating thyroid hormones.",
    parameters: [
      "Total Triiodothyronine (T3)",
      "Total Thyroxine (T4)",
      "Thyroid Stimulating Hormone (TSH Ultrasensitive)"
    ]
  },
  {
    id: "vit-b12",
    name: "Vitamin B12 (Cyanocobalamin)",
    category: "Pathology",
    tag: "Test",
    regularPrice: 850,
    memberPrice: 390,
    discountPercent: 54,
    reportTime: "6 hours",
    testsCount: 1,
    fasting: "10-12 hours fasting required",
    sampleType: "Serum Blood Specimen",
    description: "Crucial for nerve function, brain cognition, red blood cell production, and combating lethargy.",
    parameters: [
      "Serum Cobalamin / Vitamin B12 Quantitative"
    ]
  },
  {
    id: "cbc",
    name: "Complete Blood Count with ESR (CBC)",
    category: "Pathology",
    tag: "Profile",
    regularPrice: 420,
    memberPrice: 190,
    discountPercent: 55,
    reportTime: "4 hours",
    testsCount: 24,
    fasting: "No Fasting Required",
    sampleType: "EDTA Whole Blood",
    description: "Complete hemogram checking for anemia, systemic infections, platelet counts, and immune health.",
    parameters: [
      "Hemoglobin, RBC, Hematocrit (PCV)",
      "Total Leukocyte Count (TLC) & Differential (DLC)",
      "Platelet Count & Platelet Indices",
      "Erythrocyte Sedimentation Rate (ESR)"
    ]
  },
  {
    id: "lipid",
    name: "Lipid Profile (Cardiac Risk Screening)",
    category: "Pathology",
    tag: "Profile",
    regularPrice: 750,
    memberPrice: 350,
    discountPercent: 53,
    reportTime: "6 hours",
    testsCount: 8,
    fasting: "10-12 hours strict fasting",
    sampleType: "Serum Blood Specimen",
    description: "Comprehensive cholesterol breakdown evaluating cardiovascular risk and arterial plaque index.",
    parameters: [
      "Total Cholesterol, HDL ('Good') Cholesterol",
      "LDL ('Bad') Cholesterol, VLDL Cholesterol",
      "Triglycerides & Cholesterol / HDL Ratio"
    ]
  },
  {
    id: "lft-kft",
    name: "Liver & Kidney Function Duo (LFT + KFT)",
    category: "Pathology",
    tag: "Combo",
    regularPrice: 1350,
    memberPrice: 590,
    discountPercent: 56,
    reportTime: "6 hours",
    testsCount: 20,
    fasting: "8-10 hours fasting recommended",
    sampleType: "Serum Blood Specimen",
    description: "Holistic evaluation of liver enzymes, bilirubin, protein metabolism, kidney filtration rate (eGFR), and creatinine.",
    parameters: [
      "Bilirubin Total/Direct, SGOT, SGPT, Alkaline Phosphatase",
      "Serum Creatinine, Blood Urea Nitrogen (BUN), Uric Acid, eGFR"
    ]
  },
  {
    id: "ct-scan",
    name: "Multi-Slice CT Scan (Brain / Chest / Abdomen)",
    category: "Radiology",
    tag: "Scan",
    regularPrice: 3500,
    memberPrice: 1750,
    discountPercent: 50,
    reportTime: "Same-Day",
    testsCount: 1,
    fasting: "4 hours fasting for contrast scan",
    sampleType: "Radiology Suite Imaging",
    description: "High-speed multi-detector computed tomography providing sub-millimeter cross-sectional anatomical mapping.",
    parameters: [
      "Multi-Slice High-Resolution Digital Scan",
      "Certified Radiologist MD Clinical Review & Film"
    ]
  },
  {
    id: "mri-scan",
    name: "High-Field MRI Diagnostic Scan",
    category: "Radiology",
    tag: "Scan",
    regularPrice: 6500,
    memberPrice: 3250,
    discountPercent: 50,
    reportTime: "Same-Day",
    testsCount: 1,
    fasting: "No Fasting Required",
    sampleType: "Magnetic Resonance Suite",
    description: "High-definition soft-tissue imaging for neurological pathways, spinal discs, joints, and musculoskeletal anatomy.",
    parameters: [
      "Multi-Sequence T1, T2 & FLAIR Diagnostic Scans",
      "Senior Radiologist Consultant Diagnostic Evaluation"
    ]
  }
];

export const MostBookedTestsCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState("Patna");

  // Detail Modal
  const [selectedTest, setSelectedTest] = useState<BookedTest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Booking / Cart Form State
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
      updateActiveIndex(-1);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
      updateActiveIndex(1);
    }
  };

  const updateActiveIndex = (delta: number) => {
    setCurrentSlideIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next >= MOST_BOOKED_TESTS.length) return MOST_BOOKED_TESTS.length - 1;
      return next;
    });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollPos = scrollContainerRef.current.scrollLeft;
      const cardWidth = 340;
      const index = Math.round(scrollPos / cardWidth);
      setCurrentSlideIndex(Math.min(index, MOST_BOOKED_TESTS.length - 1));
    }
  };

  const handleOpenDetail = (test: BookedTest) => {
    setSelectedTest(test);
    setIsDetailModalOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      toast.error("Please enter your full name and phone number.");
      return;
    }
    if (patientPhone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setIsDetailModalOpen(false);
      toast.success(
        `Added to Cart & Booked! ${selectedTest?.name} scheduled for ${patientName} in ${selectedCity} at ₹${selectedTest?.memberPrice} (Metrogram Card Rate).`
      );
      setPatientName("");
      setPatientPhone("");
    }, 700);
  };

  return (
    <section
      id="booked-tests"
      className="py-16 sm:py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 relative select-none"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-7xl mx-auto">
        
        {/* ======================================================== */}
        {/* HEADER ROW: Title + City Selector + Navigation Arrows   */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20 mb-2">
              <Sparkles className="h-3 w-3" />
              <span>NABL ACCREDITED &amp; PRE-AUTHORIZED</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Most Booked Tests In
              </h2>
              {/* City Selector matching website region */}
              <div className="relative inline-block">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="appearance-none bg-slate-100 dark:bg-slate-800 text-[#97144D] dark:text-rose-400 font-extrabold text-2xl sm:text-3xl lg:text-4xl py-0.5 pl-3 pr-8 rounded-xl border-none cursor-pointer focus:outline-none hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <option value="Patna">Patna</option>
                  <option value="Muzaffarpur">Muzaffarpur</option>
                  <option value="Gaya">Gaya</option>
                  <option value="Bhagalpur">Bhagalpur</option>
                  <option value="Darbhanga">Darbhanga</option>
                  <option value="Begusarai">Begusarai</option>
                  <option value="Bihar">Bihar</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#97144D] dark:text-rose-400 font-bold">
                  ▾
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Left / Right Arrows */}
          <div className="hidden sm:flex items-center gap-2 self-end">
            <button
              type="button"
              onClick={scrollLeft}
              disabled={currentSlideIndex === 0}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#97144D] dark:hover:text-rose-400 hover:border-[#97144D]/40 shadow-sm flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
              aria-label="Previous Test"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              disabled={currentSlideIndex >= MOST_BOOKED_TESTS.length - 1}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#97144D] dark:hover:text-rose-400 hover:border-[#97144D]/40 shadow-sm flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
              aria-label="Next Test"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CAROUSEL WRAPPER WITH NAVIGATION BUTTONS                */}
        {/* ======================================================== */}
        <div className="relative">
          {/* Mobile Floating Arrow Buttons */}
          <button
            type="button"
            onClick={scrollLeft}
            className="sm:hidden absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md text-slate-800 dark:text-slate-200 flex items-center justify-center cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md text-slate-800 dark:text-slate-200 flex items-center justify-center cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Cards Horizontal Scrolling Track */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex items-stretch gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
          >
            {MOST_BOOKED_TESTS.map((test) => (
              <div
                key={test.id}
                className="w-[290px] sm:w-[325px] md:w-[340px] shrink-0 snap-start rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-900/5 dark:shadow-black/40 hover:shadow-xl hover:border-[#97144D]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* ------------------------------------------------ */}
                {/* TOP HEADER: In Metrogram Theme Color Gradient    */}
                {/* ------------------------------------------------ */}
                <div className="p-5 pb-4 min-h-[140px] rounded-t-[24px] rounded-b-[18px] bg-gradient-to-br from-[#97144D] via-[#a81655] to-[#7d0f3f] text-white flex flex-col justify-between relative overflow-hidden shadow-sm">
                  {/* Subtle Top-Right Ambient Shine */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/15 rounded-full blur-xl pointer-events-none" />

                  {/* Header Row: Test Name + Tag */}
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold leading-snug line-clamp-2 text-white drop-shadow-xs">
                      {test.name}
                    </h3>
                    <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-white shrink-0 border border-white/20">
                      {test.tag}
                    </span>
                  </div>

                  {/* Pricing Row: Strikethrough + Member Price + Discount Badge */}
                  <div className="relative z-10 flex items-end justify-between pt-2">
                    <span className="text-[11px] text-rose-100 font-medium tracking-wide">
                      {test.category}
                    </span>
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="text-xs line-through text-rose-200/80 font-normal">
                          ₹{test.regularPrice}
                        </span>
                        <span className="text-base sm:text-lg font-black text-white">
                          ₹{test.memberPrice}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-1.5 py-0.2 rounded-xs inline-block shadow-xs">
                        {test.discountPercent}% Off
                      </span>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------ */}
                {/* BOTTOM CONTENT: Report Time, Test Count & Buttons*/}
                {/* ------------------------------------------------ */}
                <div className="p-4 sm:p-5 flex flex-col justify-between gap-4 flex-1">
                  {/* Metadata Icons Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-[#97144D] dark:text-rose-400 shrink-0" />
                      <span className="truncate">
                        Reports Within <strong className="text-slate-800 dark:text-slate-200">{test.reportTime}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Microscope className="h-4 w-4 text-[#97144D] dark:text-rose-400 shrink-0" />
                      <span className="truncate">
                        <strong className="text-slate-800 dark:text-slate-200">{test.testsCount}</strong> {test.testsCount > 1 ? "tests" : "test"} included
                      </span>
                    </div>
                  </div>

                  {/* Actions Row: View Details & Add to Cart/Book */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(test)}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-[#97144D] dark:border-rose-400 text-[#97144D] dark:text-rose-400 hover:bg-[#97144D]/10 font-bold text-xs transition-colors cursor-pointer text-center"
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDetail(test)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#97144D] hover:bg-[#820d3f] text-white font-bold text-xs shadow-md shadow-[#97144D]/25 transition-all cursor-pointer text-center active:scale-95 flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Book Test</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PAGINATION INDICATOR (Matching Screenshot 1/7 Dots)      */}
        {/* ======================================================== */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {/* Current Page Pill */}
          <div className="bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
            {currentSlideIndex + 1}/{MOST_BOOKED_TESTS.length}
          </div>

          {/* Dots */}
          <div className="flex items-center gap-1.5 ml-1">
            {MOST_BOOKED_TESTS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      left: idx * 340,
                      behavior: "smooth"
                    });
                    setCurrentSlideIndex(idx);
                  }
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentSlideIndex
                    ? "w-2.5 h-2.5 bg-[#97144D]"
                    : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
                aria-label={`Jump to test ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* TEST DETAILS & DIRECT BOOKING MODAL                     */}
      {/* ======================================================== */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg p-0 rounded-3xl border-0 shadow-2xl bg-white dark:bg-[#0F172A] overflow-hidden">
          {selectedTest && (
            <div>
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-br from-[#97144D] via-[#a81655] to-[#7d0f3f] text-white relative">
                <DialogHeader className="text-left space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md mb-1 w-fit">
                    <Sparkles className="h-3 w-3" />
                    <span>{selectedTest.category} • {selectedTest.tag}</span>
                  </div>
                  <DialogTitle className="text-2xl font-black text-white leading-tight">
                    {selectedTest.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-rose-100 max-w-md">
                    {selectedTest.description}
                  </DialogDescription>
                </DialogHeader>

                {/* Price Summary */}
                <div className="mt-4 pt-3 border-t border-white/20 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">
                      ₹{selectedTest.memberPrice}
                    </span>
                    <span className="text-xs line-through text-rose-200">
                      Regular ₹{selectedTest.regularPrice}
                    </span>
                  </div>
                  <span className="bg-emerald-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                    Save {selectedTest.discountPercent}% with Metrogram Card
                  </span>
                </div>
              </div>

              {/* Specs & Parameters */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Turnaround</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Within {selectedTest.reportTime}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Preparation</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTest.fasting}</span>
                  </div>
                </div>

                {/* Parameters List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Included Parameters &amp; Tests ({selectedTest.testsCount})
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {selectedTest.parameters.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                        <CheckCircle2 className="h-4 w-4 text-[#97144D] dark:text-rose-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Booking Form */}
                <form onSubmit={handleConfirmBooking} className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Quick Booking with Metrogram Card
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Input
                        placeholder="Patient Full Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                        className="h-10 text-xs"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="10-digit mobile number"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        maxLength={10}
                        required
                        className="h-10 text-xs"
                      />
                    </div>
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
                      disabled={isBooking}
                      className="bg-[#97144D] hover:bg-[#820d3f] text-white font-bold px-6 h-10 text-xs rounded-xl shadow-md shadow-[#97144D]/25 cursor-pointer"
                    >
                      {isBooking ? "Confirming..." : `Book Test • ₹${selectedTest.memberPrice}`}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
