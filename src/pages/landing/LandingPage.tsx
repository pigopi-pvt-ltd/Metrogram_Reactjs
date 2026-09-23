import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ShieldCheck,
  Stethoscope,
  Activity,
  CreditCard,
  Building2,
  Users,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Calculator,
  Search,
  MapPin,
  Clock,
  Award,
  BadgePercent,
  Pill,
  Heart,
  UserCheck,
  Check,
  HelpCircle,
  Phone,
  Mail,
  Send,
  Calendar,
  AlertCircle,
  Syringe,
  Ambulance,
  HeartPulse,
  Microscope,
  FileText,
  MessageSquare,
  Shield,
  ThumbsUp,
  MapPinned,
  ExternalLink,
  QrCode,
  Zap,
  CheckCircle,
  XCircle,
  Percent,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';

// ==========================================
// 1. DATA MODELS & CONSTANTS
// ==========================================

// Hero Slider Background Images (Rotating every 5s)
const HERO_BACKGROUND_IMAGES = [
  { id: 0, image: '/hero-medical.jpg', alt: 'Metrogram Health Card at Hospital Billing Counter' },
  { id: 1, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&auto=format&fit=crop&q=85', alt: 'Elderly and Family Hospital Care Coverage' },
  { id: 2, image: 'https://images.unsplash.com/photo-1587745416684-47b8838280f9?w=1920&auto=format&fit=crop&q=85', alt: 'Cashless Emergency Ambulance & ICU Coverage' },
  { id: 3, image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&auto=format&fit=crop&q=85', alt: '50% Discount on NABL Lab Diagnostics' },
  { id: 4, image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&auto=format&fit=crop&q=85', alt: 'Surgeries Covered Across Partner Hospitals in Bihar' },
];

// Card Membership Plans
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
    id: 'plan-silver',
    name: 'Metrogram Silver Card',
    tier: 'Individual Care',
    price: 499,
    regularPrice: 1499,
    validity: '1 Year (365 Days)',
    membersCount: '1 Individual',
    colorScheme: {
      badgeBg: 'bg-slate-200 dark:bg-slate-800',
      badgeText: 'text-slate-800 dark:text-slate-200',
      border: 'border-slate-300 dark:border-slate-700',
      gradient: 'from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800',
    },
    surgeryCoverage: 'Up to 40% Covered',
    icuCoverage: '30% Bed Subsidy',
    opdLabDiscount: 'Flat 40% OFF',
    features: [
      'Coverage for 1 Primary Cardholder',
      'Up to 40% direct bill deduction on planned surgeries',
      'Flat 40% discount on NABL blood tests & ECG/X-Ray',
      '2 Free Doctor Teleconsultation Vouchers',
      'Instant Digital QR Card on WhatsApp',
      'No waiting period for accidental emergencies',
    ],
  },
  {
    id: 'plan-gold',
    name: 'Metrogram Gold Family Shield',
    tier: 'Family Complete (Most Popular)',
    price: 999,
    regularPrice: 2999,
    validity: '1 Year (365 Days)',
    membersCount: '4 Family Members',
    popular: true,
    badge: 'MOST CHOSEN BY BIHAR FAMILIES',
    colorScheme: {
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
      badgeText: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-400 dark:border-amber-500/60',
      gradient: 'from-amber-50 to-rose-50 dark:from-slate-900 dark:to-rose-950/30',
    },
    surgeryCoverage: 'Up to 60% Covered',
    icuCoverage: '50% Bed & Room Rent',
    opdLabDiscount: 'Flat 50% OFF',
    features: [
      'Covers 4 Family Members (Self, Spouse, 2 Children or Parents)',
      'Up to 60% of surgery bill covered at 120+ partner hospitals',
      'Pre-existing conditions & Diabetes/BP covered from Day 1',
      '50% coverage on ICU, HDU & Deluxe room rent charges',
      'Flat 50% OFF on all Pathology, CT Scan & MRI scans',
      'Physical Smart Card delivered + Digital QR Card instant',
      '24/7 Priority Hospital Admission Assistance Desk',
    ],
  },
  {
    id: 'plan-platinum',
    name: 'Metrogram Platinum Super Shield',
    tier: 'All-Inclusive Extended Family',
    price: 1999,
    regularPrice: 4999,
    validity: '1 Year (365 Days)',
    membersCount: 'Up to 6 Members',
    badge: 'MAXIMUM COVERAGE & SENIOR CARE',
    colorScheme: {
      badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
      badgeText: 'text-purple-800 dark:text-purple-300',
      border: 'border-purple-300 dark:border-purple-700',
      gradient: 'from-purple-50 to-slate-100 dark:from-slate-900 dark:to-purple-950/30',
    },
    surgeryCoverage: 'Up to 75% Covered',
    icuCoverage: '60% ICU & OT Covered',
    opdLabDiscount: 'Flat 60% OFF',
    features: [
      'Covers up to 6 Members (Includes Parents & In-laws, No Age Cap)',
      'Up to 75% coverage on major surgeries & hospital stays',
      '60% coverage on ICU bed, ventilator, and OT surgeon fees',
      'Free Annual Full Body Health Package (worth ₹3,500)',
      'Dedicated Personal Hospital Care Manager stationed at desk',
      'Emergency Cashless ACLS Ambulance dispatch assistance',
      'Zero-wait admission escort at all partner network hospitals',
    ],
  },
];

// Interactive Hospital Savings Calculator Data
interface ProcedureSaving {
  id: string;
  procedure: string;
  category: string;
  marketBill: number;
  metrogramCardBill: number;
  savingsAmount: number;
  coveragePercent: number;
}

const PROCEDURE_SAVINGS: ProcedureSaving[] = [
  {
    id: 'proc-delivery-normal',
    procedure: 'Normal Maternity Delivery & Hospitalization',
    category: 'Maternity',
    marketBill: 35000,
    metrogramCardBill: 12000,
    savingsAmount: 23000,
    coveragePercent: 65,
  },
  {
    id: 'proc-delivery-csec',
    procedure: 'Caesarean (C-Section) Delivery + 4-Day Stay',
    category: 'Maternity',
    marketBill: 65000,
    metrogramCardBill: 24000,
    savingsAmount: 41000,
    coveragePercent: 63,
  },
  {
    id: 'proc-gallbladder',
    procedure: 'Laparoscopic Gallbladder Stone Surgery',
    category: 'General Surgery',
    marketBill: 55000,
    metrogramCardBill: 19999,
    savingsAmount: 35001,
    coveragePercent: 64,
  },
  {
    id: 'proc-appendix',
    procedure: 'Laparoscopic Appendectomy (Appendix Removal)',
    category: 'General Surgery',
    marketBill: 45000,
    metrogramCardBill: 16500,
    savingsAmount: 28500,
    coveragePercent: 63,
  },
  {
    id: 'proc-kidney-stone',
    procedure: 'Laser PCNL / URSL Kidney Stone Removal',
    category: 'Urology',
    marketBill: 50000,
    metrogramCardBill: 18000,
    savingsAmount: 32000,
    coveragePercent: 64,
  },
  {
    id: 'proc-knee-replace',
    procedure: 'Total Knee Replacement Surgery (Single Knee)',
    category: 'Orthopedics',
    marketBill: 160000,
    metrogramCardBill: 65000,
    savingsAmount: 95000,
    coveragePercent: 60,
  },
  {
    id: 'proc-cardiac-stent',
    procedure: 'Coronary Angiography + 1 Drug-Eluting Stent',
    category: 'Cardiology',
    marketBill: 130000,
    metrogramCardBill: 55000,
    savingsAmount: 75000,
    coveragePercent: 58,
  },
  {
    id: 'proc-icu-5days',
    procedure: '5-Day Critical ICU Stay + Monitor & Ventilator',
    category: 'Critical Care',
    marketBill: 75000,
    metrogramCardBill: 28000,
    savingsAmount: 47000,
    coveragePercent: 62,
  },
  {
    id: 'proc-cataract-eye',
    procedure: 'Cataract Eye Surgery with Foldable Phaco Lens',
    category: 'Ophthalmology',
    marketBill: 25000,
    metrogramCardBill: 8500,
    savingsAmount: 16500,
    coveragePercent: 66,
  },
  {
    id: 'proc-mri-scan',
    procedure: 'MRI Brain / Spine Contrast Scan',
    category: 'Diagnostics',
    marketBill: 7500,
    metrogramCardBill: 2800,
    savingsAmount: 4700,
    coveragePercent: 63,
  },
];

// Covered Medical Categories
const COVERED_CATEGORIES = [
  {
    title: 'Surgeries & Operations',
    discount: 'Up to 60%–75% Covered',
    icon: Activity,
    examples: 'Gallbladder, Appendix, Hernia, Piles, Hydrocele, C-Section, Knee, Kidney Stone',
  },
  {
    title: 'ICU & Hospital Room Rent',
    discount: '50%–60% Bed Subsidy',
    icon: Building2,
    examples: 'ICU, CCU, HDU, Deluxe Rooms, General Wards across 120+ empanelled hospitals',
  },
  {
    title: 'NABL Labs & Diagnostics',
    discount: 'Flat 50% OFF',
    icon: Microscope,
    examples: 'MRI, CT Scan, Ultrasound, Digital X-Ray, Full Body 68 Tests, Blood Profiles',
  },
  {
    title: 'Doctor OPD Consultations',
    discount: 'Flat 50% OFF + Free Vouchers',
    icon: Stethoscope,
    examples: 'Physicians, Cardiologists, Gynecologists, Orthopedic & Pediatric specialists',
  },
  {
    title: 'Medicines & Pharmacy',
    discount: '15%–30% On Hospital Medicines',
    icon: Pill,
    examples: 'Direct discount on in-patient pharmacy bills and regular chronic medications',
  },
  {
    title: 'Emergency ICU Ambulance',
    discount: 'Subsidy & Rapid Dispatch',
    icon: Ambulance,
    examples: 'ACLS ventilators & oxygen ambulances with GPS priority hospital escort',
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
    name: 'Metrogram Heart & Multispecialty Hospital',
    city: 'Patna',
    type: 'Super Specialty Network Hospital',
    beds: '150 Beds (35 ICU)',
    specialties: ['Cardiology', 'Orthopedics', 'Laparoscopy', 'ICU Care'],
    address: 'Bailey Road / Exhibition Road Hub, Patna',
    rating: '4.9 ★',
  },
  {
    name: 'Paras HMRI Empanelled Care Wing',
    city: 'Patna',
    type: 'Empanelled Tier-1 Partner',
    beds: '350 Beds (80 ICU)',
    specialties: ['Neurosurgery', 'Cardiac Care', 'Oncology', 'Organ Care'],
    address: 'Raja Bazar, Bailey Road, Patna',
    rating: '4.8 ★',
  },
  {
    name: 'Mithila Metro Multi-Care Hospital',
    city: 'Muzaffarpur',
    type: 'Regional Super Specialty',
    beds: '120 Beds (25 ICU)',
    specialties: ['Maternity & Gynaec', 'General Surgery', 'Trauma & Ortho'],
    address: 'Club Road, Mithanpura, Muzaffarpur',
    rating: '4.9 ★',
  },
  {
    name: 'Magadh Metrogram Advanced Hospital',
    city: 'Gaya',
    type: 'Empanelled Network Hub',
    beds: '90 Beds (18 ICU)',
    specialties: ['General Surgery', 'Urology', 'Internal Medicine', 'Dialysis'],
    address: 'Station Road, AP Colony, Gaya',
    rating: '4.8 ★',
  },
  {
    name: 'Anga Metrogram Surgical Center',
    city: 'Bhagalpur',
    type: 'Surgical & Maternity Hub',
    beds: '80 Beds (15 ICU)',
    specialties: ['Laparoscopic Surgery', 'Normal/C-Sec Delivery', 'Pediatrics'],
    address: 'Tilkamanjhi Zero Mile, Bhagalpur',
    rating: '4.8 ★',
  },
  {
    name: 'Darbhanga Metro Health City',
    city: 'Darbhanga',
    type: 'Mithilanchal Referral Hospital',
    beds: '110 Beds (20 ICU)',
    specialties: ['Orthopedic Spine', 'Cardiac ICU', 'Urology Stones', 'Dialysis'],
    address: 'Laheriasarai Main Road, Darbhanga',
    rating: '4.9 ★',
  },
  {
    name: 'Kosi-Seemanchal Metro Hospital',
    city: 'Purnia',
    type: 'Regional Partner Hospital',
    beds: '75 Beds (12 ICU)',
    specialties: ['Critical Care', 'General Surgery', 'Maternity Care'],
    address: 'Line Bazar Medical Hub, Purnia',
    rating: '4.7 ★',
  },
  {
    name: 'Begusarai Metro Specialty Hospital',
    city: 'Begusarai',
    type: 'Industrial Hub Partner Hospital',
    beds: '65 Beds (10 ICU)',
    specialties: ['Trauma Care', 'Laparoscopy', 'ICU Medicine'],
    address: 'Harhar Mahadev Chowk, Begusarai',
    rating: '4.8 ★',
  },
];

// Direct Comparison Matrix: Metrogram Card vs Health Insurance vs Ayushman Card
const COMPARISON_ROWS = [
  {
    feature: 'Pre-Existing Diseases (BP, Sugar, Thyroid)',
    metrogramCard: 'Covered from Day 1 (No Waiting)',
    insurance: '2 to 4 Years Waiting Period',
    ayushman: 'Covered only if BPL/SECC listed',
  },
  {
    feature: 'Age Limit & Senior Citizen Entry',
    metrogramCard: 'No Age Cap (Elderly 60–90+ covered)',
    insurance: 'High premiums or medical rejection',
    ayushman: 'Requires government list eligibility',
  },
  {
    feature: 'Claim Process & Paperwork',
    metrogramCard: 'Instant On-Counter Deduction (Zero Claims)',
    insurance: 'Lengthy 30–60 day paperwork & rejections',
    ayushman: 'Biometric card validation required',
  },
  {
    feature: 'Annual Membership Cost for 4 Members',
    metrogramCard: 'Just ₹999 / year (Fixed)',
    insurance: '₹22,000 – ₹45,000+ / year',
    ayushman: 'Free (Govt. sponsored for eligible BPL)',
  },
  {
    feature: 'OPD Doctor Consultations & Diagnostics',
    metrogramCard: 'Flat 50% OFF across all tests & OPD',
    insurance: 'Rarely covered (Only IPD hospital stay)',
    ayushman: 'Limited to hospital admission only',
  },
  {
    feature: 'Rejection Rate at Hospital Counter',
    metrogramCard: '0% Rejection at 120+ Partner Hospitals',
    insurance: '15%–30% claims disputed or cut',
    ayushman: 'Subject to hospital package quotas',
  },
];

// Leadership & Advisory Team
const LEADERSHIP_TEAM = [
  {
    name: 'Dr. Anand Kishore Sinha, MD',
    role: 'Chief Medical Officer & Co-Founder',
    qualification: 'MD (Internal Medicine) • Ex-Senior Consultant AIIMS & PMCH',
    bio: 'Over 22 years of clinical leadership in Bihar. Architect of Metrogram’s hospital empanelment quality benchmarks and transparent tariff standards.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Prashant Verma',
    role: 'Managing Director & Promoter',
    qualification: 'B.Tech (IIT), MBA • Healthcare Financing Pioneer',
    bio: '14+ years scaling healthcare access for middle-class and rural families. Leading Metrogram’s mission to make quality private hospital care affordable for all.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Meenakshi Kumari, MS',
    role: 'Head of Hospital Empanelment & Surgical Quality',
    qualification: 'MS (General Surgery), Fellowship in Critical Care',
    bio: 'Oversees surgical audit, on-counter discount compliance, and 24/7 patient bedside advocacy across our 120+ empanelled hospital partners in Bihar.',
    image: 'https://images.unsplash.com/photo-1594824813515-99d98cf77f48?w=300&auto=format&fit=crop&q=80',
  },
];

// Metrogram Card FAQs
const FAQ_ITEMS = [
  {
    q: 'What is the Metrogram Health Card and how does it work at hospitals?',
    a: 'Metrogram is a dedicated Healthcare Membership Card (similar to the Ayushman Card for private hospitals). When you or any covered family member visits an empanelled hospital for surgery, hospitalization, ICU, or OPD/lab tests, you simply show your Metrogram Card QR code at the billing counter. The hospital automatically covers/discounts up to 50% to 75% of your bill directly on the spot.',
  },
  {
    q: 'Do I have to file insurance claim reimbursement forms after hospital discharge?',
    a: 'No! There is zero reimbursement paperwork or claim filing. Your bill discount is applied directly on the hospital invoice before payment. You only pay the nominal discounted remainder. There are no claim surveyors, medical file submissions, or rejection risks.',
  },
  {
    q: 'Are pre-existing diseases and senior citizens covered?',
    a: 'Yes, 100%! Unlike commercial health insurance that imposes 2–4 years waiting periods, Metrogram Card covers pre-existing conditions (such as Diabetes, Hypertension, Cardiac ailments, Kidney stones, and Hernias) from Day 1 of card activation. There is also no age limit — elderly parents aged 60–90+ are warmly covered.',
  },
  {
    q: 'How many family members are covered under one Metrogram Card?',
    a: 'Our Gold Family Card (₹999/yr) covers up to 4 members (Self, Spouse, and 2 Children or Parents). Our Platinum Super Shield (₹1,999/yr) covers up to 6 members, including elderly in-laws. You receive one primary physical card plus instant digital QR cards for every family member on WhatsApp.',
  },
  {
    q: 'Which private hospitals and cities in Bihar accept the Metrogram Card?',
    a: 'The Metrogram Card is actively accepted across 120+ empanelled multi-specialty hospitals, nursing homes, and NABL diagnostic centers in Patna, Muzaffarpur, Gaya, Bhagalpur, Darbhanga, Begusarai, Purnia, Chapra, Ara, and expanding districts.',
  },
  {
    q: 'What should I do during an emergency hospital admission?',
    a: 'During any emergency, call our 24x7 Hospital Helpline (+91 91234 56789). Our Care Coordinator will immediately inform the nearest empanelled hospital, pre-authorize your admission under the Metrogram Card quota, and ensure priority zero-wait bed allotment and on-counter bill coverage.',
  },
];

export const LandingPage: React.FC = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // Hero Background Image Slider (5-second auto transition)
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Savings Calculator State
  const [selectedCalcProcedure, setSelectedCalcProcedure] = useState<ProcedureSaving>(
    PROCEDURE_SAVINGS[0]
  );

  // Filter for Empanelled Hospitals by City
  const [selectedHospitalCity, setSelectedHospitalCity] = useState('ALL');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Card Application / Enquiry Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<CardPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Patna',
    plan: 'Metrogram Gold Family Shield (₹999/yr)',
    familyMembers: '4 Members (Self, Spouse, 2 Kids/Parents)',
    message: '',
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
    }
    setIsSubmittedSuccess(false);
    setIsApplyModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please enter your full name and contact phone number.');
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please provide a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      toast.success('Metrogram Card Application received! Instant Digital Card dispatched to WhatsApp.');
    }, 800);
  };

  const handleResetModal = () => {
    setIsSubmittedSuccess(false);
    setIsApplyModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      city: 'Patna',
      plan: 'Metrogram Gold Family Shield (₹999/yr)',
      familyMembers: '4 Members (Self, Spouse, 2 Kids/Parents)',
      message: '',
    });
  };

  const filteredHospitals = EMPANELLED_HOSPITALS.filter(
    (h) => selectedHospitalCity === 'ALL' || h.city.toLowerCase() === selectedHospitalCity.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] text-[#1E293B] dark:text-[#F1F5F9] font-sans antialiased selection:bg-[#97144D] selection:text-white pb-16 md:pb-0">
      
      {/* 1. TOP ANNOUNCEMENT & 24/7 HOSPITAL HELPLINE BAR (Axis Burgundy Theme) */}
      <div className="bg-[#97144D] text-white text-xs py-2 px-4 sm:px-6 lg:px-10 xl:px-16 border-b border-[#820d3f] sticky top-0 z-50">
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold tracking-wide">
              METROGRAM HEALTH CARD • BIHAR'S #1 CASHLESS HOSPITAL BILL COVERAGE NETWORK
            </span>
            <span className="hidden lg:inline-block text-white/70">|</span>
            <span className="hidden lg:inline-block text-rose-100">
              Accepted at 120+ Top Private Hospitals Across Bihar
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+919123456789"
              className="flex items-center gap-1.5 font-bold hover:text-rose-200 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5 animate-bounce" />
              <span>24/7 Admission Helpline: +91 91234 56789</span>
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
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="h-12 w-12 rounded-xl bg-[#97144D] flex items-center justify-center text-white shadow-md shadow-[#97144D]/25 group-hover:scale-105 transition-transform">
              <CreditCard className="h-7 w-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#97144D] dark:text-rose-400">
                  METROGRAM
                </span>
                <span className="bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded-sm border border-[#97144D]/20">
                  HEALTH CARD
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                Show at Hospital & Get Most of Your Bill Covered
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors">
              How Card Works
            </a>
            <a href="#plans" className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors">
              Card Plans & Pricing
            </a>
            <a href="#calculator" className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors">
              Savings Calculator
            </a>
            <a href="#coverage" className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors">
              Covered Treatments
            </a>
            <a href="#hospitals" className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors">
              120+ Hospitals
            </a>
            <a href="#comparison" className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors">
              Card vs Insurance
            </a>
            <a href="#faqs" className="hover:text-[#97144D] dark:hover:text-rose-400 transition-colors">
              FAQs
            </a>
          </nav>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="rounded-full h-9 w-9 text-slate-600 dark:text-slate-300 hover:text-[#97144D]"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Portal Login */}
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(role === 'CUSTOMER' ? '/customer/home' : '/dashboard')
                }
                className="hidden sm:inline-flex gap-2 border-slate-300 dark:border-slate-700 font-semibold"
              >
                <UserCheck className="h-4 w-4 text-[#97144D]" />
                <span>{role === 'CUSTOMER' ? 'Cardholder Portal' : 'Hospital Desk'}</span>
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
              <span>Apply for Card</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION — MINIMAL, FULL-VISIBILITY BACKGROUND SLIDER */}
      <section className="relative min-h-[85vh] lg:min-h-[82vh] flex items-center justify-center overflow-hidden">
        {/* FULL BACKGROUND IMAGES WITH SMOOTH 5s SLIDER TRANSITIONS */}
        {HERO_BACKGROUND_IMAGES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform ${
              index === currentSlide
                ? 'opacity-100 scale-100 z-0'
                : 'opacity-0 scale-105 pointer-events-none -z-10'
            }`}
            style={{
              backgroundImage: `url('${slide.image}')`,
            }}
            aria-label={slide.alt}
          />
        ))}

        {/* ULTRA-LIGHT SUBTLE SCRIM SO BACKGROUND IMAGES REMAIN 100% VISIBLE & VIVID */}
        <div className="absolute inset-0 bg-black/15 dark:bg-black/35 z-1 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAFAFA] dark:from-[#0B0F19] via-transparent to-transparent z-1 pointer-events-none" />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#97144D]/10 dark:bg-[#97144D]/20 rounded-full blur-3xl pointer-events-none z-1" />

        {/* MINIMAL, CENTERED HERO CONTENT */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 text-[#97144D] dark:text-rose-200 text-xs font-bold tracking-wide shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[#97144D] dark:text-rose-300" />
              <span>BIHAR’S #1 HEALTH MEMBERSHIP CARD</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-300 font-extrabold">Like Ayushman Card for Private Hospitals</span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.14]">
              Show Your Metrogram Card & Get{' '}
              <span className="text-[#97144D] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-rose-300 dark:via-rose-200 dark:to-amber-200 underline decoration-[#97144D]/40 dark:decoration-[#97144D]/80 decoration-4">
                Up to 75% of Hospital Bills Covered
              </span>
            </h1>

            {/* Crisp 1-Line Description */}
            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-xs">
              Instant on-counter bill discounts on planned surgeries, ICU admissions, and diagnostics at 120+ top private hospitals in Bihar. Zero waiting period & pre-existing diseases covered from Day 1.
            </p>

            {/* Clean CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => handleOpenApplyModal()}
                className="w-full sm:w-auto h-13 px-8 text-base bg-[#97144D] hover:bg-[#820d3f] text-white font-bold rounded-2xl shadow-xl shadow-[#97144D]/30 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                <span>Get Health Card (From ₹499/yr)</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <a
                href="#plans"
                className="w-full sm:w-auto h-13 px-7 inline-flex items-center justify-center bg-white/90 hover:bg-white text-slate-900 border border-slate-200 dark:bg-slate-900/85 dark:hover:bg-slate-800 dark:text-white dark:border-white/20 rounded-2xl font-bold backdrop-blur-md transition-all text-sm cursor-pointer shadow-sm"
              >
                <Calculator className="h-4 w-4 mr-2 text-[#97144D] dark:text-rose-300" />
                <span>View Plans & Hospital Savings</span>
              </a>
            </div>

            {/* Floating Minimal Trust Chips */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>120+ Empanelled Hospitals</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Day 1 Pre-Existing Coverage</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>65,000+ Active Cardholders</span>
              </span>
              <a
                href="tel:+919123456789"
                className="px-3.5 py-1.5 rounded-full bg-rose-50/90 dark:bg-rose-950/80 backdrop-blur-md border border-rose-200 dark:border-rose-900/50 text-[#97144D] dark:text-rose-200 shadow-xs flex items-center gap-1.5 hover:underline"
              >
                <Phone className="h-3.5 w-3.5 text-[#97144D]" />
                <span>24/7 Helpline: +91 91234 56789</span>
              </a>
            </div>
          </div>

          {/* SLIDE INDICATORS (. . . _ .) */}
          <div className="pt-12 flex items-center justify-center gap-2">
            {HERO_BACKGROUND_IMAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-7 h-2 rounded-full bg-[#97144D] dark:bg-rose-400 shadow-sm'
                    : 'w-2 h-2 rounded-full bg-slate-400/60 dark:bg-white/40 hover:bg-slate-600 dark:hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}${idx === currentSlide ? ' (Active)' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW METROGRAM CARD WORKS (4 Simple Steps) */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <Activity className="h-3.5 w-3.5" />
              <span>CASHLESS-LIKE BILL COVERAGE WORKFLOW</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              How Metrogram Covers Your Hospital Bills in 4 Simple Steps
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              No complicated insurance paperwork, no agent commissions, and zero reimbursement wait times.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group hover:border-[#97144D]/40 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#97144D] text-white flex items-center justify-center font-black text-base mb-4 shadow-md shadow-[#97144D]/25">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                1. Get Your Metrogram Card
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose your family plan starting at ₹499/yr. Receive your instant Digital QR Card on WhatsApp in 5 minutes and a physical Smart Card at your address.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group hover:border-[#97144D]/40 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#97144D] text-white flex items-center justify-center font-black text-base mb-4 shadow-md shadow-[#97144D]/25">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                2. Visit 120+ Partner Hospitals
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Walk into any empanelled multi-specialty hospital, nursing home, or diagnostic center across Patna, Gaya, Muzaffarpur, Bhagalpur, or Darbhanga.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group hover:border-[#97144D]/40 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#97144D] text-white flex items-center justify-center font-black text-base mb-4 shadow-md shadow-[#97144D]/25">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                3. Flash Card at Billing Counter
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Show your Metrogram Card QR code at the admission desk. The hospital desk coordinates directly with Metrogram’s hospital helpdesk for pre-authorization.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group hover:border-[#97144D]/40 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#97144D] text-white flex items-center justify-center font-black text-base mb-4 shadow-md shadow-[#97144D]/25">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                4. Bill Covered on the Spot
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Up to 50%–75% of your surgery, bed charge, ICU, and medicine bill is deducted directly on the spot. You pay only the small discounted remainder!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CARD PLANS & PRICING (Core Product Offering) */}
      <section id="plans" className="py-20 bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <CreditCard className="h-3.5 w-3.5" />
              <span>AFFORDABLE ANNUAL MEMBERSHIP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Transparent Health Card Plans for Every Family
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              One annual subscription protects your family from massive surgery and hospital emergency costs across Bihar.
            </p>
          </div>

          {/* Cards Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {METROGRAM_CARD_PLANS.map((plan) => {
              const savingsPercent = Math.round(
                ((plan.regularPrice - plan.price) / plan.regularPrice) * 100
              );

              return (
                <div
                  key={plan.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-8 flex flex-col justify-between border-2 transition-all shadow-md hover:shadow-xl relative ${
                    plan.popular
                      ? 'border-[#97144D] ring-4 ring-[#97144D]/15 dark:border-rose-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Top Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#97144D] text-white text-[11px] font-extrabold px-4 py-1 rounded-full shadow-md tracking-wider">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-5">
                      <span className="text-xs font-bold text-[#97144D] dark:text-rose-400 uppercase tracking-widest block mb-1">
                        {plan.tier}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3.5 w-3.5 text-[#97144D]" />
                        <span>{plan.membersCount}</span>
                        <span>•</span>
                        <span>{plan.validity}</span>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl mb-6 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-slate-400 line-through mr-2">
                            ₹{plan.regularPrice.toLocaleString()}
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-[#97144D] dark:text-rose-400 inline-block">
                            ₹{plan.price.toLocaleString()}
                          </div>
                          <span className="text-xs text-slate-500 ml-1.5 font-bold">
                            / year
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                          {savingsPercent}% OFF
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                        Less than ₹3/day to protect your whole family.
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-6 text-xs">
                      <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Surgery</div>
                        <div className="font-extrabold text-[#97144D] dark:text-rose-300">{plan.surgeryCoverage}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">ICU Bed</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{plan.icuCoverage}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Labs & OPD</div>
                        <div className="font-bold text-emerald-700 dark:text-emerald-300">{plan.opdLabDiscount}</div>
                      </div>
                    </div>

                    {/* Features Checklist */}
                    <div className="space-y-3 mb-8">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Coverage & Benefits:
                      </div>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <Button
                      size="lg"
                      onClick={() => handleOpenApplyModal(plan)}
                      className={`w-full font-bold text-sm h-12 rounded-xl cursor-pointer ${
                        plan.popular
                          ? 'bg-[#97144D] hover:bg-[#820d3f] text-white shadow-lg shadow-[#97144D]/30'
                          : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700'
                      }`}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Apply for {plan.name.split(' ')[1]}</span>
                    </Button>
                    <a
                      href={`https://wa.me/919123456789?text=Hi%20Metrogram,%20I%20want%20to%20activate:%20${encodeURIComponent(plan.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center text-xs font-bold py-2 text-emerald-700 dark:text-emerald-300 hover:underline"
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      Chat with Card Specialist
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE HOSPITAL SAVINGS CALCULATOR */}
      <section id="calculator" className="py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <Calculator className="h-3.5 w-3.5" />
              <span>HOSPITAL BILL SAVINGS ESTIMATOR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              See How Much You Save on Major Hospital Surgeries
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Select any medical procedure below to see real market hospital rates vs your bill with a Metrogram Health Card.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            {/* Left 6 cols: Select Procedure Tabs */}
            <div className="lg:col-span-6 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Common Medical Procedure in Bihar:
              </div>
              {PROCEDURE_SAVINGS.slice(0, 6).map((proc) => {
                const isSelected = selectedCalcProcedure.id === proc.id;
                return (
                  <button
                    key={proc.id}
                    type="button"
                    onClick={() => setSelectedCalcProcedure(proc)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#97144D] text-white border-[#97144D] shadow-lg shadow-[#97144D]/20'
                        : 'bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#97144D]/40'
                    }`}
                  >
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {proc.category}
                      </span>
                      <div className="font-bold text-sm mt-1">{proc.procedure}</div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className={`text-xs ${isSelected ? 'text-rose-200' : 'text-slate-400'}`}>
                        Save ₹{proc.savingsAmount.toLocaleString()}
                      </div>
                      <div className="text-xs font-black">
                        {proc.coveragePercent}% Covered
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 6 cols: Visual Savings Comparison Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-7 sm:p-9 border-2 border-[#97144D]/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-[#97144D]/25 blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Live Bill Comparison
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-extrabold px-3 py-0.5 rounded-full border border-emerald-500/40">
                  {selectedCalcProcedure.coveragePercent}% Cost Covered
                </span>
              </div>

              <div className="my-6 space-y-4">
                <h3 className="text-2xl font-black text-white">
                  {selectedCalcProcedure.procedure}
                </h3>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs text-slate-400">Regular Hospital Bill:</div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-400 line-through mt-1">
                      ₹{selectedCalcProcedure.marketBill.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-rose-300 mt-1">Without Metrogram Card</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40">
                    <div className="text-xs text-emerald-300 font-bold">You Pay with Card:</div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                      ₹{selectedCalcProcedure.metrogramCardBill.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-200 mt-1">Direct On-Counter Rate</div>
                  </div>
                </div>

                {/* Big Savings Highlight */}
                <div className="p-5 rounded-2xl bg-[#97144D]/30 border border-[#97144D]/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-amber-300" />
                    <div>
                      <div className="text-xs text-rose-200">Total Money Saved in Cash:</div>
                      <div className="text-2xl sm:text-3xl font-black text-white">
                        ₹{selectedCalcProcedure.savingsAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-amber-300">
                      {selectedCalcProcedure.coveragePercent}%
                    </div>
                    <div className="text-[10px] text-slate-300">Bill Covered</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleOpenApplyModal()}
                  className="flex-1 bg-[#97144D] hover:bg-[#820d3f] text-white font-bold h-12 rounded-xl cursor-pointer"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Get Card & Claim These Savings</span>
                </Button>
                <a
                  href={`https://wa.me/919123456789?text=Hi%20Metrogram,%20I%20want%20to%20know%20the%20discounted%20rate%20for:%20${encodeURIComponent(selectedCalcProcedure.procedure)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-1 text-emerald-400" />
                  Hospital Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHAT MEDICAL TREATMENTS & PROCEDURES ARE COVERED */}
      <section id="coverage" className="py-20 bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>COMPREHENSIVE MEDICAL SCOPE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              All Major Treatments & Hospital Needs Covered
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              From routine doctor consults and blood tests to advanced laparoscopic surgeries and ICU admissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COVERED_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#97144D]/40 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#97144D] dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-extrabold text-[#97144D] dark:text-rose-300 bg-[#97144D]/10 px-2.5 py-1 rounded-full border border-[#97144D]/20">
                      {cat.discount}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Includes:</strong> {cat.examples}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. 120+ EMPANELLED HOSPITALS NETWORK ACROSS BIHAR */}
      <section id="hospitals" className="py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
              <Building2 className="h-3.5 w-3.5" />
              <span>BIHAR HOSPITAL NETWORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              120+ Leading Empanelled Hospitals & Diagnostic Hubs
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Show your Metrogram Card at any of these verified private hospitals across Bihar for instant on-counter bill discounts.
            </p>

            {/* City Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {['ALL', 'Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Begusarai', 'Purnia'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedHospitalCity(city)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedHospitalCity === city
                      ? 'bg-[#97144D] text-white shadow-sm shadow-[#97144D]/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {city === 'ALL' ? 'All Bihar Districts' : city}
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
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{hosp.rating}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-1">
                    {hosp.name}
                  </h3>
                  <div className="text-xs text-slate-500 mb-3">{hosp.type} • {hosp.beds}</div>

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
                    Admission Desk
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-500 mb-3">
              Need admission assistance at a hospital not listed here? Our 24/7 care managers coordinate direct cashless discounts across 50+ additional empanelled nursing centers.
            </p>
            <a
              href="tel:+919123456789"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#97144D] dark:text-rose-400 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call 24/7 Hospital Admission Desk (+91 91234 56789)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. METROGRAM CARD VS TRADITIONAL HEALTH INSURANCE VS AYUSHMAN */}
      <section id="comparison" className="py-20 bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800">
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
              No claim rejections, no 4-year waiting periods, and no high insurance premium burdens.
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
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
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
      <section id="about-us" className="py-20 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left 6 Columns: Story & Mission */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97144D]/10 text-[#97144D] dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-[#97144D]/20">
                <Building2 className="h-3.5 w-3.5" />
                <span>ABOUT METROGRAM HEALTHCARE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Democratizing Quality Private Hospital Care for Every Family in Bihar
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Founded to eliminate catastrophic hospital billing debt for middle-class and working families across Bihar, <strong>Metrogram</strong> creates direct bulk-negotiated partnerships with leading private hospitals and diagnostic labs.
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                By presenting your Metrogram Card, you bypass high out-of-pocket charges and access pre-authorized medical subsidies directly at the hospital billing desk — backed by ethical medical review and 24x7 patient advocacy.
              </p>

              {/* Quality & Verification Standards */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <Award className="h-5 w-5 text-[#97144D] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white block font-bold">120+ Legally Empanelled Hospitals</strong>
                    Direct signed hospital MoUs ensuring strict compliance with fixed discounted package billing rates.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="h-5 w-5 text-[#97144D] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white block font-bold">ISO 9001:2015 Quality Certified & Govt. Registered</strong>
                    Incorporated healthcare platform compliant with Indian clinical standards, MSME, and Startup India recognition.
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Leadership / Promoters */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>Medical Governance & Founders</span>
                  <Badge variant="outline" className="text-xs text-[#97144D] border-[#97144D]/30">
                    Clinical Board
                  </Badge>
                </h3>

                <div className="space-y-5">
                  {LEADERSHIP_TEAM.map((leader, i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0">
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

      {/* 11. FAQ BLOCK */}
      <section id="faqs" className="py-20 bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800">
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
                <span>24/7 CARD & HOSPITAL HELPLINE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Speak with a Metrogram Care Manager
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Need immediate admission assistance at a private hospital in Bihar? Or have questions regarding adding your family members? Our team is available 24x7.
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
                    <div className="text-xs text-slate-500 font-semibold">24x7 Emergency & Hospital Admission Desk</div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      +91 91234 56789 / 1800-METRO-CARD
                    </div>
                  </div>
                </a>

                {/* WhatsApp Chat */}
                <a
                  href="https://wa.me/919123456789?text=Hello%20Metrogram,%20I%20need%20card%20assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:border-emerald-500/40 bg-slate-50 dark:bg-slate-900 transition-colors block group"
                >
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/30 group-hover:scale-105 transition-transform">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Direct WhatsApp Card Concierge</div>
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
                    <div className="text-slate-500 font-semibold mb-1">State Command & Head Office</div>
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

            {/* Right 7 Columns: Card Application & Consultation Form */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Apply for Metrogram Health Card
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
                    Congratulations <strong>{formData.name}</strong>! Your <strong>{formData.plan}</strong> has been created. A digital card QR and partner hospital admission token has been sent to <strong>{formData.phone}</strong>.
                  </p>
                  <Button
                    onClick={handleResetModal}
                    className="bg-[#97144D] text-white font-bold text-xs"
                  >
                    Apply for Another Family Member
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name of Head of Family *
                      </label>
                      <Input
                        placeholder="e.g. Ramesh Chandra Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Mobile Phone Number *
                      </label>
                      <Input
                        placeholder="e.g. 9876543210"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-11 px-3 text-sm rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                      >
                        <option value="Patna">Patna</option>
                        <option value="Muzaffarpur">Muzaffarpur</option>
                        <option value="Gaya">Gaya</option>
                        <option value="Bhagalpur">Bhagalpur</option>
                        <option value="Darbhanga">Darbhanga</option>
                        <option value="Begusarai">Begusarai</option>
                        <option value="Purnia">Purnia</option>
                        <option value="Other District">Other District in Bihar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Select Card Plan
                      </label>
                      <select
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        className="w-full h-11 px-3 text-sm rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                      >
                        <option value="Metrogram Gold Family Shield (₹999/yr)">
                          Metrogram Gold Family Shield (₹999/yr) — 4 Members
                        </option>
                        <option value="Metrogram Platinum Super Shield (₹1,999/yr)">
                          Metrogram Platinum Super Shield (₹1,999/yr) — 6 Members
                        </option>
                        <option value="Metrogram Silver Card (₹499/yr)">
                          Metrogram Silver Card (₹499/yr) — 1 Individual
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Family Members to Include / Specific Medical Concern (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention names & ages of family members or if anyone currently needs surgery / hospitalization..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                          Confirm Application & Receive Digital Card
                        </span>
                      )}
                    </Button>
                  </div>

                  <div className="text-center text-[11px] text-slate-500 pt-1">
                    🔒 100% Secure & Regulated. No health insurance medical test rejection.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 13. FOOTER (Axis Burgundy & Crisp Clean Contrast) */}
      <footer className="bg-[#1E2229] text-white pt-16 pb-12 border-t border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Col 1 & 2: Brand Story */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#97144D] flex items-center justify-center text-white">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-white">
                    METROGRAM
                  </span>
                  <span className="text-xs block text-rose-300 font-semibold">
                    Health Card Network
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Metrogram Healthcare Private Limited is Bihar’s leading hospital bill coverage membership network. Empowering families with instant on-counter hospital bill subsidies at 120+ top private medical centers across Bihar.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <div>CIN / Reg: U85100BR2021PTC051289</div>
                <div>ISO 9001:2015 Certified Health Access Network</div>
              </div>
            </div>

            {/* Col 3: Card Plans */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Card Plans
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a href="#plans" className="hover:text-white transition-colors">
                    Metrogram Gold Family Shield
                  </a>
                </li>
                <li>
                  <a href="#plans" className="hover:text-white transition-colors">
                    Metrogram Platinum Super Shield
                  </a>
                </li>
                <li>
                  <a href="#plans" className="hover:text-white transition-colors">
                    Metrogram Silver Card (Individual)
                  </a>
                </li>
                <li>
                  <a href="#calculator" className="hover:text-white transition-colors">
                    Hospital Savings Calculator
                  </a>
                </li>
                <li>
                  <a href="#hospitals" className="hover:text-white transition-colors">
                    120+ Empanelled Hospitals
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Covered Surgeries */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Covered Procedures
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a href="#coverage" className="hover:text-white transition-colors">
                    Laparoscopic Surgeries
                  </a>
                </li>
                <li>
                  <a href="#coverage" className="hover:text-white transition-colors">
                    Normal & C-Section Maternity
                  </a>
                </li>
                <li>
                  <a href="#coverage" className="hover:text-white transition-colors">
                    Total Knee Replacement
                  </a>
                </li>
                <li>
                  <a href="#coverage" className="hover:text-white transition-colors">
                    Kidney Stone Laser (PCNL)
                  </a>
                </li>
                <li>
                  <a href="#coverage" className="hover:text-white transition-colors">
                    Cardiac Stenting & ICU Stay
                  </a>
                </li>
                <li>
                  <a href="#coverage" className="hover:text-white transition-colors">
                    50% OFF NABL Lab Tests
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 5: 24/7 Helpline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Hospital Helpdesk
              </h4>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-rose-400 font-bold text-sm">+91 91234 56789</div>
                  <div className="text-[10px] text-slate-400">24/7 Hospital Admission Desk</div>
                </div>
                <div>
                  <div className="text-white font-semibold">Email Enquiries:</div>
                  <a href="mailto:care@metrogram.in" className="hover:underline text-rose-300">
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
              &copy; {new Date().getFullYear()} Metrogram Healthcare Private Limited. All Rights Reserved.
            </div>
            <div className="flex gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Card Terms of Use</span>
              <span className="hover:text-slate-400 cursor-pointer">Hospital Tariff Charter</span>
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
          href="https://wa.me/919123456789?text=Hello%20Metrogram,%20I%20want%20to%20apply%20for%20the%20Metrogram%20Health%20Card"
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
          <span>Apply Card</span>
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
              {selectedPlanForModal ? (
                <span>
                  Selected Plan: <strong className="text-[#97144D] dark:text-rose-400">{selectedPlanForModal.name}</strong> (₹{selectedPlanForModal.price}/yr — {selectedPlanForModal.membersCount})
                </span>
              ) : (
                <span>Protect your family with up to 75% hospital bill coverage across Bihar.</span>
              )}
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
                Your digital Metrogram Card QR code has been dispatched to <strong>{formData.phone}</strong> on WhatsApp. You can immediately show it at any partner hospital.
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                  Selected Card Tier
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full h-10 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                >
                  <option value="Metrogram Gold Family Shield (₹999/yr)">
                    Metrogram Gold Family Shield (₹999/yr) — 4 Members (Most Popular)
                  </option>
                  <option value="Metrogram Platinum Super Shield (₹1,999/yr)">
                    Metrogram Platinum Super Shield (₹1,999/yr) — 6 Members (Max Coverage)
                  </option>
                  <option value="Metrogram Silver Card (₹499/yr)">
                    Metrogram Silver Card (₹499/yr) — 1 Individual
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Address & Family Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Near Boring Canal Road, Patna. Include spouse Sunita and 2 kids..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                      Activate Card on WhatsApp
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
    </div>
  );
};

export default LandingPage;
