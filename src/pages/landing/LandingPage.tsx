import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Stethoscope,
  Activity,
  CreditCard,
  Building2,
  Users,
  CheckCircle2,
  PhoneCall,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calculator,
  MapPin,
  Award,
  BadgePercent,
  Pill,
  UserCheck,
  Check,
  HelpCircle,
  Phone,
  Ambulance,
  Microscope,
  MessageSquare,
  CheckCircle,
  XCircle,
  Wallet,
  Brain,
  Scan,
  FlaskConical,
  FileText,
  Sparkles,
  Briefcase,
  Store,
  TrendingUp,
  Syringe,
  Handshake,
  DollarSign,
  GraduationCap,
  Building,
  Truck,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

// ==========================================
// 1. DATA MODELS & CONSTANTS
// ==========================================

// Hero Carousel Slides (Matching mock layout)
interface HeroSlide {
  id: number;
  title: string;
  badgeTitle: string;
  description: string;
  bgImage: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    title: "Metrogram Annual Membership Card",
    badgeTitle: "Annual Membership • Just ₹100/Year",
    description:
      "Get complete 1-year access to exclusive discounts on Metrogram Pathology, Radiology (CT Scan, MRI, Ultrasound), and Diagnostic Psychography across Bihar.",
    bgImage: "/hero-medical.jpg",
    alt: "Metrogram Annual Membership Card for ₹100",
  },
  {
    id: 1,
    title: "Metrogram Pathology & Blood Specimen Care",
    badgeTitle: "Metrogram Pathology",
    description:
      "Advanced clinical pathology with certified diagnostics, standardized blood specimen collection, temperature-controlled processing, and rapid lab reporting.",
    bgImage:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&auto=format&fit=crop&q=85",
    alt: "Metrogram Pathology Laboratory Diagnostics",
  },
  {
    id: 2,
    title: "Advanced Radiology: CT Scan, MRI & Ultrasound",
    badgeTitle: "Radiology Diagnostics",
    description:
      "High-precision diagnostic imaging suites: High-speed multi-slice CT Scan, Magnetic Resonance Imaging (MRI), and high-resolution 3D/4D Ultrasound sonography.",
    bgImage:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1920&auto=format&fit=crop&q=85",
    alt: "CT Scan MRI Ultrasound Radiology Diagnostics",
  },
  {
    id: 3,
    title: "Specialized Diagnostic Psychography",
    badgeTitle: "Psychography Suite",
    description:
      "Systematic psychographic profiling, cognitive evaluations, behavioral diagnostics, and mental health screenings guided by clinical experts.",
    bgImage:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&auto=format&fit=crop&q=85",
    alt: "Specialized Diagnostic Psychography Assessments",
  },
];

// Card Membership Plans (Only ONE Card for ₹100 for One Year)
interface CardPlan {
  id: string;
  name: string;
  tier: string;
  price: number;
  regularPrice: number;
  validity: string;
  membersCount: string;
  popular?: boolean;
  badge?: string;
  colorScheme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    gradient: string;
  };
  surgeryCoverage: string;
  icuCoverage: string;
  opdLabDiscount: string;
  features: string[];
}

const METROGRAM_CARD_PLANS: CardPlan[] = [
  {
    id: "plan-annual-membership",
    name: "Metrogram Annual Membership Card",
    tier: "Official Healthcare Membership",
    price: 100,
    regularPrice: 499,
    validity: "1 Year (365 Days)",
    membersCount: "Cardholder & Family",
    popular: true,
    badge: "ONLY ₹100 FOR FULL 1 YEAR",
    colorScheme: {
      badgeBg: "bg-rose-100 dark:bg-rose-950/60",
      badgeText: "text-rose-800 dark:text-rose-300",
      border: "border-[#97144D] dark:border-rose-500",
      gradient:
        "from-rose-50 to-slate-50 dark:from-slate-900 dark:to-rose-950/30",
    },
    surgeryCoverage: "Metrogram Pathology",
    icuCoverage: "Radiology (CT, MRI, USG)",
    opdLabDiscount: "Diagnostic Psychography",
    features: [
      "Full 1-Year (365 Days) Membership Validity for just ₹100",
      "Metrogram Pathology: Comprehensive NABL blood & clinical tests",
      "Standardized Blood Specimen Collection: Processing, Importance & Procedure",
      "Radiology Diagnostics: Discounted rates on CT Scan, MRI & Ultrasound",
      "Diagnostic Psychography: Structured mental & cognitive assessments",
      "Instant Digital QR Card on WhatsApp within 5 minutes",
      "Accepted across 120+ partner diagnostic & hospital centers in Bihar",
    ],
  },
];

// Covered Medical Categories (Exclusively Metrogram Pathology, Radiology, Psychography, Blood Specimen Collection)
const COVERED_CATEGORIES = [
  {
    title: "Metrogram Pathology",
    icon: Microscope,
    badge: "Clinical Laboratory",
    examples:
      "Hematology, Biochemistry, Lipid Profile, Liver & Kidney Function Panels, Hormonal & Thyroid Assays, Blood Glucose, Complete Urine Routine",
    description:
      "High-precision diagnostic testing utilizing automated NABL-certified analyzers. Delivers accurate cellular, biochemical, and immunological profiling for early disease identification, organ function tracking, and routine clinical monitoring.",
  },
  {
    title: "Blood Specimen Collection",
    icon: FlaskConical,
    badge: "Specimen Management Protocol",
    examples:
      "Processing, Importance, Procedure: Sterile vacuum venipuncture, centrifuge separation, temperature-controlled chain",
    description:
      "A systematic clinical standard ensuring diagnostic accuracy through precise pre-analytical handling, aseptic collection, and automated specimen separation.",
    details: {
      importance:
        "The cornerstone of medical diagnosis. Proper specimen integrity prevents hemolysis and pre-analytical variance, enabling clinicians to detect metabolic, infectious, and systemic disorders with high diagnostic reliability.",
      procedure:
        "Conducted via sterile aseptic venipuncture by trained phlebotomists using vacuum collection tubes (EDTA, Serum Separator Gel, Sodium Citrate) with barcode verification and precise multi-inversion mixing.",
      processing:
        "Immediate temperature-monitored handling, calibrated centrifugation for serum/plasma separation, and rapid dispatch to automated hematology and biochemistry analyzers.",
    },
  },
  {
    title: "Radiology: CT Scan, MRI & Ultrasound",
    icon: Scan,
    badge: "Diagnostic Medical Imaging",
    examples:
      "Multi-Slice CT Scan (Chest, Abdomen, Brain), High-Field MRI (Brain, Spine, Joints), HD 3D/4D Ultrasound & Color Doppler",
    description:
      "Comprehensive diagnostic radiology offering non-invasive internal visualization with cutting-edge medical imaging modalities.",
    details: {
      ctScan:
        "Multi-slice Computed Tomography delivering cross-sectional imaging for acute trauma, chest pathologies, abdominal organs, and cranial diagnostics.",
      mri:
        "High-contrast Magnetic Resonance Imaging for brain, neuro-vascular structures, spine disc alignment, and musculoskeletal joints with zero ionizing radiation.",
      ultrasound:
        "High-definition sonography and color Doppler for whole abdomen scans, pelvic evaluations, obstetrics, vascular blood flow, and soft-tissue diagnostics.",
    },
  },
  {
    title: "Diagnostic Psychography",
    icon: Brain,
    badge: "Cognitive & Mental Diagnostics",
    examples:
      "Comprehensive Cognitive Profiling, Mental Health Diagnostics, Behavioral Indices, Stress & Neurological Screenings",
    description:
      "Structured diagnostic psychography evaluations and neuro-cognitive assessments designed to map psychological tendencies, cognitive faculties, emotional well-being, and behavioral markers for holistic clinical care.",
  },
];

