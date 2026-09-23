import React, { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  HeartHandshake,
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
  Calculator,
  Percent,
  Search,
  MapPin,
  Clock,
  Award,
  BadgePercent,
  Pill,
  Baby,
  Eye,
  Heart,
  UserCheck,
  Check,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  Download,
  QrCode,
  Sparkle,
} from 'lucide-react';
import { toast } from 'sonner';

// Procedures for Interactive Calculator
interface ProcedureData {
  id: string;
  name: string;
  category: string;
  regularCost: number;
  discountRate: number; // in percent
  icon: React.ElementType;
}

const PROCEDURES: ProcedureData[] = [
  {
    id: 'normal-delivery',
    name: 'Normal Child Delivery & Maternity Care',
    category: 'Maternity',
    regularCost: 55000,
    discountRate: 65,
    icon: Baby,
  },
  {
    id: 'c-section',
    name: 'C-Section & Post-Natal Hospital Stay',
    category: 'Maternity & Surgery',
    regularCost: 85000,
    discountRate: 60,
    icon: Baby,
  },
  {
    id: 'knee-replacement',
    name: 'Knee Replacement / Orthopedic Surgery',
    category: 'Orthopedics',
    regularCost: 220000,
    discountRate: 58,
    icon: Activity,
  },
  {
    id: 'cataract-surgery',
    name: 'Cataract Eye Surgery (Both Eyes + Lens)',
    category: 'Ophthalmology',
    regularCost: 42000,
    discountRate: 70,
    icon: Eye,
  },
  {
    id: 'mri-ct-scan',
    name: 'Full Body MRI / Advanced Contrast CT Scan',
    category: 'Diagnostics',
    regularCost: 11000,
    discountRate: 68,
    icon: Stethoscope,
  },
  {
    id: 'cardiac-angiography',
    name: 'Cardiac Angiography & Heart Assessment',
    category: 'Cardiology',
    regularCost: 45000,
    discountRate: 62,
    icon: Heart,
  },
  {
    id: 'full-diagnostics',
    name: 'Comprehensive Health & Blood Panel (65 Tests)',
    category: 'Pathology',
    regularCost: 6500,
    discountRate: 75,
    icon: Stethoscope,
  },
  {
    id: 'chronic-medicines',
    name: 'Monthly Chronic Illness Medicines (Diabetes/BP)',
    category: 'Pharmacy',
    regularCost: 4800,
    discountRate: 60,
    icon: Pill,
  },
];

// Hospital Network Sample
const SAMPLE_HOSPITALS = [
  {
    name: 'Metro Care Super Specialty Hospital',
    city: 'Mumbai',
    discount: 'Up to 70%',
    beds: '450 Beds',
    specialties: ['Cardiology', 'Oncology', 'Maternity', 'ICU'],
    verified: true,
  },
  {
    name: 'National Welfare Health Institute',
    city: 'New Delhi',
    discount: 'Up to 75%',
    beds: '600 Beds',
    specialties: ['Orthopedics', 'Pediatrics', 'Diagnostics', 'Emergency'],
    verified: true,
  },
  {
    name: 'Seva Multi-Specialty Medical Center',
    city: 'Bengaluru',
    discount: 'Up to 65%',
    beds: '320 Beds',
    specialties: ['Neurology', 'Eye Care', 'Pathology', 'General Surgery'],
    verified: true,
  },
  {
    name: 'LifeSpring Community Hospital Network',
    city: 'Hyderabad',
    discount: 'Up to 70%',
    beds: '280 Beds',
    specialties: ['Maternity Care', 'Dialysis', 'ENT', 'Critical Care'],
    verified: true,
  },
  {
    name: 'Apex Apollo Care Foundation Hospital',
    city: 'Kolkata',
    discount: 'Up to 60%',
    beds: '500 Beds',
    specialties: ['Cardiology', 'Gastroenterology', 'Radiology'],
    verified: true,
  },
  {
    name: 'Janata Seva Charitable Health Complex',
    city: 'Chennai',
    discount: 'Up to 80%',
    beds: '350 Beds',
    specialties: ['All Specialties', 'Zero OPD Fee', 'Free Generic Pharmacy'],
    verified: true,
  },
];

// Patient Stories
const TESTIMONIALS = [
  {
    quote:
      'When my mother needed urgent knee surgery, private hospitals quoted ₹2.4 Lakhs which was impossible for a rickshaw driver like me. With this Universal Medical Card, our final hospital bill came down to just ₹92,000. It saved our family from debt.',
    name: 'Rameshwar Lal',
    role: 'Daily Wage Earner, Indore',
    saved: 'Saved ₹1,48,000 (62% Discount)',
    treatment: 'Orthopedic Knee Surgery',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    quote:
      'My daughter had severe pneumonia and stayed 6 days in ICU. Showing our card at admission instantly reduced our per-day bed and pharmacy charges by 65%. The hospital staff processed the discount immediately without any paperwork hurdles.',
    name: 'Fatima Sheikh',
    role: 'Mother & Small Shop Owner, Pune',
    saved: 'Saved ₹64,000 (65% Discount)',
    treatment: 'Pediatric ICU & Medicine',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    quote:
      'For retired elderly people like us, monthly diabetic medicines and periodic cardiac checkups were taking half my pension. Now with the 75% lab discount and 60% pharmacy discount, healthcare is finally affordable.',
    name: 'Col. K. N. Nair (Retd.)',
    role: 'Senior Citizen, Kochi',
    saved: 'Saves ₹4,200 Every Month',
    treatment: 'Chronic Care & Diagnostics',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
];

const FAQS = [
  {
    q: 'Who is eligible to get this Medical Discount Card?',
    a: 'Everyone is eligible! We offer a 100% Free Subsidized Community Card for low-income and BPL families with zero fees. We also provide affordable Family Shield and VIP tier cards for working households and businesses so everyone can enjoy massive hospital discounts.',
  },
  {
    q: 'How does the discount work at hospitals?',
    a: 'Simply present your digital or physical card at the hospital billing desk or reception when you arrive or at discharge. The empanelled hospital immediately applies the pre-negotiated discount (30% to 80%) on your final invoice. There are no reimbursement claim delays.',
  },
  {
    q: 'Are pre-existing conditions and elderly family members covered?',
    a: 'Yes, 100%! Unlike private health insurance with waiting periods and rejection clauses, our medical discount card has NO pre-existing disease exclusions and NO age limit. You can use it from Day 1.',
  },
  {
    q: 'Which hospital services are covered under the discount?',
    a: 'The card covers OPD doctor consultations, IPD room rent, surgeries, ICU stay, pathology tests, diagnostic radiology (MRI, CT Scan, X-Ray, Ultrasound), prescription pharmacy, dental procedures, and eye care.',
  },
  {
    q: 'How quickly is the card issued after applying?',
    a: 'Your digital card is generated instantly upon submitting the application. You can immediately download your QR-enabled digital card on your phone and start using it at any partner hospital right away.',
  },
];

export const LandingPage: React.FC = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // Calculator State
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>('normal-delivery');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Card Application Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantTier, setApplicantTier] = useState<'COMMUNITY' | 'FAMILY' | 'VIP'>('COMMUNITY');
  const [applicantFamilyMembers, setApplicantFamilyMembers] = useState('4');
  const [isSubmittedCard, setIsSubmittedCard] = useState(false);

  const selectedProcedure =
    PROCEDURES.find((p) => p.id === selectedProcedureId) || PROCEDURES[0];
  const discountAmount = Math.round(
    (selectedProcedure.regularCost * selectedProcedure.discountRate) / 100
  );
  const discountedCost = selectedProcedure.regularCost - discountAmount;

  const filteredHospitals = SAMPLE_HOSPITALS.filter((h) => {
    const matchesCity = cityFilter === 'All' || h.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCity && matchesSearch;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      toast.error('Please enter your full name and mobile number');
      return;
    }
    setIsSubmittedCard(true);
    toast.success('🎉 Health Card generated successfully! You can now use your digital card.');
  };

  const handleResetApplication = () => {
    setIsSubmittedCard(false);
    setApplicantName('');
    setApplicantPhone('');
    setIsApplyModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-cyan-500 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-blue-900 text-cyan-100 text-xs py-2 px-4 text-center font-medium border-b border-cyan-800/40 flex items-center justify-center gap-3">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          <strong>National Welfare Medical Relief:</strong> Free & Subsidized Health Discount Cards for Low-Income Families & Senior Citizens.
        </span>
        <a
          href="#apply"
          className="underline decoration-cyan-400 font-bold hover:text-white transition-colors ml-1 hidden sm:inline"
        >
          Claim Your Card &rarr;
        </a>
      </div>

      {/* 2. NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/85 border-b border-border/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white shadow-md shadow-cyan-600/30 group-hover:scale-105 transition-transform">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-foreground">
                  Aarogya<span className="text-cyan-600 dark:text-cyan-400">Card</span>
                </span>
                <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  CARE FOR ALL
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium hidden sm:block">
                Universal Medical & Hospital Discount Foundation
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#calculator" className="hover:text-foreground transition-colors">
              Savings Calculator
            </a>
            <a href="#benefits" className="hover:text-foreground transition-colors">
              Discount Benefits
            </a>
            <a href="#hospitals" className="hover:text-foreground transition-colors">
              Partner Hospitals
            </a>
            <a href="#stories" className="hover:text-foreground transition-colors">
              Stories
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Theme switch */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Emergency Helpline Hotline */}
            <a
              href="tel:1800-425-CARE"
              className="hidden xl:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5 animate-bounce" />
              <span>24/7 Helpline: 1800-425-CARE</span>
            </a>

            {/* Authentication portal / Dashboard Link */}
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(role === 'CUSTOMER' ? '/customer/home' : '/dashboard')
                }
                className="gap-2 font-semibold shadow-xs"
              >
                <UserCheck className="h-4 w-4 text-emerald-500" />
                <span>Open {role === 'CUSTOMER' ? 'Card Portal' : 'Dashboard'}</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="font-semibold text-muted-foreground hover:text-foreground"
              >
                <Link to="/login">Portal Sign In</Link>
              </Button>
            )}

            {/* Apply Button */}
            <Button
              size="sm"
              onClick={() => setIsApplyModalOpen(true)}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold shadow-md shadow-cyan-600/25 rounded-xl cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Apply For Card
            </Button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION - FULL BACKGROUND IMAGE AS REQUESTED */}
      <section className="relative min-h-[90vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* FULL IMAGE HERO BACKGROUND */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
          style={{
            backgroundImage: `url('/hero-medical.jpg')`,
          }}
        >
          {/* Multi-layer High-Legibility Gradients & Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/70" />
          <div className="absolute inset-0 bg-radial-at-top-left from-cyan-900/40 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-linear-to-b from-background/30 via-transparent to-background" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* HERO CONTENT CONTAINER */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Mission, Value Prop, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-white text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold tracking-wide backdrop-blur-md shadow-lg shadow-cyan-950/50">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <span>PUBLIC HEALTHCARE WELFARE INITIATIVE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-300">100% Free For Low-Income Families</span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-md">
                No One Should Suffer Due To{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 underline decoration-cyan-400/50 decoration-wavy decoration-2">
                  High Hospital Bills
                </span>
              </h1>

              {/* Subtitle / Description */}
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow-sm">
                Get the <strong className="text-white font-semibold">Universal Aarogya Health Card</strong>.
                Enjoy instant discounts from <strong className="text-cyan-300 font-bold">40% up to 80%</strong> on
                surgeries, doctor consultations, ICU beds, MRI/CT scans, and medicines at 1,500+ top private and charitable network hospitals.
              </p>

              {/* Quick Feature Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
                <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>Zero Paperwork</strong> & Instant Digital Issuance</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>No Age Limit</strong> & No Disease Exclusions</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>Direct Bill Discount</strong> — No Claim Waiting</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>Covers Entire Family</strong> (Up to 6 Members)</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  size="lg"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full sm:w-auto h-13 px-8 text-base bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-950 font-black shadow-xl shadow-cyan-500/30 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Your Health Card Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                <a
                  href="#calculator"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-13 px-6 text-sm font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/90 rounded-2xl backdrop-blur-md transition-colors"
                >
                  <Calculator className="h-4 w-4 mr-2 text-cyan-400" />
                  Calculate Bill Savings
                </a>
              </div>

              {/* Social Proof Stats Counter */}
              <div className="pt-6 border-t border-slate-700/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-300">50,000+</div>
                  <div className="text-xs text-slate-400 font-medium">Families Protected</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-300">1,500+</div>
                  <div className="text-xs text-slate-400 font-medium">Partner Hospitals</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300">₹25 Cr+</div>
                  <div className="text-xs text-slate-400 font-medium">Medical Bills Saved</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Card Showcase with Holographic Glow */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating Card Design */}
                <div className="relative rounded-3xl p-1 bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-400 shadow-2xl shadow-cyan-500/20 group">
                  <div className="relative rounded-[22px] bg-slate-900/95 backdrop-blur-2xl p-6 text-white overflow-hidden border border-white/10">
                    {/* Card background art */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

                    {/* Card Header */}
                    <div className="flex items-center justify-between relative z-10 mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
                          <HeartHandshake className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm tracking-wider text-white">
                            AAROGYA SEVA CARD
                          </h3>
                          <p className="text-[10px] text-cyan-300 font-semibold tracking-widest uppercase">
                            Universal Medical Relief
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                        <Sparkle className="h-3 w-3 fill-amber-300" />
                        UP TO 80% OFF
                      </span>
                    </div>

                    {/* Chip & Contactless */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-yellow-500 border border-amber-300/60 shadow-inner flex items-center justify-center">
                        <div className="w-7 h-5 border border-amber-900/30 rounded-xs" />
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                        <span className="tracking-widest">VALID ACROSS ALL HOSPITALS</span>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="mb-4 relative z-10 font-mono text-lg sm:text-xl font-bold tracking-widest text-cyan-100 flex items-center justify-between">
                      <span>4892</span>
                      <span>8291</span>
                      <span>7740</span>
                      <span>9012</span>
                    </div>

                    {/* Cardholder Details */}
                    <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10 text-xs">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Beneficiary Name
                        </div>
                        <div className="font-bold text-white tracking-wide text-sm">
                          FAMILY WELFARE SHIELD
                        </div>
                        <div className="text-[10px] text-cyan-400 font-medium">
                          ID: MED-992014 • Active
                        </div>
                      </div>

                      <div className="p-1.5 bg-white rounded-lg shadow-xs">
                        <QrCode className="h-8 w-8 text-slate-950" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge on card */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl rounded-2xl p-3.5 shadow-xl flex items-center gap-3 text-white">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <BadgePercent className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-emerald-300">Guaranteed Savings</div>
                    <div className="text-slate-300">Surgeries, OPD & Pharmacy</div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl rounded-2xl p-3 shadow-xl flex items-center gap-2 text-white">
                  <div className="h-8 w-8 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-bold text-cyan-200">
                    1,500+ Network Hospitals
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="outline" className="px-3 py-1 font-bold text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
              SIMPLE 3-STEP PROCESS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              How Anyone Can Get & Use The Discount Card
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              No insurance rejections, no pre-authorization bureaucracy, and no claim reimbursements. Just immediate discount on your hospital bill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-cyan-500/50 transition-all group">
              <div className="absolute -top-4 left-8 px-3 py-1 bg-cyan-600 text-white rounded-full text-xs font-black">
                STEP 01
              </div>
              <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Apply & Get Instant Card</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fill in basic family details in 2 minutes. Free community card for low-income citizens, or choose a family plan. Instant digital card QR is issued.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all group">
              <div className="absolute -top-4 left-8 px-3 py-1 bg-teal-600 text-white rounded-full text-xs font-black">
                STEP 02
              </div>
              <div className="h-14 w-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Visit Any Network Hospital</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Walk into any of our 1,500+ partner hospitals, diagnostic centers, or pharmacy chains. Present your physical or digital mobile health card at the desk.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all group">
              <div className="absolute -top-4 left-8 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black">
                STEP 03
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Percent className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Instant Direct Bill Discount</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The hospital automatically deducts 40% to 80% from the bill. Pay only the reduced discounted balance directly. No claim forms or waiting for months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE SAVINGS ESTIMATOR & CALCULATOR */}
      <section id="calculator" className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <Badge variant="outline" className="px-3 py-1 font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              TRANSPARENT MEDICAL SAVINGS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              See How Much You Save on Treatments
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Select any medical treatment or health service below to see normal hospital market costs versus discounted rates with our Card.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Treatment Selection list */}
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                <span>Select Medical Procedure or Service:</span>
                <span>Pre-Negotiated Rates</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PROCEDURES.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedProcedureId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedProcedureId(item.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500 text-foreground ring-2 ring-cyan-500/20 shadow-sm'
                          : 'bg-card hover:bg-muted/50 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-cyan-600 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold line-clamp-1 text-foreground">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.category}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">
                        {item.discountRate}% OFF
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Calculated Savings Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-card via-card to-cyan-500/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold border-cyan-500/30">
                    {selectedProcedure.category}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    Direct Hospital Discount
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-foreground mb-4">
                  {selectedProcedure.name}
                </h3>

                {/* Price Comparison Breakdown */}
                <div className="space-y-4 py-4 border-y border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Standard Hospital Bill (Without Card):</span>
                    <span className="font-semibold text-destructive line-through">
                      ₹{selectedProcedure.regularCost.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cardholder Discount Rate:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedProcedure.discountRate}% Instant Reduction
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">You Save Directly:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      - ₹{discountAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Final You Pay Box */}
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30">
                  <div className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    Total Amount You Pay At Hospital:
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-foreground mt-1">
                    ₹{discountedCost.toLocaleString()}
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      (Saved ₹{discountAmount.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full h-12 text-sm font-bold bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-md cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Card & Save on This Treatment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPREHENSIVE DISCOUNT BENEFITS & SPECIALTIES */}
      <section id="benefits" className="py-20 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="outline" className="px-3 py-1 font-bold text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
              FULL MEDICAL SPECTRUM
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              What Healthcare Services Are Covered?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              From emergency ICU admissions to everyday chronic medicines, your card provides guaranteed discounted rates across all medical needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <div className="p-6 rounded-2xl border bg-card hover:border-cyan-500/40 transition-all space-y-3">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Major Surgeries & Operations</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                40% to 65% discount on general, laparoscopic, orthopedic, cardiac, and pediatric surgical procedures in private hospitals.
              </p>
              <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                Save ₹50,000 - ₹1,80,000 on surgeries
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-2xl border bg-card hover:border-teal-500/40 transition-all space-y-3">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">OPD Doctor Consultations</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                50% to 100% off OPD fees. Unlimited visits to leading specialists, physicians, pediatricians, and gynecologists.
              </p>
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400">
                Zero / minimal consultation fee
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-2xl border bg-card hover:border-emerald-500/40 transition-all space-y-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Pill className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Medicines & Pharmacy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Up to 60% discount on branded and high-grade generic medicines, chronic disease prescriptions, and home deliveries.
              </p>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Save thousands on monthly medicines
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="p-6 rounded-2xl border bg-card hover:border-blue-500/40 transition-all space-y-3">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Baby className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Maternity & Childbirth</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Subsidized delivery packages (Normal & C-Section), prenatal sonography, infant vaccinations, and neonatal ICU care.
              </p>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Dignified childbirth for every mother
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="p-6 rounded-2xl border bg-card hover:border-purple-500/40 transition-all space-y-3">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">MRI, CT Scan & Lab Tests</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Up to 75% discount on blood panels, ultrasound, MRI, CT scans, mammograms, and biopsy pathology tests.
              </p>
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                Accurate diagnosis made affordable
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="p-6 rounded-2xl border bg-card hover:border-amber-500/40 transition-all space-y-3">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Eye Care & Cataract Surgery</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Free vision checkups, up to 70% off cataract surgeries with premium lenses, and discounted prescription spectacles.
              </p>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Restoring vision for senior citizens
              </div>
            </div>

            {/* Benefit 7 */}
            <div className="p-6 rounded-2xl border bg-card hover:border-rose-500/40 transition-all space-y-3">
              <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Emergency ICU & Ambulance</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                24/7 priority emergency admission, 50% discount on ICU day charges, and free or subsidized ambulance dispatch.
              </p>
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Lifesaving support in critical hours
              </div>
            </div>

            {/* Benefit 8 */}
            <div className="p-6 rounded-2xl border bg-card hover:border-cyan-500/40 transition-all space-y-3">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Cardiology & Dialysis</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Subsidized kidney dialysis sessions, pacemakers, heart stents, angiography, and regular cardiological monitoring.
              </p>
              <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                Affordable chronic life-support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CARD PLANS & SUBSIDIES (INCLUSIVE FOR EVERYONE) */}
      <section id="plans" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="outline" className="px-3 py-1 font-bold text-teal-600 dark:text-teal-400 border-teal-500/30 bg-teal-500/10">
              EQUITABLE ACCESS FOR ALL
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Choose The Right Health Card For Your Needs
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Completely free cards for low-income and poor families, and subsidized plans for working households.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Plan 1: Free Community Welfare Card */}
            <div className="rounded-3xl border-2 border-emerald-500/40 bg-card p-8 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider px-4 py-1 rounded-bl-xl">
                100% Free / Subsidized
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Community Welfare Card</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  For low-income households, daily wage workers, and underprivileged families.
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground">₹0</span>
                    <span className="text-xs text-muted-foreground font-semibold">/ Lifetime Free</span>
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    100% Sponsored by Foundation Grant
                  </div>
                </div>

                <div className="space-y-3 text-xs text-foreground border-t pt-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Up to <strong>80% discount</strong> on surgeries & hospital stays</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>100% Free OPD consultations</strong> at partner clinics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Up to <strong>70% discount</strong> on blood tests & scans</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Free generic medicines for chronic illness</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Covers up to <strong>6 family members</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  onClick={() => {
                    setApplicantTier('COMMUNITY');
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl cursor-pointer"
                >
                  Apply For Free Welfare Card
                </Button>
              </div>
            </div>

            {/* Plan 2: Family Care Shield (Most Popular) */}
            <div className="rounded-3xl border-2 border-cyan-500 bg-card p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden ring-4 ring-cyan-500/15">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-md">
                ⭐ Most Popular Plan
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Family Care Shield</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  For middle-class households, salaried employees, and multi-generation families.
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground">₹499</span>
                    <span className="text-xs text-muted-foreground font-semibold">/ 1 Year (Entire Family)</span>
                  </div>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400 font-bold mt-1">
                    Average family saves ₹45,000+ per year
                  </div>
                </div>

                <div className="space-y-3 text-xs text-foreground border-t pt-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Up to <strong>65% discount</strong> at private multi-specialty hospitals</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span><strong>50% discount on OPD</strong> specialist consultations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Up to <strong>60% discount</strong> on MRI, CT Scan, ultrasound & labs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Up to <strong>30% discount</strong> on prescription pharmacy bills</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Includes 2 Free Full Body Checkup coupons</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>24/7 Priority Emergency Bed Assistance</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  onClick={() => {
                    setApplicantTier('FAMILY');
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold h-11 rounded-xl shadow-md cursor-pointer"
                >
                  Get Family Shield Card
                </Button>
              </div>
            </div>

            {/* Plan 3: VIP Elite Health Shield */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[11px] uppercase tracking-wider px-4 py-1 rounded-bl-xl border-l border-b border-amber-500/30">
                VIP Concierge
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">VIP Platinum Shield</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  For comprehensive high-end private healthcare, corporate, and NRI family support.
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground">₹1,499</span>
                    <span className="text-xs text-muted-foreground font-semibold">/ 1 Year (All-Inclusive)</span>
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
                    Dedicated 24/7 Doctor & Hospital Concierge
                  </div>
                </div>

                <div className="space-y-3 text-xs text-foreground border-t pt-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Maximum discount tiers (up to <strong>70%</strong>) across luxury hospitals</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Dedicated Relationship Manager for hospital admissions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Free Home Sample Collection for diagnostic tests</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Unlimited free 24/7 tele-consultations with senior MD doctors</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Complimentary physical card dispatch to your address</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    setApplicantTier('VIP');
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 font-bold h-11 rounded-xl cursor-pointer"
                >
                  Get VIP Platinum Card
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PARTNER HOSPITAL NETWORK SEARCH */}
      <section id="hospitals" className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <Badge variant="outline" className="px-3 py-1 font-bold text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
              NATIONWIDE NETWORK
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              1,500+ Empanelled Hospitals & Clinics
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Find verified healthcare institutions in your city where our card is accepted with instant bill reduction.
            </p>
          </div>

          {/* Search & City Filter controls */}
          <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hospital by name or specialty (e.g. Cardiology, Maternity)..."
                className="pl-10 h-11 bg-card"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* City Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Mumbai', 'New Delhi', 'Bengaluru', 'Hyderabad', 'Kolkata', 'Chennai'].map(
                (city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setCityFilter(city)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      cityFilter === city
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-card text-muted-foreground hover:text-foreground border'
                    }`}
                  >
                    {city}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Hospitals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border bg-card hover:border-cyan-500/50 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground leading-tight">
                        {hospital.name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-cyan-500" />
                        {hospital.city} • {hospital.beds}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold shrink-0">
                    {hospital.discount}
                  </Badge>
                </div>

                <div className="space-y-1.5 pt-2 border-t text-xs">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase">
                    Empanelled Departments:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hospital.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Instant Card Accepted
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      toast.info(`Booking assistance initiated for ${hospital.name}`);
                      setIsApplyModalOpen(true);
                    }}
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Avail Discount &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. REAL PATIENT TESTIMONIALS & IMPACT STORIES */}
      <section id="stories" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="outline" className="px-3 py-1 font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              LIVES SAVED & DIGNITY RESTORED
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Real Stories of Financial & Medical Relief
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Listen to how ordinary citizens, daily earners, and senior citizens avoided debilitating medical debt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <BadgePercent className="h-3.5 w-3.5" />
                    <span>{t.saved}</span>
                  </div>

                  <p className="text-sm text-foreground/90 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-11 w-11 rounded-full object-cover border-2 border-cyan-500/40"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">
                      {t.treatment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <Badge variant="outline" className="px-3 py-1 font-bold text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
              FREQUENTLY ASKED QUESTIONS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Everything You Need to Know
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Clear answers to help you understand how our health card initiative works for you.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border bg-card overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base text-foreground flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/40 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-cyan-600 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-cyan-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-muted/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. BOTTOM CALL TO ACTION BANNER */}
      <section id="apply" className="py-20 relative overflow-hidden bg-gradient-to-tr from-cyan-900 via-teal-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30 text-xs font-bold px-3 py-1">
            JOIN 50,000+ FAMILIES TODAY
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Protect Your Family From Astronomical Medical Expenses
          </h2>

          <p className="text-sm sm:text-base text-cyan-100 max-w-2xl mx-auto leading-relaxed">
            Apply in 2 minutes. Receive your instant QR Health Card on your phone and save up to 80% on hospital bills starting today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full sm:w-auto h-13 px-8 text-base bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-cyan-900/50 cursor-pointer"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Get Your Free / Discount Card
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center h-13 px-6 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-md transition-colors"
            >
              Hospital & Admin Login &rarr;
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-cyan-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Free Community Support
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant Digital Activation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 1,500+ Partner Hospitals
            </span>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-card border-t border-border py-12 text-muted-foreground text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center font-bold">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <span className="text-base font-black text-foreground">
                  Aarogya<span className="text-cyan-600">Card</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dedicated to making world-class healthcare, surgery, and diagnostics affordable and accessible for every citizen and family.
              </p>
              <div className="text-[11px] text-muted-foreground font-semibold">
                Emergency 24/7 Helpline: 1800-425-CARE
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-foreground">Quick Links</h4>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#how-it-works" className="hover:text-foreground">How Card Works</a></li>
                <li><a href="#calculator" className="hover:text-foreground">Savings Calculator</a></li>
                <li><a href="#benefits" className="hover:text-foreground">Discount Benefits</a></li>
                <li><a href="#hospitals" className="hover:text-foreground">Partner Hospital Directory</a></li>
                <li><a href="#plans" className="hover:text-foreground">Community Welfare Subsidy</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-foreground">Portal & Management</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/login" className="hover:text-foreground">Staff & Admin Sign In</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Member Portal Access</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Hospital Empanelled Desk</Link></li>
                <li><a href="#faq" className="hover:text-foreground">Support & FAQ</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-foreground">Accreditation & Trust</h4>
              <p className="text-xs leading-relaxed">
                Empanelled with leading ISO & NABH certified multi-specialty hospitals and medical networks.
              </p>
              <div className="pt-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Public Welfare Initiative</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} Aarogya Health Card Foundation / MetroGram Platform. All Rights Reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Terms of Healthcare Service</span>
              <span className="hover:underline cursor-pointer">Hospital Partnership Guidelines</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 13. INTERACTIVE APPLICATION MODAL */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl bg-card">
          {!isSubmittedCard ? (
            <div>
              <DialogHeader className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <DialogTitle className="text-xl font-black">
                    Apply for Medical Discount Card
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs">
                  Fill in your details to receive an instant digital QR Health Card on your phone.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Select Card Plan *</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setApplicantTier('COMMUNITY')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        applicantTier === 'COMMUNITY'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                          : 'bg-muted/40 border-border text-muted-foreground'
                      }`}
                    >
                      <div>Free Welfare</div>
                      <div className="text-[10px] font-normal text-emerald-600">₹0 Free</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setApplicantTier('FAMILY')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        applicantTier === 'FAMILY'
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-700 dark:text-cyan-300 ring-2 ring-cyan-500/20'
                          : 'bg-muted/40 border-border text-muted-foreground'
                      }`}
                    >
                      <div>Family Care</div>
                      <div className="text-[10px] font-normal text-cyan-600">₹499/yr</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setApplicantTier('VIP')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        applicantTier === 'VIP'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                          : 'bg-muted/40 border-border text-muted-foreground'
                      }`}
                    >
                      <div>VIP Platinum</div>
                      <div className="text-[10px] font-normal text-amber-600">₹1,499/yr</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Primary Cardholder Full Name *
                  </label>
                  <Input
                    placeholder="e.g. Anand Sharma"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Mobile Number (For Digital Card) *
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Total Family Members Covered
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={applicantFamilyMembers}
                      onChange={(e) => setApplicantFamilyMembers(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border text-xs text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Instant Hospital Verification Guarantee
                  </div>
                  <p>
                    No pre-existing condition waiting period. Active immediately at all 1,500+ network hospitals.
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsApplyModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Generate Digital Card
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* Digital Card Generated View */
            <div className="space-y-6 text-center py-2">
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-foreground">
                  Your Health Card Is Ready!
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Card issued for <strong>{applicantName}</strong> & {applicantFamilyMembers} family members.
                </p>
              </div>

              {/* Digital Card Preview */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white text-left shadow-xl border border-white/15 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                      <HeartHandshake className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black tracking-wider text-cyan-300">
                      AAROGYA HEALTH CARD
                    </span>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-[10px] font-extrabold">
                    ACTIVE
                  </Badge>
                </div>

                <div className="font-mono text-base font-bold tracking-wider text-white mb-3">
                  8842 • 9710 • 3345 • 6789
                </div>

                <div className="flex items-end justify-between text-xs pt-2 border-t border-white/10">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">
                      Primary Cardholder
                    </div>
                    <div className="font-bold text-white text-sm">
                      {applicantName.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-cyan-300">
                      {applicantTier} Plan • {applicantFamilyMembers} Members
                    </div>
                  </div>
                  <div className="p-1 bg-white rounded-md">
                    <QrCode className="h-7 w-7 text-slate-950" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  onClick={() => {
                    toast.success('Digital Card image downloaded to your device!');
                  }}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Digital Card
                </Button>

                <Button
                  variant="outline"
                  onClick={handleResetApplication}
                  className="w-full"
                >
                  Close & Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