// Empanelled Hospital Network in Bihar
interface PartnerHospital {
  name: string;
  city: string;
  type: string;
  beds: string;
  specialties: string[];
  address: string;
  rating: string;
}

const EMPANELLED_HOSPITALS: PartnerHospital[] = [
  {
    name: "Metrogram Heart & Multispecialty Hospital",
    city: "Patna",
    type: "Super Specialty Network Hospital",
    beds: "150 Beds (35 ICU)",
    specialties: ["Pathology", "Radiology (CT/MRI/USG)", "Psychography", "Cardiology"],
    address: "Bailey Road / Exhibition Road Hub, Patna",
    rating: "4.9 ★",
  },
  {
    name: "Paras HMRI Empanelled Care Wing",
    city: "Patna",
    type: "Empanelled Tier-1 Partner",
    beds: "350 Beds (80 ICU)",
    specialties: ["Radiology", "Pathology", "Neurosurgery", "Diagnostic Scans"],
    address: "Raja Bazar, Bailey Road, Patna",
    rating: "4.8 ★",
  },
  {
    name: "Mithila Metro Multi-Care Hospital",
    city: "Muzaffarpur",
    type: "Regional Super Specialty",
    beds: "120 Beds (25 ICU)",
    specialties: ["Pathology Lab", "Radiology (CT/USG)", "General Diagnostics"],
    address: "Club Road, Mithanpura, Muzaffarpur",
    rating: "4.9 ★",
  },
  {
    name: "Magadh Metrogram Advanced Hospital",
    city: "Gaya",
    type: "Empanelled Network Hub",
    beds: "90 Beds (18 ICU)",
    specialties: [
      "Pathology Suite",
      "Radiology CT Scan",
      "Psychography",
      "Internal Medicine",
    ],
    address: "Station Road, AP Colony, Gaya",
    rating: "4.8 ★",
  },
  {
    name: "Anga Metrogram Diagnostic & Surgical Center",
    city: "Bhagalpur",
    type: "Diagnostic & Surgical Hub",
    beds: "80 Beds (15 ICU)",
    specialties: [
      "Pathology Lab",
      "Ultrasound & CT",
      "Psychography",
      "Pediatrics",
    ],
    address: "Tilkamanjhi Zero Mile, Bhagalpur",
    rating: "4.8 ★",
  },
  {
    name: "Darbhanga Metro Health City",
    city: "Darbhanga",
    type: "Mithilanchal Referral Hospital",
    beds: "110 Beds (20 ICU)",
    specialties: [
      "MRI & CT Scan",
      "Pathology Diagnostics",
      "Psychography Profiling",
      "Dialysis",
    ],
    address: "Laheriasarai Main Road, Darbhanga",
    rating: "4.9 ★",
  },
  {
    name: "Kosi-Seemanchal Metro Hospital",
    city: "Purnia",
    type: "Regional Partner Hospital",
    beds: "75 Beds (12 ICU)",
    specialties: ["Pathology Lab", "Ultrasound Sonography", "Critical Care"],
    address: "Line Bazar Medical Hub, Purnia",
    rating: "4.7 ★",
  },
  {
    name: "Begusarai Metro Specialty Hospital",
    city: "Begusarai",
    type: "Industrial Hub Partner Hospital",
    beds: "65 Beds (10 ICU)",
    specialties: ["Radiology CT/USG", "Pathology Diagnostics", "Psychography"],
    address: "Harhar Mahadev Chowk, Begusarai",
    rating: "4.8 ★",
  },
];

// Direct Comparison Matrix: Metrogram Card vs Health Insurance vs Ayushman Card
const COMPARISON_ROWS = [
  {
    feature: "Diagnostic Scope (Pathology, CT, MRI, USG, Psychography)",
    metrogramCard: "All Covered with Instant Discounts",
    insurance: "Rarely covered (Hospitalization only)",
    ayushman: "Limited to inpatient admissions only",
  },
  {
    feature: "Blood Specimen Collection & Home Diagnostics",
    metrogramCard: "Standardized Collection & Discounted Processing",
    insurance: "Not Covered out-of-pocket",
    ayushman: "Not Available outside government center",
  },
  {
    feature: "Annual Membership Cost for 1 Full Year",
    metrogramCard: "Just ₹100 / year (Fixed One Card)",
    insurance: "₹22,000 – ₹45,000+ / year",
    ayushman: "Free (Govt. sponsored for eligible BPL only)",
  },
  {
    feature: "Claim Process & Paperwork",
    metrogramCard: "Instant On-Counter Deduction (Zero Claims)",
    insurance: "Lengthy 30–60 day paperwork & rejections",
    ayushman: "Biometric card validation required",
  },
  {
    feature: "Pre-Existing Conditions & Age Cap",
    metrogramCard: "Day 1 Coverage & No Age Cap",
    insurance: "2 to 4 Years Waiting Period",
    ayushman: "Requires government list eligibility",
  },
  {
    feature: "Rejection Rate at Diagnostic / Billing Counter",
    metrogramCard: "0% Rejection at 120+ Partner Centers",
    insurance: "15%–30% claims disputed or cut",
    ayushman: "Subject to package quotas",
  },
];

// Leadership & Advisory Team
const LEADERSHIP_TEAM = [
  {
    name: "Dr. Anand Kishore Sinha, MD",
    role: "Chief Medical Officer & Co-Founder",
    qualification: "MD (Internal Medicine) • Ex-Senior Consultant AIIMS & PMCH",
    bio: "Over 22 years of clinical leadership in Bihar. Architect of Metrogram’s diagnostic empanelment standards across Pathology, Radiology, and Psychography.",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Prashant Verma",
    role: "Managing Director & Promoter",
    qualification: "B.Tech (IIT), MBA • Healthcare Financing Pioneer",
    bio: "14+ years scaling healthcare access for middle-class and rural families. Leading Metrogram’s mission to make quality diagnostic and hospital care accessible for just ₹100/year.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Dr. Meenakshi Kumari, MS",
    role: "Head of Clinical Diagnostics & Quality Audit",
    qualification: "MS, Fellowship in Diagnostic & Critical Care Quality",
    bio: "Oversees lab protocols, standardized blood specimen collection procedures, imaging calibrations, and diagnostic discount compliance across 120+ empanelled centers in Bihar.",
    image:
      "https://images.unsplash.com/photo-1594824813515-99d98cf77f48?w=300&auto=format&fit=crop&q=80",
  },
];

// Metrogram Card FAQs
const FAQ_ITEMS = [
  {
    q: "What services does Metrogram offer?",
    a: "Metrogram exclusively offers Pathology (including specialized Blood Specimen Collection: Processing, Importance, and Procedure), Radiology (High-resolution CT Scan, MRI, and 3D/4D Ultrasound), and specialized Diagnostic Psychography cognitive and mental health assessments.",
  },
  {
    q: "How much does the Metrogram Membership Card cost and how long is it valid?",
    a: "There is only one simple, transparent card: the Metrogram Annual Membership Card for just ₹100 for one full year (365 days of complete validity). There are no hidden fees or tier upgrades.",
  },
  {
    q: "What is the importance and procedure for Blood Specimen Collection?",
    a: "Blood Specimen Collection is the foundation of clinical pathology. The procedure involves sterile vacuum venipuncture by trained phlebotomists using specialized additive tubes. Processing includes temperature-controlled transport, automated centrifuge serum/plasma separation, and rigorous NABL-standard quality testing to ensure diagnostic accuracy.",
  },
  {
    q: "What radiology imaging services are covered under the Metrogram Card?",
    a: "Metrogram covers multi-slice Computed Tomography (CT Scan), high-field Magnetic Resonance Imaging (MRI), and high-definition Ultrasound (Sonography & Color Doppler) with up to 50% discount at 120+ partner diagnostic centers.",
  },
  {
    q: "What is Psychography diagnostic assessment?",
    a: "Diagnostic psychography is a clinical evaluation of cognitive functions, emotional patterns, behavioral metrics, and mental health indicators, offering systematic profiling for holistic clinical diagnosis.",
  },
  {
    q: "How do I use my Metrogram Card at partner centers?",
    a: "Simply show your instant digital QR card on WhatsApp or your physical membership card at the registration/billing desk of any of our 120+ empanelled diagnostic centers to receive direct on-the-spot discounted rates.",
  },
];

export const LandingPage: React.FC = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // Hero Carousel Slider (5-second auto transition + manual prev/next)
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  // Filter for Empanelled Hospitals by City
  const [selectedHospitalCity, setSelectedHospitalCity] = useState("ALL");

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Card Application / Enquiry Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] =
    useState<CardPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "Patna",
    plan: "Metrogram Annual Membership Card (₹100/yr)",
    familyMembers: "1 Year Membership (₹100)",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const handleOpenApplyModal = (plan?: CardPlan) => {
    if (plan) {
      setSelectedPlanForModal(plan);
      setFormData((prev) => ({
        ...prev,
        plan: `${plan.name} (₹${plan.price}/yr)`,
      }));
    } else {
      setSelectedPlanForModal(METROGRAM_CARD_PLANS[0]);
      setFormData((prev) => ({
        ...prev,
        plan: "Metrogram Annual Membership Card (₹100/yr)",
      }));
    }
    setIsSubmittedSuccess(false);
    setIsApplyModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please enter your full name and contact phone number.");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please provide a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      toast.success(
        "Metrogram Card Application received! Instant Digital Card dispatched to WhatsApp.",
      );
    }, 800);
  };

  const handleResetModal = () => {
    setIsSubmittedSuccess(false);
    setIsApplyModalOpen(false);
    setFormData({
      name: "",
      phone: "",
      city: "Patna",
      plan: "Metrogram Annual Membership Card (₹100/yr)",
      familyMembers: "1 Year Membership (₹100)",
      message: "",
    });
  };

  // Career (Phlebo) & Franchise Application State
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerModalType, setPartnerModalType] = useState<"phlebo" | "franchise">("phlebo");
  const [partnerFormData, setPartnerFormData] = useState({
    name: "",
    phone: "",
    city: "Patna",
    roleType: "phlebo" as "phlebo" | "franchise",
    qualification: "DMLT / BMLT",
    hasBike: "Yes",
    experience: "1 - 3 Years",
    spaceAvailable: "100 - 250 sq.ft",
    currentBusiness: "Pharmacy / Medical Store",
    investmentBudget: "₹1 Lakh - ₹3 Lakhs",
    message: "",
  });
  const [isPartnerSubmitting, setIsPartnerSubmitting] = useState(false);
  const [isPartnerSuccess, setIsPartnerSuccess] = useState(false);

  const handleOpenPartnerModal = (type: "phlebo" | "franchise") => {
    setPartnerModalType(type);
    setPartnerFormData((prev) => ({
      ...prev,
      roleType: type,
    }));
    setIsPartnerSuccess(false);
    setIsPartnerModalOpen(true);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerFormData.name.trim() || !partnerFormData.phone.trim()) {
      toast.error("Please enter your name and contact phone number.");
      return;
    }
    if (partnerFormData.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please provide a valid 10-digit mobile number.");
      return;
    }
    setIsPartnerSubmitting(true);
    setTimeout(() => {
      setIsPartnerSubmitting(false);
      setIsPartnerSuccess(true);
      toast.success(
        partnerFormData.roleType === "phlebo"
          ? "Phlebotomist Application submitted successfully! Our team will contact you for verification."
          : "Franchise Inquiry submitted successfully! Our franchise manager will contact you."
      );
    }, 800);
  };

  const handleResetPartnerModal = () => {
    setIsPartnerSuccess(false);
    setIsPartnerModalOpen(false);
    setPartnerFormData({
      name: "",
      phone: "",
      city: "Patna",
      roleType: partnerModalType,
      qualification: "DMLT / BMLT",
      hasBike: "Yes",
      experience: "1 - 3 Years",
      spaceAvailable: "100 - 250 sq.ft",
      currentBusiness: "Pharmacy / Medical Store",
      investmentBudget: "₹1 Lakh - ₹3 Lakhs",
      message: "",
    });
  };

  const filteredHospitals = EMPANELLED_HOSPITALS.filter(
    (h) =>
      selectedHospitalCity === "ALL" ||
      h.city.toLowerCase() === selectedHospitalCity.toLowerCase(),
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] text-[#1E293B] dark:text-[#F1F5F9] font-sans antialiased selection:bg-[#97144D] selection:text-white pb-16 md:pb-0">
      {/* 1. TOP ANNOUNCEMENT & 24/7 HOSPITAL HELPLINE BAR (Axis Burgundy Theme) */}
      <div className="bg-[#97144D] text-white text-xs py-2 px-4 sm:px-6 lg:px-10 xl:px-16 border-b border-[#820d3f] sticky top-0 z-50">
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold tracking-wide">
              METROGRAM HEALTH CARD • JUST ₹100 FOR 1 FULL YEAR
            </span>
            <span className="hidden lg:inline-block text-white/70">|</span>
            <span className="hidden lg:inline-block text-rose-100">
              Pathology • Radiology (CT, MRI, Ultrasound) • Psychography
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+919123456789"
              className="flex items-center gap-1.5 font-bold hover:text-rose-200 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5 animate-bounce" />
              <span>24/7 Helpline: +91 91234 56789</span>
            </a>
            <span className="hidden sm:inline-block text-white/50">|</span>
            <a
              href="https://wa.me/919123456789?text=Hello%20Metrogram,%20I%20want%20to%20apply%20for%20the%20Metrogram%20Health%20Card"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 font-semibold text-emerald-200 hover:text-white transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-300" />
              <span>WhatsApp Card Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-8 z-40 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group py-1">
            <img
              src="/logo.png"
              alt="Metrogram Health Card"
              className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <a
              href="#how-it-works"
              className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#plans"
              className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors"
            >
              Membership (₹100)
            </a>
            <a
              href="#services"
              className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors"
            >
              Services
            </a>
            <a
              href="#hospitals"
              className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors"
            >
              Partner Centers
            </a>
            <a
              href="#careers"
              className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <span>Careers</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-[#97144D] dark:bg-rose-950 dark:text-rose-300 font-bold">Phlebo</span>
            </a>
            <a
              href="#franchise"
              className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <span>Franchise</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">Partner</span>
            </a>
            <a
              href="#faqs"
              className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors"
            >
              FAQs
            </a>
          </nav>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="rounded-full h-9 w-9 text-slate-600 dark:text-slate-300 hover:text-[#97144D]"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Portal Login */}
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(
                    role === "CUSTOMER" ? "/customer/home" : "/dashboard",
                  )
                }
                className="hidden sm:inline-flex gap-2 border-slate-300 dark:border-slate-700 font-semibold"
              >
                <UserCheck className="h-4 w-4 text-[#97144D]" />
                <span>
                  {role === "CUSTOMER" ? "Cardholder Portal" : "Hospital Desk"}
                </span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex font-semibold text-slate-700 dark:text-slate-300 hover:text-[#97144D]"
              >
                <Link to="/login">Portal Login</Link>
              </Button>
            )}

            {/* Primary Action Button */}
            <Button
              size="sm"
              onClick={() => handleOpenApplyModal()}
              className="bg-[#97144D] hover:bg-[#820d3f] text-white font-bold px-4 py-2 rounded-lg shadow-sm shadow-[#97144D]/30 transition-all cursor-pointer"
            >
              <CreditCard className="h-4 w-4 mr-1.5" />
              <span>Get Card • ₹100/yr</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION — HALF-PAGE BANNER CAROUSEL */}
      <section className="relative w-full h-[420px] sm:h-[460px] md:h-[490px] lg:h-[510px] flex items-center overflow-hidden bg-[#0A101D] border-b border-slate-200 dark:border-slate-800 select-none">
        {/* Background Image Carousel with Cross-Fade */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 z-0"
                : "opacity-0 pointer-events-none -z-10"
            }`}
            style={{
              backgroundImage: `url('${slide.bgImage}')`,
            }}
            aria-label={slide.alt}
          />
        ))}

        {/* Cinematic Scrim & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35 dark:from-black/90 dark:via-black/75 dark:to-black/60 z-1 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/70 pointer-events-none z-1" />

        {/* Left Arrow Navigation Button */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-2.5 sm:left-5 md:left-7 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center transition-all hover:scale-110 z-20 cursor-pointer border border-white/40"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Right Arrow Navigation Button */}
        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-2.5 sm:right-5 md:right-7 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center transition-all hover:scale-110 z-20 cursor-pointer border border-white/40"
          aria-label="Next Slide"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-3.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? "w-7 sm:w-8 h-2.5 rounded-full bg-emerald-500 shadow-md"
                  : "w-2.5 h-2.5 rounded-full bg-white/60 hover:bg-white/90"
              }`}
              aria-label={`Slide ${idx + 1}${idx === currentSlide ? " (Active)" : ""}`}
            />
          ))}
        </div>
      </section>

      {/* 4. HOW METROGRAM CARD WORKS (3 Simple Steps - 4th step removed) */}
      <section
        id="how-it-works"
        className="py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <Activity className="h-3.5 w-3.5" />
              <span>SEAMLESS DIAGNOSTIC & BILL COVERAGE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              How Metrogram Works in 3 Simple Steps
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              No complicated insurance paperwork, no agent commissions, and zero reimbursement wait times.
            </p>
          </div>

          {/* 3 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group hover:border-[#97144D]/40 transition-all shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-[#97144D] text-white flex items-center justify-center font-black text-base mb-4 shadow-md shadow-[#97144D]/25">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                1. Get Your Metrogram Card
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Activate your 1-year Metrogram Membership Card for just ₹100. Receive your instant Digital QR Card on WhatsApp in 5 minutes and physical card delivered to your home.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group hover:border-[#97144D]/40 transition-all shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-[#97144D] text-white flex items-center justify-center font-black text-base mb-4 shadow-md shadow-[#97144D]/25">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                2. Visit 120+ Partner Centers
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Walk into any empanelled multi-specialty hospital or diagnostic center across Bihar for Metrogram Pathology, Radiology (CT scan, MRI, Ultrasound), or Psychography.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group hover:border-[#97144D]/40 transition-all shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-[#97144D] text-white flex items-center justify-center font-black text-base mb-4 shadow-md shadow-[#97144D]/25">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                3. Flash Card & Save Instantly
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Show your Metrogram Card QR code at the registration counter to receive instant pre-authorized bill discounts on your pathology tests, diagnostic scans, and psychography evaluations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CARD PLANS & PRICING (Single Card for ₹100 for One Year) */}
      <section
        id="plans"
        className="py-20 bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <CreditCard className="h-3.5 w-3.5" />
              <span>ONE CARD • ONE YEAR • ONE FIXED PRICE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Metrogram Membership Card for 1 Full Year
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              One simple, transparent membership card at only ₹100 for 365 days of complete diagnostic coverage.
            </p>
          </div>

          {/* Single Card Presentation */}
          <div className="max-w-xl mx-auto">
            {METROGRAM_CARD_PLANS.map((plan) => {
              const savingsPercent = Math.round(
                ((plan.regularPrice - plan.price) / plan.regularPrice) * 100,
              );

              return (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 flex flex-col justify-between border-2 border-[#97144D] ring-4 ring-[#97144D]/15 dark:border-rose-500 shadow-2xl relative"
                >
                  {/* Top Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#97144D] text-white text-[11px] font-extrabold px-5 py-1 rounded-full shadow-md tracking-wider">
                    {plan.badge}
                  </div>

                  <div>
                    {/* Header */}
                    <div className="mb-6 text-center">
                      <span className="text-xs font-bold text-[#97144D] dark:text-rose-400 uppercase tracking-widest block mb-1">
                        {plan.tier}
                      </span>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3.5 w-3.5 text-[#97144D]" />
                        <span>{plan.membersCount}</span>
                        <span>•</span>
                        <span>{plan.validity}</span>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl mb-6 border border-slate-100 dark:border-slate-800 text-center">
                      <div className="flex items-baseline justify-center gap-3">
                        <span className="text-sm text-slate-400 line-through">
                          ₹{plan.regularPrice.toLocaleString()}
                        </span>
                        <div className="text-4xl sm:text-5xl font-black text-[#97144D] dark:text-rose-400 inline-block">
                          ₹{plan.price.toLocaleString()}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300 font-bold">
                          / year
                        </span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md ml-2">
                          {savingsPercent}% OFF
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Just ₹100 for 365 days of complete diagnostic coverage across Bihar.
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-6 text-xs">
                      <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Pathology
                        </div>
                        <div className="font-extrabold text-[#97144D] dark:text-rose-300">
                          {plan.surgeryCoverage}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Radiology
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {plan.icuCoverage}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Psychography
                        </div>
                        <div className="font-bold text-emerald-700 dark:text-emerald-300">
                          {plan.opdLabDiscount}
                        </div>
                      </div>
                    </div>

                    {/* Features Checklist */}
                    <div className="space-y-3 mb-8">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Included Card Benefits:
                      </div>
                      {plan.features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <Button
                      size="lg"
                      onClick={() => handleOpenApplyModal(plan)}
                      className="w-full font-bold text-sm h-12 rounded-xl cursor-pointer bg-[#97144D] hover:bg-[#820d3f] text-white shadow-lg shadow-[#97144D]/30"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Apply for Metrogram Card (₹100/yr)</span>
                    </Button>
                    <a
                      href={`https://wa.me/919123456789?text=Hi%20Metrogram,%20I%20want%20to%20activate%20the%20Metrogram%20Membership%20Card%20for%20Rs%20100`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center text-xs font-bold py-2 text-emerald-700 dark:text-emerald-300 hover:underline"
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      Chat with Card Specialist on WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. WHAT SERVICES METROGRAM OFFERS EXCLUSIVELY */}
      <section
        id="services"
        className="py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>METROGRAM EXCLUSIVE SERVICES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Our Core Diagnostic Services
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Metrogram exclusively provides specialized Pathology, advanced Radiology (CT Scan, MRI, Ultrasound), and Diagnostic Psychography.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* 1. Metrogram Pathology */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#97144D]/40 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-[#97144D] dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
                    <Microscope className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-extrabold text-[#97144D] dark:text-rose-300 bg-[#97144D]/10 px-3 py-1 rounded-full border border-[#97144D]/20">
                    NABL Standard Testing
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Metrogram Pathology
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  High-precision diagnostic testing utilizing automated NABL-certified analyzers. Delivers accurate cellular, biochemical, and immunological profiling for early disease identification, organ monitoring, and routine health checks.
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Complete Blood Counts (CBC), Hemogram, & Erythrocyte Indices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Liver Function (LFT), Kidney Function (KFT), & Lipid Profiling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Thyroid Hormone Assays (T3, T4, TSH) & Glycated Hemoglobin (HbA1c)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Blood Specimen Collection */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#97144D]/40 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/30">
                    <FlaskConical className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    Clinical Phlebotomy
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Blood Specimen Collection
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Standardized pre-analytical blood collection protocol guaranteeing accurate laboratory results:
                </p>
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-900 dark:text-white font-bold block text-[11px] mb-0.5">
                      Importance:
                    </strong>
                    <span className="text-slate-600 dark:text-slate-300">
                      Essential foundation for diagnostic accuracy. Proper collection prevents specimen hemolysis and pre-analytical variances, ensuring medical interventions are guided by true biochemical baselines.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-900 dark:text-white font-bold block text-[11px] mb-0.5">
                      Procedure:
                    </strong>
                    <span className="text-slate-600 dark:text-slate-300">
                      Sterile aseptic venipuncture performed by trained phlebotomists using specialized color-coded vacuum tubes (EDTA, Serum Gel, Sodium Citrate) with barcode verification and proper tube inversion.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-900 dark:text-white font-bold block text-[11px] mb-0.5">
                      Processing:
                    </strong>
                    <span className="text-slate-600 dark:text-slate-300">
                      Controlled temperature maintenance, standardized centrifugation for plasma/serum separation, automated sample pipetting, and prompt analytical evaluation.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Radiology: CT Scan, MRI & Ultrasound */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#97144D]/40 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                    <Scan className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                    Advanced Imaging
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Radiology: CT Scan, MRI & Ultrasound
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Advanced high-resolution diagnostic imaging modalities delivering non-invasive internal anatomical clarity:
                </p>
                <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold shrink-0 text-[10px]">
                      CT SCAN
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Multi-slice Computed Tomography for high-speed cross-sectional examination of the brain, chest, abdomen, pelvis, and trauma bone mapping.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold shrink-0 text-[10px]">
                      MRI SCAN
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      High-field Magnetic Resonance Imaging for detailed soft-tissue visualization of the brain, spinal column, ligaments, joints, and neurovascular pathways.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold shrink-0 text-[10px]">
                      ULTRASOUND
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      HD 3D/4D Sonography and Color Doppler for whole abdomen, pelvic, obstetrics, carotid/arterial blood flow, and soft-tissue evaluation.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Diagnostic Psychography */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#97144D]/40 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/30">
                    <Brain className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                    Cognitive Assessment
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Diagnostic Psychography
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Specialized diagnostic psychography evaluations, neuro-cognitive mapping, and clinical mental health screenings. Providing structured evaluations to map psychological patterns, cognitive functions, and emotional wellness.
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Systematic Psychographic Behavioral & Cognitive Profiling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Mental Health Diagnostic Screening & Stress Marker Profiling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Neuro-psychological Baseline Testing for Clinical Decision Making</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 120+ EMPANELLED HOSPITALS & DIAGNOSTIC NETWORK ACROSS BIHAR */}
      <section
        id="hospitals"
        className="py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <Building2 className="h-3.5 w-3.5" />
              <span>BIHAR NETWORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              120+ Empanelled Diagnostic & Hospital Hubs
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Show your Metrogram Card at any of these verified diagnostic partner centers across Bihar for instant discounts.
            </p>

            {/* City Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {[
                "ALL",
                "Patna",
                "Muzaffarpur",
                "Gaya",
                "Bhagalpur",
                "Darbhanga",
                "Begusarai",
                "Purnia",
              ].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedHospitalCity(city)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedHospitalCity === city
                      ? "bg-[#97144D] text-white shadow-sm shadow-[#97144D]/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {city === "ALL" ? "All Bihar Districts" : city}
                </button>
              ))}
            </div>
          </div>

          {/* Hospitals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredHospitals.map((hosp, hIdx) => (
              <div
                key={hIdx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-[#97144D]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#97144D] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-sm border border-rose-100 dark:border-rose-900/40">
                      {hosp.city}
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {hosp.rating}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-1">
                    {hosp.name}
                  </h3>
                  <div className="text-xs text-slate-500 mb-3">
                    {hosp.type} • {hosp.beds}
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Key Specialties:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hosp.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1 mb-4">
                    <MapPin className="h-3.5 w-3.5 text-[#97144D] shrink-0 mt-0.5" />
                    <span>{hosp.address}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Card Empanelled
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenApplyModal()}
                    className="text-xs font-bold h-8 border-slate-300 dark:border-slate-700"
                  >
                    Partner Desk
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-500 mb-3">
              Need assistance booking a CT scan, MRI, Ultrasound, or Pathology test? Our 24/7 care managers assist with appointment slots across 50+ additional empanelled centers.
            </p>
            <a
              href="tel:+919123456789"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#97144D] dark:text-rose-400 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call 24/7 Diagnostic Desk (+91 91234 56789)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. METROGRAM CARD VS TRADITIONAL HEALTH INSURANCE VS AYUSHMAN */}
      <section
        id="comparison"
        className="py-20 bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <BadgePercent className="h-3.5 w-3.5" />
              <span>TRANSPARENT COMPARISON</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Families Prefer Metrogram Card over Health Insurance
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Instant diagnostic discounts, no paperwork, and just ₹100 for a full year.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-black">
                    <th className="p-4 sm:p-5">Benefit / Feature</th>
                    <th className="p-4 sm:p-5 bg-[#97144D] text-white">
                      Metrogram Health Card
                    </th>
                    <th className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                      Standard Health Insurance
                    </th>
                    <th className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                      Ayushman Card (PMJAY)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                    >
                      <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">
                        {row.feature}
                      </td>
                      <td className="p-4 sm:p-5 font-extrabold text-[#97144D] dark:text-rose-300 bg-rose-50/40 dark:bg-rose-950/20">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{row.metrogramCard}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <XCircle className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>{row.insurance}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">
                        {row.ayushman}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 10. ABOUT US & MEDICAL LEADERSHIP */}
      <section
        id="about-us"
        className="py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left 6 Columns: Story & Mission */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
                <Building2 className="h-3.5 w-3.5" />
                <span>ABOUT METROGRAM HEALTHCARE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Democratizing Quality Diagnostics & Care for Every Family in Bihar
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Founded to eliminate expensive diagnostic out-of-pocket costs for middle-class and working families across Bihar, <strong>Metrogram</strong> provides direct bulk-negotiated discounts on Pathology, Radiology (CT Scan, MRI, Ultrasound), and Diagnostic Psychography.
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                By presenting your Metrogram Card, you bypass inflated diagnostic charges and access pre-authorized medical subsidies directly at partner diagnostic counters for just ₹100/year.
              </p>

              {/* Quality & Verification Standards */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <Award className="h-5 w-5 text-[#97144D] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white block font-bold">
                      120+ Empanelled Diagnostic & Hospital Partners
                    </strong>
                    Strict compliance with fixed discounted diagnostic package rates.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="h-5 w-5 text-[#97144D] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white block font-bold">
                      ISO 9001:2015 Quality Certified & Govt. Registered
                    </strong>
                    Compliant healthcare platform supporting standardized pathology and radiology clinical diagnostics.
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Leadership / Promoters */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>Medical Governance & Founders</span>
                  <Badge
                    variant="outline"
                    className="text-xs text-[#97144D] border-[#97144D]/30"
                  >
                    Clinical Board
                  </Badge>
                </h3>

                <div className="space-y-5">
                  {LEADERSHIP_TEAM.map((leader, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0"
                    >
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-[#97144D]/30 shrink-0"
                      />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {leader.name}
                        </h4>
                        <div className="text-xs font-semibold text-[#97144D] dark:text-rose-400">
                          {leader.role}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {leader.qualification}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                          {leader.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CAREERS & FRANCHISE PARTNER OPPORTUNITIES */}
      <section
        id="careers"
        className="py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 relative"
      >
        {/* Anchor for Franchise */}
        <div id="franchise" className="absolute -top-24 left-0" />

        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <Briefcase className="h-3.5 w-3.5" />
              <span>CAREERS & BUSINESS FRANCHISE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Grow with Metrogram: Join as a Phlebo or Buy a Franchise
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Be a part of Bihar’s fastest-expanding diagnostic network. Build a high-earning healthcare career or launch your own profitable Diagnostic Collection Center.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* PILLAR 1: JOIN AS A PHLEBOTOMIST (PHLEBO) */}
            <div className="p-8 sm:p-9 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-[#97144D]/50 transition-all shadow-md flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-[#97144D]/10 blur-2xl pointer-events-none group-hover:bg-[#97144D]/20 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-[#97144D] dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/40">
                    <Syringe className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-extrabold text-[#97144D] dark:text-rose-300 bg-[#97144D]/10 px-3.5 py-1 rounded-full border border-[#97144D]/20">
                    Career • Hiring Phlebos
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Join as a Phlebotomist (Phlebo)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Perform sterile doorstep blood specimen collection across homes and clinics in Bihar with flexible shifts, top earnings, and guaranteed supplies.
                </p>

                <div className="space-y-3.5 mb-8 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
                    <DollarSign className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                        High Per-Sample Earnings & Bonuses:
                      </strong>
                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                        Earn attractive per-collection payouts + monthly retainers + performance milestone bonuses.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
                    <FlaskConical className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                        Free Medical Kit & Cold-Chain Bag:
                      </strong>
                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                        High-quality vacutainers, sterile needle sets, tourniquets, PPE, and temperature-monitored sample boxes.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
                    <Truck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                        Smart Route & Live Settlement App:
                      </strong>
                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                        Automated patient route navigation, digital sample barcode validation, and instant daily payout tracking.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
                    <GraduationCap className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                        Eligibility & Qualifications:
                      </strong>
                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                        DMLT / BMLT / GNM / Nursing or Certified Phlebotomist with valid two-wheeler & smartphone.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  onClick={() => handleOpenPartnerModal("phlebo")}
                  className="flex-1 bg-[#97144D] hover:bg-[#820d3f] text-white font-bold h-11 rounded-xl shadow-md shadow-[#97144D]/25 cursor-pointer text-xs"
                >
                  <Syringe className="h-4 w-4 mr-2" />
                  Apply as Phlebotomist
                </Button>
                <a
                  href="https://wa.me/919123456789?text=Hi%20Metrogram,%20I%20want%20to%20join%20as%20a%20Phlebotomist%20(Phlebo)%20in%20Bihar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-1.5 text-emerald-600" />
                  WhatsApp Recruiter
                </a>
              </div>
            </div>

            {/* PILLAR 2: BUY / OWN A METROGRAM FRANCHISE */}
            <div className="p-8 sm:p-9 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all shadow-md flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                    <Store className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                    Business • Own a Franchise
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Own a Metrogram Franchise
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Open a Diagnostic Booking Hub & Sample Collection Center in your city or locality with high margins and zero equipment risk.
                </p>

                <div className="space-y-3.5 mb-8 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
                    <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                        High Profit Margins (Up to 40%–50%):
                      </strong>
                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                        Earn handsome referral and collection commissions on Pathology, CT Scans, MRI, and Ultrasound.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
                    <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                        Zero Machine Investment:
                      </strong>
                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                        No expensive diagnostic machinery required. Tests processed at centralized NABL-accredited labs.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
                    <Building className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                        Low Space & Rapid Payback (3–6 Months ROI):
                      </strong>
                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                        Requires just 100 to 250 sq.ft commercial space. Fast breakeven supported by Metrogram cardholder footfall.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
                    <Handshake className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                        Full Branding & Software Support:
                      </strong>
                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                        Signage, marketing materials, phlebo staff training, cold-chain logistics, and cloud ERP billing software provided.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  onClick={() => handleOpenPartnerModal("franchise")}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-md shadow-emerald-600/25 cursor-pointer text-xs"
                >
                  <Store className="h-4 w-4 mr-2" />
                  Inquire for Franchise
                </Button>
                <a
                  href="https://wa.me/919123456789?text=Hi%20Metrogram,%20I%20am%20interested%20in%20buying/opening%20a%20Metrogram%20Diagnostic%20Franchise%20in%20Bihar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-1.5 text-emerald-600" />
                  WhatsApp Franchise Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ BLOCK */}
      <section
        id="faqs"
        className="py-20 bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-[#97144D]" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Everything You Need to Know About Metrogram Card
            </h3>
          </div>

          <div className="space-y-3.5">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-[#97144D] dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-[#97144D] shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. CONTACT & APPLICATION DESK */}
      <section id="contact" className="py-20 bg-white dark:bg-[#0B0F19]">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
            {/* Left 5 Columns: Helpline, Hospital Desks, Office */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
                <PhoneCall className="h-3.5 w-3.5" />
                <span>24/7 CARD & DIAGNOSTIC HELPLINE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Speak with a Metrogram Care Manager
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Have questions regarding your Metrogram Membership Card or booking a CT Scan, MRI, Ultrasound, or Pathology test? Our team is available 24x7.
              </p>

              <div className="space-y-3.5">
                {/* 24/7 Helpline */}
                <a
                  href="tel:+919123456789"
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:border-[#97144D]/40 bg-slate-50 dark:bg-slate-900 transition-colors block group"
                >
                  <div className="h-12 w-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#97144D] dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/30 group-hover:scale-105 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">
                      24x7 Diagnostic & Hospital Helpline
                    </div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      +91 91234 56789 / 1800-METRO-CARD
                    </div>
                  </div>
                </a>

                {/* WhatsApp Chat */}
                <a
                  href="https://wa.me/919123456789?text=Hello%20Metrogram,%20I%20want%20to%20apply%20for%20the%20100%20rupees%20membership%20card"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:border-emerald-500/40 bg-slate-50 dark:bg-slate-900 transition-colors block group"
                >
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/30 group-hover:scale-105 transition-transform">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">
                      Direct WhatsApp Card Concierge
                    </div>
                    <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">
                      +91 91234 56789 (Instant Support)
                    </div>
                  </div>
                </a>

                {/* State Office */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4 bg-slate-50 dark:bg-slate-900">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <div className="text-slate-500 font-semibold mb-1">
                      State Command & Head Office
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      Metrogram Healthcare Private Limited
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                      4th Floor, Metro Tower, Exhibition Road, Patna, Bihar — 800001
                    </div>
                    <div className="text-slate-500 mt-1 font-medium">
                      Operational Across 38 Districts of Bihar
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Card Application Form */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Apply for Metrogram Health Card (₹100/yr)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in your details for instant card activation. Your digital QR card will be sent to WhatsApp within 5 minutes.
              </p>

              {isSubmittedSuccess ? (
                <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-emerald-500/30 space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8 stroke-[3]" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    Application Received & Card Dispatched!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Congratulations <strong>{formData.name}</strong>! Your <strong>Metrogram Annual Membership Card (₹100/yr)</strong> has been created. A digital card QR and diagnostic token has been sent to <strong>{formData.phone}</strong>.
                  </p>
                  <Button
                    onClick={handleResetModal}
                    className="bg-[#97144D] text-white font-bold text-xs"
                  >
                    Apply for Another Member
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name of Applicant *
                      </label>
                      <Input
                        placeholder="e.g. Ramesh Chandra Verma"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Mobile Phone Number (WhatsApp) *
                      </label>
                      <Input
                        placeholder="e.g. 9876543210"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        City in Bihar *
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full h-11 px-3 text-sm rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                      >
                        <option value="Patna">Patna</option>
                        <option value="Muzaffarpur">Muzaffarpur</option>
                        <option value="Gaya">Gaya</option>
                        <option value="Bhagalpur">Bhagalpur</option>
                        <option value="Darbhanga">Darbhanga</option>
                        <option value="Begusarai">Begusarai</option>
                        <option value="Purnia">Purnia</option>
                        <option value="Other District">
                          Other District in Bihar
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Selected Card Plan
                      </label>
                      <select
                        value={formData.plan}
                        onChange={(e) =>
                          setFormData({ ...formData, plan: e.target.value })
                        }
                        className="w-full h-11 px-3 text-sm rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                      >
                        <option value="Metrogram Annual Membership Card (₹100/yr)">
                          Metrogram Annual Membership Card (₹100/yr) — 1 Year Validity
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Required Diagnostic Test / Family Details (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Need Blood Specimen Test / CT Scan / MRI appointment or family member details..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full p-3 text-sm rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-[#97144D] hover:bg-[#820d3f] text-white font-bold rounded-xl shadow-md shadow-[#97144D]/25 cursor-pointer text-sm"
                    >
                      {isSubmitting ? (
                        <span>Activating Metrogram Card...</span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Confirm & Receive Digital Card (₹100)
                        </span>
                      )}
                    </Button>
                  </div>

                  <div className="text-center text-[11px] text-slate-500 pt-1">
                    🔒 100% Secure & Regulated. Instant activation on WhatsApp.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-[#1E2229] text-white pt-16 pb-12 border-t border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Col 1 & 2: Brand Story */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-block">
                <img
                  src="/logo.png"
                  alt="Metrogram Health Card"
                  className="h-11 w-auto object-contain brightness-110 drop-shadow-md"
                />
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Metrogram Healthcare Private Limited is Bihar’s premier diagnostic membership network. Providing instant on-counter discounts on Pathology, Radiology (CT Scan, MRI, Ultrasound), and Diagnostic Psychography across 120+ partner centers.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <div>CIN / Reg: U85100BR2021PTC051289</div>
                <div>ISO 9001:2015 Certified Health Diagnostic Network</div>
              </div>
            </div>

            {/* Col 3: Card Membership */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Card Membership
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a
                    href="#plans"
                    className="hover:text-white transition-colors"
                  >
                    Annual Card (₹100/yr)
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works (3 Steps)
                  </a>
                </li>
                <li>
                  <a
                    href="#hospitals"
                    className="hover:text-white transition-colors"
                  >
                    120+ Empanelled Hubs
                  </a>
                </li>
                <li>
                  <a
                    href="#faqs"
                    className="hover:text-white transition-colors"
                  >
                    Membership FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Core Services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Diagnostic Services
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Metrogram Pathology
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Blood Specimen Collection
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    CT Scan Diagnostics
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    MRI Diagnostic Imaging
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Ultrasound & Doppler
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Diagnostic Psychography
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 5: Careers & Franchise Opportunities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Careers & Franchise
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenPartnerModal("phlebo")}
                    className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>Join as a Phlebotomist</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-rose-900/60 text-rose-300 font-bold">Hiring</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenPartnerModal("franchise")}
                    className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>Own a Metrogram Franchise</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-900/60 text-emerald-300 font-bold">High ROI</span>
                  </button>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="hover:text-white transition-colors"
                  >
                    Phlebo Earnings & Kit
                  </a>
                </li>
                <li>
                  <a
                    href="#franchise"
                    className="hover:text-white transition-colors"
                  >
                    Franchise Setup & Margins
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/919123456789?text=Hi%20Metrogram,%20I%20want%20to%20know%20about%20Career%20and%20Franchise%20options."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-300 transition-colors flex items-center gap-1 text-emerald-400 font-semibold"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>WhatsApp Partner Desk</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 6: 24/7 Helpline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Diagnostic Helpdesk
              </h4>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-rose-400 font-bold text-sm">
                    +91 91234 56789
                  </div>
                  <div className="text-[10px] text-slate-400">
                    24/7 Diagnostic & Partner Helpline
                  </div>
                </div>
                <div>
                  <div className="text-white font-semibold">
                    Email Enquiries:
                  </div>
                  <a
                    href="mailto:care@metrogram.in"
                    className="hover:underline text-rose-300"
                  >
                    care@metrogram.in
                  </a>
                </div>
                <div>
                  <div className="text-white font-semibold">Head Office:</div>
                  <div>Exhibition Road, Patna, Bihar — 800001</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} Metrogram Healthcare Private
              Limited. All Rights Reserved.
            </div>
            <div className="flex gap-6">
              <span className="hover:text-slate-400 cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-slate-400 cursor-pointer">
                Card Terms of Use
              </span>
              <span className="hover:text-slate-400 cursor-pointer">
                Diagnostic Tariff Charter
              </span>
              <span
                onClick={() => handleOpenPartnerModal("franchise")}
                className="hover:text-rose-400 cursor-pointer text-slate-400"
              >
                Franchise Partner Terms
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 14. MOBILE STICKY QUICK ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-2.5 px-4 md:hidden shadow-2xl flex items-center justify-between gap-2">
        <a
          href="tel:+919123456789"
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform"
        >
          <Phone className="h-3.5 w-3.5 text-[#97144D]" />
          <span>Call 24/7</span>
        </a>

        <a
          href="https://wa.me/919123456789?text=Hello%20Metrogram,%20I%20want%20to%20apply%20for%20the%20100%20rupees%20Metrogram%20Health%20Card"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-700 active:scale-95 transition-transform"
        >
          <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
          <span>WhatsApp</span>
        </a>

        <Button
          size="sm"
          onClick={() => handleOpenApplyModal()}
          className="flex-1 h-10 bg-[#97144D] hover:bg-[#820d3f] text-white font-bold text-xs rounded-lg shadow-md shadow-[#97144D]/30 active:scale-95 transition-transform cursor-pointer"
        >
          <CreditCard className="h-3.5 w-3.5 mr-1" />
          <span>Get Card (₹100)</span>
        </Button>
      </div>

      {/* 15. MODAL: CARD APPLICATION & ELIGIBILITY DIALOG */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-[#97144D] text-white flex items-center justify-center font-bold">
                <CreditCard className="h-4 w-4" />
              </div>
              <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
                Apply for Metrogram Health Card
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Metrogram Annual Membership Card (₹100/year) — 1 Year (365 Days) Complete Validity.
            </DialogDescription>
          </DialogHeader>

          {isSubmittedSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="h-14 w-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-7 w-7 stroke-[3]" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Card Application Activated!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Your digital Metrogram Card QR code has been dispatched to{" "}
                <strong>{formData.phone}</strong> on WhatsApp. You can
                immediately show it at any partner diagnostic center.
              </p>
              <Button
                onClick={handleResetModal}
                className="bg-[#97144D] text-white font-bold text-xs mt-2"
              >
                Close Window
              </Button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-3.5 mt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name of Primary Applicant *
                </label>
                <Input
                  placeholder="e.g. Ramesh Chandra Verma"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <Input
                    placeholder="e.g. 9876543210"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City in Bihar
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Membership Plan
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) =>
                    setFormData({ ...formData, plan: e.target.value })
                  }
                  className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                >
                  <option value="Metrogram Annual Membership Card (₹100/yr)">
                    Metrogram Annual Membership Card (₹100/yr) — 1 Year Validity
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Address & Diagnostic Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Near Boring Canal Road, Patna. Diagnostic request details..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full p-2.5 text-xs rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#97144D] hover:bg-[#820d3f] text-white font-bold rounded-lg cursor-pointer text-xs shadow-md shadow-[#97144D]/25"
                >
                  {isSubmitting ? (
                    <span>Activating Card...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="h-3.5 w-3.5" />
                      Activate Card for ₹100 on WhatsApp
                    </span>
                  )}
                </Button>
              </div>

              <div className="text-center text-[10px] text-slate-400">
                Zero waiting period. Instant card coverage starts from the moment of activation.
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 16. MODAL: CAREERS (PHLEBO) & FRANCHISE PARTNERSHIP DIALOG */}
      <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
        <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {/* Tab Selector in Modal Header */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => {
                  setPartnerModalType("phlebo");
                  setPartnerFormData((p) => ({ ...p, roleType: "phlebo" }));
                  setIsPartnerSuccess(false);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  partnerModalType === "phlebo"
                    ? "bg-[#97144D] text-white shadow-sm shadow-[#97144D]/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Syringe className="h-3.5 w-3.5" />
                <span>Join as a Phlebo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPartnerModalType("franchise");
                  setPartnerFormData((p) => ({ ...p, roleType: "franchise" }));
                  setIsPartnerSuccess(false);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  partnerModalType === "franchise"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Store className="h-3.5 w-3.5" />
                <span>Own a Franchise</span>
              </button>
            </div>

            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
              {partnerModalType === "phlebo"
                ? "Join Metrogram as a Certified Phlebotomist"
                : "Own a Metrogram Diagnostic Collection Franchise"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {partnerModalType === "phlebo"
                ? "Earn high per-sample fees, get standard phlebotomy kits, flexible home visit shifts, and performance bonuses."
                : "Start a high-margin diagnostic collection center with zero equipment cost and full NABL lab network support."}
            </DialogDescription>
          </DialogHeader>

          {isPartnerSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                {partnerFormData.roleType === "phlebo"
                  ? "Phlebotomist Application Submitted!"
                  : "Franchise Partnership Request Received!"}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you <strong>{partnerFormData.name}</strong>! Our{" "}
                {partnerFormData.roleType === "phlebo"
                  ? "Phlebotomy Operations & Recruitment Team"
                  : "State Franchise Expansion Manager"}{" "}
                has received your details and will connect with you on{" "}
                <strong>{partnerFormData.phone}</strong> via Call / WhatsApp.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 text-center">
                📍 Location: <strong>{partnerFormData.city}, Bihar</strong> | Status: <strong>Under Fast-Track Review</strong>
              </div>
              <Button
                onClick={handleResetPartnerModal}
                className="bg-[#97144D] text-white font-bold text-xs mt-2"
              >
                Close Window
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-3.5 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <Input
                    placeholder="e.g. Anand Kumar"
                    value={partnerFormData.name}
                    onChange={(e) =>
                      setPartnerFormData({ ...partnerFormData, name: e.target.value })
                    }
                    required
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone (WhatsApp) *
                  </label>
                  <Input
                    placeholder="e.g. 9876543210"
                    type="tel"
                    value={partnerFormData.phone}
                    onChange={(e) =>
                      setPartnerFormData({ ...partnerFormData, phone: e.target.value })
                    }
                    required
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City / District in Bihar *
                  </label>
                  <select
                    value={partnerFormData.city}
                    onChange={(e) =>
                      setPartnerFormData({ ...partnerFormData, city: e.target.value })
                    }
                    className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                  >
                    <option value="Patna">Patna</option>
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Gaya">Gaya</option>
                    <option value="Bhagalpur">Bhagalpur</option>
                    <option value="Darbhanga">Darbhanga</option>
                    <option value="Begusarai">Begusarai</option>
                    <option value="Purnia">Purnia</option>
                    <option value="Ara / Bhojpur">Ara / Bhojpur</option>
                    <option value="Samastipur">Samastipur</option>
                    <option value="Other District">Other District in Bihar</option>
                  </select>
                </div>

                {partnerModalType === "phlebo" ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Professional Qualification *
                    </label>
                    <select
                      value={partnerFormData.qualification}
                      onChange={(e) =>
                        setPartnerFormData({ ...partnerFormData, qualification: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                    >
                      <option value="DMLT / BMLT">DMLT / BMLT (Medical Lab Tech)</option>
                      <option value="GNM / BSC Nursing">GNM / BSC Nursing</option>
                      <option value="Certified Phlebotomist">Certified Phlebotomy Technician</option>
                      <option value="Experienced Healthcare Professional">12th/Graduate with Phlebotomy Exp</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Commercial Space Available *
                    </label>
                    <select
                      value={partnerFormData.spaceAvailable}
                      onChange={(e) =>
                        setPartnerFormData({ ...partnerFormData, spaceAvailable: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="100 - 250 sq.ft (Ideal)">100 - 250 sq.ft (Ideal Collection Center)</option>
                      <option value="250 - 500 sq.ft">250 - 500 sq.ft</option>
                      <option value="500+ sq.ft">500+ sq.ft (Diagnostic Hub)</option>
                      <option value="Planning to Rent Commercial Space">Planning to Rent Space</option>
                    </select>
                  </div>
                )}
              </div>

              {partnerModalType === "phlebo" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Blood Collection Experience
                    </label>
                    <select
                      value={partnerFormData.experience}
                      onChange={(e) =>
                        setPartnerFormData({ ...partnerFormData, experience: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                    >
                      <option value="Fresher (< 1 Year)">Fresher (&lt; 1 Year)</option>
                      <option value="1 - 3 Years">1 - 3 Years Experience</option>
                      <option value="3 - 5 Years">3 - 5 Years Experience</option>
                      <option value="5+ Years">5+ Years Senior Phlebo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Two-Wheeler (Bike / Scooter)
                    </label>
                    <select
                      value={partnerFormData.hasBike}
                      onChange={(e) =>
                        setPartnerFormData({ ...partnerFormData, hasBike: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                    >
                      <option value="Yes">Yes (Have Bike & Driving License)</option>
                      <option value="No">No (Will Arrange Soon)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Current Profession / Background
                    </label>
                    <select
                      value={partnerFormData.currentBusiness}
                      onChange={(e) =>
                        setPartnerFormData({ ...partnerFormData, currentBusiness: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="Pharmacy / Medical Store">Chemist / Pharmacy Owner</option>
                      <option value="Doctor Clinic / Nursing Home">Doctor Clinic / Hospital</option>
                      <option value="Pathology Technician / Lab">Pathology Lab Operator</option>
                      <option value="New Entrepreneur">New Healthcare Entrepreneur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Planned Investment Budget
                    </label>
                    <select
                      value={partnerFormData.investmentBudget}
                      onChange={(e) =>
                        setPartnerFormData({ ...partnerFormData, investmentBudget: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="₹50,000 - ₹1 Lakh">₹50,000 - ₹1 Lakh</option>
                      <option value="₹1 Lakh - ₹3 Lakhs">₹1 Lakh - ₹3 Lakhs (Recommended)</option>
                      <option value="₹3 Lakhs - ₹5 Lakhs">₹3 Lakhs - ₹5 Lakhs</option>
                      <option value="₹5 Lakhs+">₹5 Lakhs+ (Master Territory)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {partnerModalType === "phlebo"
                    ? "Previous Experience / Locality You Can Cover (Optional)"
                    : "Proposed Shop Location / Business Vision (Optional)"}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    partnerModalType === "phlebo"
                      ? "e.g. 2 years experience in home blood collection in Kankarbagh & Boring Road..."
                      : "e.g. Shop located on Main Road near District Hospital. Looking to start in 30 days..."
                  }
                  value={partnerFormData.message}
                  onChange={(e) =>
                    setPartnerFormData({ ...partnerFormData, message: e.target.value })
                  }
                  className="w-full p-2.5 text-xs rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isPartnerSubmitting}
                  className={`w-full h-11 text-white font-bold rounded-lg cursor-pointer text-xs shadow-md ${
                    partnerModalType === "phlebo"
                      ? "bg-[#97144D] hover:bg-[#820d3f] shadow-[#97144D]/25"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
                  }`}
                >
                  {isPartnerSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : partnerModalType === "phlebo" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Syringe className="h-3.5 w-3.5" />
                      Submit Phlebotomist Application
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Store className="h-3.5 w-3.5" />
                      Submit Franchise Partnership Inquiry
                    </span>
                  )}
                </Button>
              </div>

              <div className="text-center text-[10px] text-slate-400">
                🔒 Direct verification by Metrogram Headquarters. Fast-track callback within 24 business hours.
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
