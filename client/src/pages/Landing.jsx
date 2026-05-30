import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Leaf,
  Sprout,
  Sun,
  Cloud,
  Layers,
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  UploadCloud,
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Mail,
  Send,
  Search,
  Bell
} from 'lucide-react';

function RollingNumber({ value, className = "" }) {
  const valueString = String(value);
  return (
    <span className={`inline-flex items-center select-none ${className}`}>
      {valueString.split('').map((char, index) => {
        if (isNaN(parseInt(char, 10))) {
          return <span key={index} className="inline-block">{char}</span>;
        }
        return (
          <span key={index} className="relative h-[1.1em] w-[0.62em] inline-block overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={char}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Mobile check for layout fallback
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cardsContainerRef = useRef(null);

  // Horizontal Scroll Showcase configuration
  const showcaseRef = useRef(null);
  const { scrollYProgress: showcaseProgress } = useScroll({
    target: showcaseRef,
    offset: ["start start", "end end"]
  });

  // Sticky Horizontal Farming Showcase configuration
  const farmingCardsContainerRef = useRef(null);
  const farmingShowcaseRef = useRef(null);
  const { scrollYProgress: farmingProgress } = useScroll({
    target: farmingShowcaseRef,
    offset: ["start start", "end end"]
  });

  const showcaseX = useTransform(showcaseProgress, (latest) => {
    if (cardsContainerRef.current) {
      const parent = cardsContainerRef.current.parentElement;
      if (parent) {
        const range = cardsContainerRef.current.scrollWidth - parent.offsetWidth;
        return -latest * (range > 0 ? range : 0);
      }
    }
    return 0;
  });

  const farmingX = useTransform(farmingProgress, (latest) => {
    if (farmingCardsContainerRef.current) {
      const parent = farmingCardsContainerRef.current.parentElement;
      if (parent) {
        const range = farmingCardsContainerRef.current.scrollWidth - parent.offsetWidth;
        return -latest * (range > 0 ? range : 0);
      }
    }
    return 0;
  });

  const card1Scale = useTransform(farmingProgress, [0, 0.33], [1.02, 0.95]);
  const card2Scale = useTransform(farmingProgress, [0, 0.33, 0.66], [0.95, 1.02, 0.95]);
  const card3Scale = useTransform(farmingProgress, [0.33, 0.66, 1.00], [0.95, 1.02, 0.95]);
  const card4Scale = useTransform(farmingProgress, [0.66, 1.00], [0.95, 1.02]);

  // Pricing duration toggle
  const [isYearly, setIsYearly] = useState(true);

  const showcaseImages = [
    { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600', title: 'Smart Dashboards', desc: 'Central command telemetry mapping soil grids and operational assets.', category: 'Software' },
    { url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=600', title: 'AI Crop Health', desc: 'Real-time detection models analyzing crop growth timelines.', category: 'Intelligence' },
    { url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600', title: 'Drone Telemetry', desc: 'Spectral imaging mapping nitrogen deficits across fields.', category: 'Automation' },
    { url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600', title: 'IoT Sensors', desc: 'Live soil probes transmitting moisture data directly to cloud.', category: 'Hardware' },
    { url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600', title: 'Smart Cultivation', desc: 'Modern farmers utilizing tablets for precision input logs.', category: 'Operations' },
    { url: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=600', title: 'Automated Irrigation', desc: 'Valves triggering irrigation based on soil deficits.', category: 'Automation' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600', title: 'Yield Analytics', desc: 'Visual models predicting revenue and tonnage.', category: 'Software' },
    { url: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=600', title: 'Spectral Scanning', desc: 'Handheld diagnostic units verifying leaf thickness.', category: 'Intelligence' },
    { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600', title: 'Satellite Farming', desc: 'Orbit sensors capturing indices of crop health.', category: 'Software' },
    { url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=600', title: 'Greenhouse Automation', desc: 'Temperature, humidity, and CO2 auto-balanced.', category: 'Operations' },
    { url: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?q=80&w=600', title: 'Modern Tractors', desc: 'Autonomous guidance tractors logging fieldwork.', category: 'Hardware' },
    { url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=600', title: 'Soil Nutrition', desc: 'Live charts detailing NPK ratios and moisture levels.', category: 'Software' },
    { url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=600', title: 'Weather Models', desc: 'Microclimate models warning of impending storm.', category: 'Intelligence' },
    { url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=600', title: 'Precision Operations', desc: 'Farming machinery using GPS path guidance.', category: 'Operations' },
    { url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600', title: 'Sustainable Systems', desc: 'Eco-analytics tracking carbon footprints.', category: 'Software' },
    { url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600', title: 'Data Dashboards', desc: 'Cloud database panel logs syncing from nodes.', category: 'Software' },
    { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600', title: 'Agro ERP Platform', desc: 'GST billing, farmer payroll, and inventories.', category: 'Software' },
    { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600', title: 'Harvesting Robotics', desc: 'Automated picking arm logging crop coordinates.', category: 'Hardware' },
    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600', title: 'NPK Transmitters', desc: 'Chemical sensors logging soil data.', category: 'Hardware' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600', title: 'Conceptual Farms', desc: 'AI models planning field layout and rotations.', category: 'Intelligence' }
  ];

  // AI Crop Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResultReady, setScanResultReady] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // Interactive leaf selection
  const leafOptions = [
    {
      id: 'tomato',
      name: 'Tomato Leaf',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=300',
      disease: 'Early Blight (Alternaria)',
      risk: 'High Risk',
      riskClass: 'text-red-800 bg-red-105 bg-red-100',
      confidence: '98%',
      treatment: 'Apply copper-based fungicides immediately. Prune lower infected leaves.'
    },
    {
      id: 'corn',
      name: 'Corn Leaf',
      image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300',
      disease: 'Common Rust (Puccinia)',
      risk: 'Medium Risk',
      riskClass: 'text-amber-800 bg-amber-105 bg-amber-100',
      confidence: '87%',
      treatment: 'Apply recommended triazole fungicides. Optimize nitrogen applications.'
    },
    {
      id: 'wheat',
      name: 'Wheat Leaf',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300',
      disease: 'Septoria Tritici Blotches',
      risk: 'Low Risk',
      riskClass: 'text-emerald-800 bg-emerald-105 bg-emerald-100',
      confidence: '91%',
      treatment: 'Rotate crops next season. Select septoria-resistant wheat cultivars.'
    }
  ];
  
  const [selectedLeaf, setSelectedLeaf] = useState(leafOptions[1]); // Default to Corn

  // ROI Calculator states
  const [farmAcres, setFarmAcres] = useState(150);
  const [cropType, setCropType] = useState('corn'); // 'corn' | 'wheat' | 'soybeans'

  const getRoiMetrics = () => {
    let yieldMultiplier = 0.22;
    let basePricePerAcre = 650;
    if (cropType === 'wheat') {
      yieldMultiplier = 0.18;
      basePricePerAcre = 480;
    } else if (cropType === 'soybeans') {
      yieldMultiplier = 0.25;
      basePricePerAcre = 580;
    }

    const baselineRevenue = farmAcres * basePricePerAcre;
    const additionalRevenue = Math.round(baselineRevenue * yieldMultiplier);
    const fertilizerSavings = Math.round(farmAcres * 35);
    const waterSavings = Math.round(farmAcres * 4500);

    return {
      revenue: additionalRevenue.toLocaleString(),
      fertilizer: fertilizerSavings.toLocaleString(),
      water: waterSavings.toLocaleString()
    };
  };

  const roi = getRoiMetrics();

  // Testimonials Carousel state
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Live Dashboard Simulation States for premium landing experience
  const [dashboardData, setDashboardData] = useState({
    revenue: 14845,
    activeFields: 18,
    cropHealth: 94,
    yieldData: [40, 50, 45, 65, 75, 90],
    soilMoisture: 42,
    waterUsage: 1250,
    temperature: 28,
    humidity: 64,
    rainfall: 12,
    forecastChartData: [
      { name: 'Jun', yield: 4.2, baseline: 3.8 },
      { name: 'Jul', yield: 4.8, baseline: 3.9 },
      { name: 'Aug', yield: 5.1, baseline: 4.0 },
      { name: 'Sep', yield: 5.9, baseline: 4.1 },
      { name: 'Oct', yield: 6.4, baseline: 4.2 },
      { name: 'Nov', yield: 7.2, baseline: 4.3 }
    ],
    recentActivities: [
      { id: 1, type: "Irrigation completed", field: "Field A1", time: "2h ago" },
      { id: 2, type: "Fertilizer applied", field: "Field B3", time: "5h ago" }
    ],
    fields: [
      { id: "Field A1", crop: "Corn", status: "Healthy", statusClass: "bg-[#A7C957]/20 text-[#A7C957]" },
      { id: "Field B2", crop: "Wheat", status: "Moderate", statusClass: "bg-amber-500/20 text-amber-400" },
      { id: "Field C3", crop: "Soybean", status: "Alert", statusClass: "bg-rose-500/20 text-rose-400" }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(prev => {
        // Increment revenue slowly and steadily
        const nextRevenue = prev.revenue + Math.floor(Math.random() * 3) + 1;
        
        // Active fields can fluctuate slightly
        let nextFieldsCount = prev.activeFields;
        if (Math.random() < 0.1) {
          nextFieldsCount = Math.max(15, Math.min(20, prev.activeFields + (Math.random() > 0.5 ? 1 : -1)));
        }

        // Crop health fluctuates organically between 92% and 96%
        let nextHealth = prev.cropHealth + (Math.random() > 0.5 ? 1 : -1);
        if (nextHealth > 96) nextHealth = 96;
        if (nextHealth < 92) nextHealth = 92;

        // Shift yield chart values slightly
        const nextYield = prev.yieldData.map(h => {
          let change = Math.floor(Math.random() * 5) - 2; // -2 to +2
          let newH = h + change;
          if (newH > 95) newH = 95;
          if (newH < 20) newH = 20;
          return newH;
        });

        // Fluctuate soil moisture, temp, humidity, rainfall, and water usage
        const nextSoilMoisture = Math.max(38, Math.min(48, prev.soilMoisture + (Math.random() > 0.5 ? 1 : -1)));
        const nextWaterUsage = prev.waterUsage + Math.floor(Math.random() * 4) + 1;
        
        // Weather changes slowly and naturally (15% chance per second)
        const nextTemp = Math.random() < 0.15 ? Math.max(26, Math.min(32, prev.temperature + (Math.random() > 0.5 ? 1 : -1))) : prev.temperature;
        const nextHumidity = Math.random() < 0.15 ? Math.max(58, Math.min(70, prev.humidity + (Math.random() > 0.5 ? 1 : -1))) : prev.humidity;
        const nextRainfall = Math.random() < 0.1 ? Math.max(8, Math.min(18, prev.rainfall + (Math.random() > 0.5 ? 1 : -1))) : prev.rainfall;

        // Shift Recharts crop yield forecast line data slightly
        const nextForecastChartData = prev.forecastChartData.map(d => {
          const change = (Math.random() - 0.5) * 0.12;
          let newYield = Number((d.yield + change).toFixed(2));
          if (newYield < d.baseline - 0.1) newYield = d.baseline - 0.1;
          if (newYield > d.baseline + 3.8) newYield = d.baseline + 3.8;
          return { ...d, yield: newYield };
        });

        // Rotate recent activities
        let nextActivities = [...prev.recentActivities];
        if (Math.random() < 0.4) {
          const activityPool = [
            { type: "Irrigation completed", field: "Field A1", time: "Just now" },
            { type: "Fertilizer applied", field: "Field B3", time: "1m ago" },
            { type: "Harvesting started", field: "Field C2", time: "Just now" },
            { type: "Pest warning cleared", field: "Field A2", time: "3m ago" },
            { type: "Soil probe synced", field: "Field B1", time: "Just now" },
            { type: "Sensor calibration", field: "Field C3", time: "4m ago" }
          ];
          const newAct = activityPool[Math.floor(Math.random() * activityPool.length)];
          if (newAct.type !== prev.recentActivities[0].type) {
            nextActivities = [
              { id: Date.now(), ...newAct },
              { ...prev.recentActivities[0], time: "2h ago" }
            ].slice(0, 2);
          }
        }

        // Rotate field status states slightly
        const statuses = ["Healthy", "Moderate", "Alert"];
        const statusClasses = {
          Healthy: "bg-[#A7C957]/20 text-[#A7C957]",
          Moderate: "bg-amber-500/20 text-amber-400",
          Alert: "bg-rose-500/20 text-rose-400"
        };
        const nextFieldsStatus = prev.fields.map(f => {
          if (Math.random() < 0.2) {
            const currentIdx = statuses.indexOf(f.status);
            const nextIdx = (currentIdx + (Math.random() > 0.5 ? 1 : 2)) % 3;
            const newStatus = statuses[nextIdx];
            return {
              ...f,
              status: newStatus,
              statusClass: statusClasses[newStatus]
            };
          }
          return f;
        });

        return {
          revenue: nextRevenue,
          activeFields: nextFieldsCount,
          cropHealth: nextHealth,
          yieldData: nextYield,
          soilMoisture: nextSoilMoisture,
          waterUsage: nextWaterUsage,
          temperature: nextTemp,
          humidity: nextHumidity,
          rainfall: nextRainfall,
          forecastChartData: nextForecastChartData,
          recentActivities: nextActivities,
          fields: nextFieldsStatus
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Monitor active section & scroll direction for Navbar show/hide & highlight
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      setIsScrolled(currentScrollY > 20);

      // 1. Show/Hide Navbar based on scroll direction with a buffer to prevent jitter
      if (currentScrollY < 50) {
        setNavbarVisible(true);
      } else if (diff > 8) {
        setNavbarVisible(false); // scrolling down
      } else if (diff < -8) {
        setNavbarVisible(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;

      // 2. Active section highlights
      const sections = ['home', 'features', 'how-it-works', 'pricing', 'about'];
      const scrollPosition = currentScrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startDemoScan = () => {
    setIsScanning(true);
    setScanResultReady(false);
    setUploadedImage('https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=300');
    setTimeout(() => {
      setIsScanning(false);
      setScanResultReady(true);
    }, 2000);
  };

  const faqs = [
    {
      q: "What is AgriAI?",
      a: "AgriAI is a comprehensive smart agriculture management platform that leverages AI to monitor crop health, predict yields, analyze soil health, and streamline daily farm operations."
    },
    {
      q: "How does AI disease detection work?",
      a: "By uploading clear images of affected crop leaves, our advanced neural networks analyze the visual symptoms to identify diseases, assess risk levels, and suggest treatment options instantly."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your billing dashboard with no hassle."
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. We protect your farm records, financial logs, and telemetry inputs with enterprise-grade SSL encryption and secure cloud backups."
    }
  ];

  const testimonials = [
    {
      quote: "AgriAI has increased our crop yield by 40% and reduced costs significantly. It's like having an expert with us 24/7.",
      name: "Rajesh Kumar",
      role: "Wheat Farmer, Punjab",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"
    },
    {
      quote: "The AI disease detection is incredibly accurate. It helped us save our entire crop last season.",
      name: "Priya Sharma",
      role: "Corn Farmer, Maharashtra",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80"
    },
    {
      quote: "Weather alerts and soil recommendations help us plan better and make smarter decisions.",
      name: "Amit Yadav",
      role: "Soybean Farmer, MP",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80"
    }
  ];

  // Motion variants for viewport scroll entry/exit animations (Framer Motion)
  const fadeInScroll = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.15 },
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: false, amount: 0.1 }
  };

  const staggerChild = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, amount: 0.15 },
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, amount: 0.15 },
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
  };

  return (
    <div className="min-h-screen bg-[#F9FBF8] text-[#1B1B1B] font-sans selection:bg-[#236625] selection:text-white relative overflow-x-clip">
      
      {/* Background Floating Blurred Gradient Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#236625]/12 blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#2E7D32]/12 blur-[150px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute bottom-[15%] left-[5%] w-[450px] h-[450px] rounded-full bg-[#236625]/8 blur-[100px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Floating Global Leaf & Sprout Objects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
        <motion.div 
          animate={{ 
            y: [0, -35, 0], 
            rotate: [0, 45, 0],
            scale: [1, 1.05, 1],
            x: [0, 10, 0]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-[12%] left-[8%] text-[#236625]/20 w-9 h-9"
        >
          <Leaf className="w-full h-full" />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 40, 0], 
            rotate: [0, -60, 0],
            scale: [0.9, 1.02, 0.9],
            x: [0, -15, 0]
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-[28%] right-[10%] text-[#2E7D32]/20 w-11 h-11"
        >
          <Leaf className="w-full h-full transform -rotate-45" />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, -25, 0], 
            rotate: [0, 90, 0],
            scale: [0.85, 0.95, 0.85],
            x: [0, 12, 0]
          }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          className="absolute top-[55%] left-[5%] text-[#236625]/20 w-8 h-8"
        >
          <Sprout className="w-full h-full" />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 35, 0], 
            rotate: [0, 35, 0],
            scale: [1, 1.1, 1],
            x: [0, -8, 0]
          }}
          transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
          className="absolute top-[72%] right-[8%] text-[#236625]/20 w-10 h-10"
        >
          <Leaf className="w-full h-full" />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, -30, 0], 
            rotate: [0, -45, 0],
            scale: [0.95, 1.05, 0.95],
            x: [0, 10, 0]
          }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute top-[88%] left-[12%] text-[#2E7D32]/20 w-9 h-9"
        >
          <Leaf className="w-full h-full" />
        </motion.div>
      </div>

      {/* 1. Fixed Glassmorphic Navbar inside wrapper */}
      <div className="h-20 z-50 relative">
        <header className={`fixed top-0 left-0 right-0 h-20 z-50 transition-all duration-300 transform ${navbarVisible ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'bg-[#E8F5E9]/90 backdrop-blur-lg border-b border-[#D8EAD8]/60 shadow-[0_4px_30px_rgba(22,163,74,0.05)]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-r from-[#236625] to-[#2E7D32] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#236625]/20">
              <Leaf className="w-5.5 h-5.5" />
            </div>
            <span className="text-2xl font-black text-[#236625] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              AgriAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-[#6B7280]">
            <a href="#home" className={`hover:text-[#236625] transition-colors py-1 relative ${activeSection === 'home' ? 'text-[#236625]' : ''}`}>
              Home
              {activeSection === 'home' && <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#236625] rounded-full" />}
            </a>
            <a href="#features" className={`hover:text-[#236625] transition-colors py-1 relative ${activeSection === 'features' ? 'text-[#236625]' : ''}`}>
              Features
              {activeSection === 'features' && <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#236625] rounded-full" />}
            </a>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#236625] transition-colors py-1">
              <span>Solutions</span>
              <ChevronDown className="w-4 h-4 text-[#64748B]/80 group-hover:text-[#236625]" />
            </div>
            <a href="#how-it-works" className={`hover:text-[#236625] transition-colors py-1 relative ${activeSection === 'how-it-works' ? 'text-[#236625]' : ''}`}>
              How It Works
              {activeSection === 'how-it-works' && <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#236625] rounded-full" />}
            </a>
            <a href="#pricing" className={`hover:text-[#236625] transition-colors py-1 relative ${activeSection === 'pricing' ? 'text-[#236625]' : ''}`}>
              Pricing
              {activeSection === 'pricing' && <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#236625] rounded-full" />}
            </a>
            <a href="#about" className={`hover:text-[#236625] transition-colors py-1 relative ${activeSection === 'about' ? 'text-[#236625]' : ''}`}>
              About Us
              {activeSection === 'about' && <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#236625] rounded-full" />}
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/login" className="text-sm font-black text-[#6B7280] hover:text-[#236625] transition-colors">
              Log In
            </Link>
            <Link 
              to="/login"
              className="flex items-center gap-2 bg-gradient-to-r from-[#236625] to-[#2E7D32] hover:from-[#1B521D] hover:to-[#1B521D] text-white px-5.5 py-3 rounded-xl font-bold text-sm shadow-md shadow-[#236625]/10 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-[#6B7280] hover:text-[#236625] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#E8F5E9]/95 backdrop-blur-md border-b border-[#D8EAD8] overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4 text-base font-bold text-[#1B1B1B]">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#236625]">Features</a>
                <span className="hover:text-[#236625] cursor-pointer">Solutions</span>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#236625]">How It Works</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#236625]">Pricing</a>
                <span className="hover:text-[#236625] cursor-pointer">About Us</span>
                <div className="h-px bg-[#D8EAD8] my-2" />
                <Link to="/login" className="hover:text-[#236625]">Log In</Link>
                <Link 
                  to="/login"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#236625] to-[#2E7D32] text-white py-3.5 rounded-xl font-bold transition-all text-center shadow-lg shadow-[#236625]/10"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      </div>

      {/* 2. Hero Section with Terraced Fields Background */}
      <section id="home" className="relative overflow-hidden pt-20 lg:pt-32 pb-32 bg-[#F9FBF8] z-10">
        
        {/* Full-width landscape field background - blended with low opacity for organic SaaS depth */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{
              scale: [1, 1.05, 1],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-cover bg-bottom opacity-[0.22]"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop)',
              filter: 'saturate(1.1) contrast(1.02)'
            }}
          />
          {/* Blend layout gradient to the cream page body */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9FBF8]/10 via-[#F9FBF8]/60 to-[#F9FBF8]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column with premium organic glassmorphic panel */}
            <motion.div 
              {...fadeInScroll}
              className="lg:col-span-6 flex flex-col items-start bg-[#E8F5E9]/75 backdrop-blur-md border border-[#D8EAD8] p-8 sm:p-10 rounded-[32px] shadow-2xl relative overflow-hidden"
            >
              {/* Premium background animated glow inside the card */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#236625]/12 rounded-full blur-3xl animate-pulse pointer-events-none" />

              <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#236625] px-4 py-2 rounded-full text-xs font-black tracking-wide uppercase mb-6 shadow-sm border border-[#D8EAD8]/60 relative z-10">
                <Sparkles className="w-3.5 h-3.5 text-[#236625] animate-spin" style={{ animationDuration: '3s' }} />
                <span>AI-Powered Agriculture</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl xl:text-6.5xl font-black text-[#1B1B1B] tracking-tight leading-[1.08] mb-6 relative z-10" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Smart Agriculture <br />
                Management <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#236625] to-[#236625] filter drop-shadow-sm">Powered by AI</span>
              </h1>
              
              <p className="text-base sm:text-lg text-[#6B7280] font-semibold leading-relaxed max-w-xl mb-8 relative z-10">
                Manage crops, fields, operations, and finances from one intelligent platform. Make data-driven decisions and grow your productivity.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 w-full sm:w-auto mb-8 relative z-10">
                <Link 
                  to="/login"
                  className="flex-grow sm:flex-grow-0 bg-gradient-to-r from-[#236625] to-[#2E7D32] hover:from-[#1B521D] hover:to-[#1B521D] text-white px-8 py-4.5 rounded-xl font-bold text-center shadow-lg shadow-[#236625]/15 hover:scale-[1.03] transition-all cursor-pointer"
                >
                  Start Free Trial
                </Link>
                <button 
                  onClick={() => navigate('/login')}
                  className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2.5 bg-[#E8F5E9]/70 backdrop-blur-sm border border-[#D8EAD8] text-[#236625] px-8 py-4.5 rounded-xl font-bold hover:bg-[#E8F5E9] hover:scale-[1.03] transition-all shadow-sm cursor-pointer"
                >
                  <Play className="w-4.5 h-4.5 text-[#236625] fill-[#236625]" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Sub features indicators list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-black text-[#6B7280] uppercase tracking-wide border-t border-[#D8EAD8] pt-6 w-full relative z-10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#236625]" />
                  <div>
                    <p className="font-black text-[#236625]">14-Day Free Trial</p>
                    <p className="text-[10px] text-[#6B7280] font-bold lowercase">No credit card</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#236625]" />
                  <div>
                    <p className="font-black text-[#236625]">Cancel Anytime</p>
                    <p className="text-[10px] text-[#6B7280] font-bold lowercase">No hassle</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#236625]" />
                  <div>
                    <p className="font-black text-[#236625]">Secure Data</p>
                    <p className="text-[10px] text-[#6B7280] font-bold lowercase">Your data is safe</p>
                  </div>
                </div>
              </div>

              {/* Farmer Social Proof */}
              <div className="mt-8 flex items-center gap-3 relative z-10">
                <div className="flex -space-x-2">
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" alt="" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=60" alt="" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=60" alt="" />
                </div>
                <div className="text-[11px] font-bold text-[#6B7280]">
                  <p className="font-black text-[#1B1B1B]">Trusted by 10,000+ farmers</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                    <span>4.9/5 from 1,200+ Reviews</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Dashboard Mockup Column */}
            <motion.div 
              {...slideInRight}
              className="lg:col-span-6 z-10"
            >
              <div className="relative max-w-xl mx-auto">
                {/* Floating Widget 1 */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  style={{ top: '-48px', right: '20px' }}
                  className="absolute z-25 bg-[#E8F5E9] border border-[#D8EAD8] p-3.5 rounded-2xl shadow-[0_10px_30px_rgba(22,163,74,0.06)] flex items-center gap-3 hidden sm:flex w-max"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#236625]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black text-[#6B7280]">AI Yield Forecast</p>
                    <p className="text-xs font-black text-[#236625]">+28% efficiency boost</p>
                  </div>
                </motion.div>
                {/* Floating Widget 2 */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                  style={{ bottom: '-60px', right: '20px' }}
                  className="absolute z-25 bg-gradient-to-r from-[#236625] to-[#2E7D32] p-4 rounded-2xl border border-[#D8EAD8]/20 shadow-[0_10px_35px_rgba(22,163,74,0.15)] flex items-center gap-3.5 text-white hidden sm:flex w-max"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9]/20 flex items-center justify-center text-white">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black text-white/80">Weather Alert</p>
                    <p className="text-xs font-bold text-white">Optimal watering window</p>
                  </div>
                </motion.div>

                {/* Premium Dashboard UI Mockup */}
                <div className="w-full bg-[#E8F5E9]/80 rounded-[24px] shadow-2xl border border-[#D8EAD8] backdrop-blur-sm overflow-hidden hover:shadow-[#236625]/5 hover:border-[#236625]/40 transition-all duration-500">
                <div className="h-10 bg-[#E8F5E9] px-4 flex items-center justify-between border-b border-[#D8EAD8]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#236625]/20" />
                    <div className="w-3 h-3 rounded-full bg-[#236625]/20" />
                    <div className="w-3 h-3 rounded-full bg-[#236625]/20" />
                  </div>
                  <div className="w-4" />
                </div>
                <div className="p-6 bg-[#E8F5E9] text-[#4A5568]">
                  
                  {/* Dashboard Header & Weather */}
                  <div className="flex justify-end items-center mb-5">
                    {/* Mini Weather Analytics Card */}
                    <div className="bg-[#E8F5E9] border border-[#D8EAD8]/60 rounded-xl px-3 py-1.5 flex items-center gap-3 text-[10px] font-black text-[#236625]">
                      <div className="flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                        <RollingNumber value={dashboardData.temperature} />°C
                      </div>
                      <div className="w-px h-3 bg-[#D8EAD8]" />
                      <div className="flex items-center gap-1">
                        <Cloud className="w-3.5 h-3.5 text-sky-400" />
                        <RollingNumber value={dashboardData.humidity} />% RH
                      </div>
                      <div className="w-px h-3 bg-[#D8EAD8]" />
                      <div className="flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                        <RollingNumber value={dashboardData.rainfall} />mm Rain
                      </div>
                    </div>
                  </div>

                  {/* Cards Row / Telemetry Widgets */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-[#E8F5E9]/80 p-3 rounded-xl border border-[#D8EAD8]/50 hover:border-[#236625]/30 transition-colors flex flex-col justify-between">
                      <p className="text-[9px] uppercase font-black text-[#6B7280]">Total Revenue</p>
                      <div className="flex items-center leading-none text-xl sm:text-2xl lg:text-[2rem] font-bold text-[#236625] mt-1 select-none">
                        <span>₹<RollingNumber value={dashboardData.revenue.toLocaleString('en-IN')} /></span>
                      </div>
                      <span className="text-[8px] text-[#236625] font-black mt-1 block">
                        +12.4% vs last year
                      </span>
                    </div>
                    <div className="bg-[#E8F5E9]/80 p-3 rounded-xl border border-[#D8EAD8]/50 hover:border-[#236625]/30 transition-colors flex flex-col justify-between">
                      <p className="text-[9px] uppercase font-black text-[#6B7280]">Soil Moisture</p>
                      <div className="flex items-center leading-none text-xl sm:text-2xl lg:text-[2rem] font-bold text-[#236625] mt-1 select-none">
                        <span><RollingNumber value={dashboardData.soilMoisture} />%</span>
                      </div>
                      <span className="text-[8px] text-emerald-600 font-black mt-1 block">
                        Optimal Range
                      </span>
                    </div>
                    <div className="bg-[#E8F5E9]/80 p-3 rounded-xl border border-[#D8EAD8]/50 hover:border-[#236625]/30 transition-colors flex flex-col justify-between">
                      <p className="text-[9px] uppercase font-black text-[#6B7280]">Water Usage</p>
                      <div className="flex items-center leading-none text-xl sm:text-2xl lg:text-[2rem] font-bold text-[#236625] mt-1 select-none">
                        <span><RollingNumber value={dashboardData.waterUsage.toLocaleString()} /> Gal</span>
                      </div>
                      <span className="text-[8px] text-sky-600 font-black mt-1 block">
                        -18% Optimized
                      </span>
                    </div>
                  </div>

                  {/* Chart and Circular Progress */}
                  <div className="grid grid-cols-12 gap-3 mb-5">
                    {/* Animated Line Chart (Yield Forecast) */}
                    <div className="col-span-7 bg-[#E8F5E9]/80 p-4 rounded-xl border border-[#D8EAD8]/50 flex flex-col justify-between h-44">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[9px] uppercase font-black text-[#6B7280]">ML Yield Forecast (T/Acre)</p>
                        <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Projection</span>
                      </div>
                      <div className="w-full h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dashboardData.forecastChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="yieldColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#236625" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#236625" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 8, fill: '#6B7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} domain={[2, 9]} />
                            <Tooltip 
                              contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #D8EAD8', borderRadius: '8px', fontSize: '9px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                              labelStyle={{ color: '#236625' }}
                            />
                            <Area type="monotone" dataKey="yield" name="AI Projected" stroke="#236625" strokeWidth={2} fillOpacity={1} fill="url(#yieldColor)" />
                            <Area type="monotone" dataKey="baseline" name="Traditional" stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3 3" fillOpacity={0} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Crop Health Premium Glassmorphic Card */}
                    <div className="col-span-5 bg-gradient-to-br from-[#236625] via-[#114022] to-[#0A2614] p-4.5 rounded-[22px] shadow-xl border border-white/10 flex flex-col items-center justify-between text-center relative overflow-hidden group select-none h-44">
                      {/* Pulsing ambient glow */}
                      <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                      
                      {/* Floating particles (ambient animation) */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-hidden pointer-events-none">
                        <motion.div animate={{ y: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-4 left-6 w-1 h-1 bg-emerald-400 rounded-full blur-[0.5px]" />
                        <motion.div animate={{ y: [15, -15, 15], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[0.5px]" />
                        <motion.div animate={{ y: [-5, 10, -5], opacity: [0.1, 0.4, 0.1] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-12 right-12 w-1 h-1 bg-emerald-300 rounded-full blur-[0.5px]" />
                      </div>

                      <div className="w-full flex justify-between items-center z-10">
                        <span className="text-[9px] uppercase font-black text-emerald-400/80 tracking-wider">Crop Health</span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-[8px] font-black text-emerald-400 tracking-wider">LIVE</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-3 w-full my-auto z-10">
                        {/* Circular Progress with Gradient */}
                        <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <defs>
                              <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#2E7D32" />
                                <stop offset="100%" stopColor="#059669" />
                              </linearGradient>
                            </defs>
                            <path
                              className="text-white/5"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <motion.path
                              strokeWidth="3.5"
                              strokeDasharray={`${dashboardData.cropHealth}, 100`}
                              strokeLinecap="round"
                              stroke="url(#healthGrad)"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              animate={{ strokeDasharray: `${dashboardData.cropHealth}, 100` }}
                              transition={{ duration: 1 }}
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-xs font-black text-white leading-none">
                              <RollingNumber value={dashboardData.cropHealth} />%
                            </span>
                          </div>
                        </div>

                        {/* Real-time KPI Details */}
                        <div className="text-left space-y-1 text-white/90 text-[8px] font-bold">
                          <div className="flex items-center gap-1 text-emerald-400">
                            <span>↗ Growth +12%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span>Disease Risk Low</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-300" />
                            <span>Soil Excellent</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/60">
                            <span className="w-1 h-1 rounded-full bg-emerald-500/50" />
                            <span>AI Active</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full border-t border-white/5 pt-1.5 mt-auto z-10 flex justify-between items-center text-[7px] text-white/40 uppercase tracking-widest font-black">
                        <span>Systems Nominal</span>
                        <span>v2.8</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation Banner */}
                  <div className="bg-[#236625] text-white p-3 rounded-xl mb-4 flex items-center gap-3 border border-emerald-800 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-[#E8F5E9]/10 flex items-center justify-center text-white flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                    </div>
                    <div className="text-[9px] font-bold leading-relaxed text-white/95 text-left">
                      <span className="font-black text-[#2E7D32]">AI Recommendation:</span> Soil hydration levels optimized. Scheduled Field A1 sprinkler suspension. Saving ~240 Gal water.
                    </div>
                  </div>

                  {/* Field Status cards */}
                  <div className="grid grid-cols-3 gap-3 text-[10px]">
                    {dashboardData.fields.map((f) => (
                      <div key={f.id} className="bg-[#E8F5E9]/80 p-2.5 rounded-lg border border-[#D8EAD8]/50 flex justify-between items-center transition-all duration-300 hover:border-[#236625]/30">
                        <div>
                          <p className="font-black text-[#236625]">{f.id}</p>
                          <p className="text-[9px] text-[#6B7280] font-semibold">{f.crop}</p>
                        </div>
                        <span className={`${
                          f.status === 'Healthy' ? 'bg-[#236625]/20 text-[#236625]' :
                          f.status === 'Moderate' ? 'bg-amber-500/20 text-amber-600' :
                          'bg-rose-500/20 text-rose-600'
                        } px-1.5 py-0.5 rounded font-black transition-all duration-500`}>
                          {f.status}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Mobile Fallback: Place cards below dashboard in a stack on mobile screens */}
                <div className="flex sm:hidden flex-col gap-3 mt-6 w-full">
                  <div className="bg-[#E8F5E9] border border-[#D8EAD8] p-3.5 rounded-2xl shadow-[0_10px_30px_rgba(22,163,74,0.06)] flex items-center gap-3 w-full">
                    <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#236625] flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] uppercase font-black text-[#6B7280]">AI Yield Forecast</p>
                      <p className="text-xs font-black text-[#236625]">+28% efficiency boost</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-[#236625] to-[#2E7D32] p-4 rounded-2xl border border-[#D8EAD8]/20 shadow-[0_10px_35px_rgba(22,163,74,0.15)] flex items-center gap-3.5 text-white w-full">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5E9]/20 flex items-center justify-center text-white flex-shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] uppercase font-black text-white/80">Weather Alert</p>
                      <p className="text-xs font-bold text-white">Optimal watering window</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Sticky Horizontal Farming Showcase */}
      <section 
        ref={farmingShowcaseRef} 
        id="farming-showcase" 
        className="relative z-10 bg-gradient-to-b from-white via-[#E8F5E9] to-white text-[#1B1B1B]"
        style={{ height: isMobile ? 'auto' : '300vh' }}
      >
        {isMobile ? (
          <div className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-[#236625]/10 text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border border-[#236625]/20">
                SMART AGRICULTURE
              </span>
              <h2 className="text-3xl font-black text-[#236625] mt-4 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Experience the Future of Modern Farming
              </h2>
              <p className="text-[#64748B] font-semibold text-sm mt-3 max-w-xl mx-auto">
                Discover how technology and sustainable farming combine to create smarter, more efficient agriculture.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {[
                {
                  title: "Modern Green Farmland",
                  desc: "Wide aerial crop fields bathed in golden sunlight.",
                  url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200"
                },
                {
                  title: "Farmer with Smart Agriculture",
                  desc: "Modern farming technology blending naturally with field operations.",
                  url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1200"
                },
                {
                  title: "Irrigation & Healthy Crops",
                  desc: "Water irrigation systems delivering hydration under warm sun reflections.",
                  url: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=1200"
                },
                {
                  title: "Drone Farming Technology",
                  desc: "Autonomous drone telemetry scanning fields during a dramatic sunset.",
                  url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200"
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-80 rounded-[24px] overflow-hidden border border-[#D8EAD8] shadow-2xl relative group"
                >
                  <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#E8F5E9]/90 backdrop-blur-md rounded-2xl border border-[#D8EAD8] text-[#1B1B1B]">
                    <h4 className="text-base font-black text-[#236625]">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
            {/* Header Content */}
            <div className="max-w-7xl mx-auto px-6 w-full text-center mb-12 relative z-20">
              <motion.div 
                {...fadeInScroll}
                className="inline-flex items-center gap-2 bg-[#236625]/10 text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-4 border border-[#236625]/20"
              >
                <span>SMART AGRICULTURE</span>
              </motion.div>
              <motion.h2 
                {...fadeInScroll}
                className="text-4xl lg:text-5xl font-black text-[#236625] tracking-tight"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Experience the Future of Modern Farming
              </motion.h2>
              <motion.p 
                {...fadeInScroll}
                className="text-[#64748B] font-semibold text-base mt-4 max-w-2xl mx-auto"
              >
                Discover how technology and sustainable farming combine to create smarter, more efficient agriculture.
              </motion.p>
            </div>

            {/* Horizontal Cards Area */}
            <div className="w-full flex items-center relative z-10">
              <motion.div 
                farmingCardsContainerRef
                ref={farmingCardsContainerRef}
                style={{ x: farmingX }}
                className="flex gap-12 px-[20vw] w-max"
              >
                {[
                  {
                    title: "Modern Green Farmland",
                    desc: "Wide aerial crop fields bathed in golden sunlight.",
                    url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200"
                  },
                  {
                    title: "Farmer with Smart Agriculture",
                    desc: "Modern farming technology blending naturally with field operations.",
                    url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1200"
                  },
                  {
                    title: "Irrigation & Healthy Crops",
                    desc: "Water irrigation systems delivering hydration under warm sun reflections.",
                    url: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=1200"
                  },
                  {
                    title: "Drone Farming Technology",
                    desc: "Autonomous drone telemetry scanning fields during a dramatic sunset.",
                    url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200"
                  }
                ].map((item, idx) => {
                  const scales = [card1Scale, card2Scale, card3Scale, card4Scale];
                  return (
                    <motion.div 
                      key={idx}
                      style={{ scale: scales[idx] }}
                      className="w-[60vw] md:w-[45vw] h-[45vh] md:h-[50vh] flex-shrink-0 relative rounded-[32px] overflow-hidden shadow-2xl border border-[#D8EAD8] group transition-all duration-500 bg-[#E8F5E9]"
                    >
                      <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#E8F5E9]/90 backdrop-blur-md rounded-2xl border border-[#D8EAD8] text-[#1B1B1B]">
                        <h4 className="text-lg font-black text-[#236625]">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 font-semibold">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Glowing background highlights */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#236625]/8 rounded-full blur-[160px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#2E7D32]/8 rounded-full blur-[140px] pointer-events-none z-0" />
          </div>
        )}
      </section>

      {/* 3. Stats Row */}
      <section className="bg-gradient-to-r from-[#236625] to-[#86EFAC] text-[#236625] py-20 md:py-24 border-y border-[#2E7D32]/30 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-center justify-center text-center"
          >
            {[
              { num: "45%", label: "Increase in Yield" },
              { num: "60%", label: "Reduction in Costs" },
              { num: "24/7", label: "AI Monitoring" },
              { num: "10K+", label: "Happy Farmers" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                variants={staggerChild}
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-[#E8F5E9]/90 border border-[#D8EAD8]/30 hover:border-[#236625] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#236625] tracking-tight drop-shadow-[0_0_20px_rgba(22,163,74,0.15)]">
                  {stat.num}
                </span>
                <span className="text-xs sm:text-sm md:text-base uppercase font-black text-[#236625] mt-3 tracking-wider max-w-[200px] text-center leading-snug">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section id="features" className="py-32 bg-[#F9FBF8] relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-[0.03] bg-cover bg-center pointer-events-none mix-blend-overlay"
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?q=80&w=2000)' }} />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          
          <motion.div {...fadeInScroll} className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-4 border border-[#D8EAD8]">
            <span>Powerful Features</span>
          </motion.div>
          <motion.h2 
            {...fadeInScroll}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#236625] tracking-tight mb-20"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Everything You Need to Succeed
          </motion.h2>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Sprout className="w-6 h-6 text-[#236625]" />,
                title: "Crop Management",
                desc: "Plan, monitor, and manage your crops throughout their lifecycle."
              },
              {
                icon: <Zap className="w-6 h-6 text-[#236625]" />,
                title: "AI Disease Detection",
                desc: "Detect diseases early with AI-powered image analysis."
              },
              {
                icon: <Cloud className="w-6 h-6 text-[#236625]" />,
                title: "Weather Intelligence",
                desc: "Real-time weather updates and forecasts for better planning."
              },
              {
                icon: <Activity className="w-6 h-6 text-[#236625]" />,
                title: "Soil Health Monitoring",
                desc: "Monitor soil health and get personalized recommendations."
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-[#236625]" />,
                title: "Financial Management",
                desc: "Track expenses, revenue, and profitability in real-time."
              },
              {
                icon: <Layers className="w-6 h-6 text-[#236625]" />,
                title: "Smart Analytics",
                desc: "Get insights and reports to make data-driven decisions."
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                variants={staggerChild}
                whileHover={{ y: -8, scale: 1.01 }}
                className={`bg-[#E8F5E9] border border-[#D8EAD8] p-10 rounded-[32px] shadow-sm text-left flex flex-col items-start group hover:border-[#236625] hover:bg-[#E8F5E9] hover:shadow-xl hover:shadow-[#236625]/5 transition-all duration-300 relative overflow-hidden ${i === 0 || i === 3 || i === 5 ? 'lg:col-span-2' : 'lg:col-span-1'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center mb-6 group-hover:bg-[#236625] group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#236625]/20">
                  {React.cloneElement(f.icon, { className: 'w-6 h-6 text-[#236625] group-hover:text-white transition-colors' })}
                </div>
                <h3 className="text-xl font-black text-[#236625] mb-2">{f.title}</h3>
                <p className="text-sm font-semibold text-[#6B7280] leading-relaxed">{f.desc}</p>
                
                {/* Subtle border gradient indicator on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#236625] to-[#2E7D32] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4.5 Cinematic Horizontal Scroll Showcase */}
      <section ref={showcaseRef} className="relative h-auto lg:h-[180vh] bg-gradient-to-b from-[#E8F5E9] via-[#F9FBF8] to-white text-[#1B1B1B] z-20 py-16 lg:py-0">
        <div className="relative lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center overflow-hidden">
          
          {/* Section Header */}
          <div className="max-w-7xl mx-auto px-6 mb-12 w-full z-10 text-left">
            <div className="inline-flex items-center gap-2 bg-[#236625]/10 text-[#236625] px-4 py-2 rounded-full text-xs font-black tracking-wide uppercase mb-4 border border-[#236625]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#236625] animate-pulse" />
              <span>AgriAI Operations</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#236625] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Operational Field Showcase
            </h2>
            <p className="text-sm font-semibold text-[#64748B] mt-2 max-w-2xl">
              Scroll down to watch our smart technology orchestrating yield enhancements across farms globally.
            </p>
          </div>

          {/* Scrolling image cards row */}
          <motion.div 
            ref={cardsContainerRef}
            style={{ x: isMobile ? 0 : showcaseX }} 
            className="flex gap-6 px-6 lg:px-12 z-10 w-full lg:w-max overflow-x-auto lg:overflow-x-visible scrollbar-none snap-x snap-mandatory"
          >
            {showcaseImages.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={isMobile ? {} : { scale: 1.03, y: -6 }}
                className="w-72 sm:w-80 h-[380px] rounded-2xl border border-[#D8EAD8] bg-[#E8F5E9] overflow-hidden relative group shadow-lg hover:shadow-[#236625]/10 hover:border-[#236625] transition-all duration-300 flex-shrink-0 snap-center"
              >
                <img src={item.url} className="w-full h-[60%] object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} loading="lazy" />
                <div className="p-5 h-[40%] flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#236625]">{item.title}</h3>
                    <p className="text-[10px] font-semibold text-[#64748B] mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-black text-[#236625] uppercase tracking-wide border-t border-[#D8EAD8]/40 pt-2">
                    <span>{item.category}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#236625]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Background decorative glow in dark section */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#236625]/8 rounded-full blur-3xl pointer-events-none z-0" />
        </div>
      </section>

      {/* 5. How It Works - Timeline Flow */}
      <section id="how-it-works" className="py-32 bg-[#F9FBF8] border-t border-[#D8EAD8] relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-[0.04] bg-cover bg-center pointer-events-none mix-blend-overlay"
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000)' }} />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeInScroll} className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-4 border border-[#D8EAD8]">
            <span>How It Works</span>
          </motion.div>
          <motion.h2 
            {...fadeInScroll}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#236625] tracking-tight mb-20"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Simple Steps to Smarter Farming
          </motion.h2>

          <div className="relative">
            {/* Horizontal Timeline Connector Line with custom green layout */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-[#D8EAD8] z-0">
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                className="h-full bg-[#236625] origin-left"
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
            >
              {[
                { step: "01", title: "Add Your Farm", desc: "Set up your fields, crops, and farm details." },
                { step: "02", title: "AI Analysis", desc: "Our AI analyzes data from satellite, weather, and sensors." },
                { step: "03", title: "Get Insights", desc: "Receive actionable insights and recommendations." },
                { step: "04", title: "Improve & Grow", desc: "Take action and see measurable improvements in yield." }
              ].map((s, idx) => (
                <motion.div key={idx} variants={staggerChild} className="flex flex-col items-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#236625] to-[#2E7D32] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#236625]/15 mb-5 text-xl font-black border-4 border-white group-hover:from-[#1B521D] group-hover:to-[#1B521D] group-hover:scale-105 transition-all duration-300">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-black text-[#236625] mb-2">{s.title}</h3>
                  <p className="text-xs font-semibold text-[#6B7280] max-w-[200px] leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Intelligent Crop Health Diagnosis / Leaf Upload */}
      <section className="py-32 bg-gradient-to-br from-[#E8F5E9] via-[#E8F5E9]/40 to-[#E8F5E9] text-[#1B1B1B] overflow-hidden relative z-10 border-t border-[#D8EAD8]">
        <div className="absolute top-0 right-0 w-[45%] h-full opacity-10 bg-[#236625] filter blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Info Column */}
            <motion.div 
              {...slideInLeft}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center gap-2 bg-[#E8F5E9]/90 border border-[#D8EAD8] text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-6 shadow-sm">
                <span>AI Disease Diagnosis</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#236625] tracking-tight leading-tight mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Detect Problems Early. <br />Save Your Crop.
              </h2>
              <p className="text-sm sm:text-base text-[#6B7280] font-semibold leading-relaxed mb-6">
                Select a crop type to test scan, or upload your own leaf image. Our AI analyzes details instantly.
              </p>

              {/* Dynamic Leaf Selector Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {leafOptions.map((leaf) => (
                  <button
                    key={leaf.id}
                    onClick={() => {
                      setSelectedLeaf(leaf);
                      setScanResultReady(false);
                      setUploadedImage(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${selectedLeaf.id === leaf.id ? 'bg-[#236625] border-[#236625] text-white shadow-lg shadow-[#236625]/10 scale-[1.02]' : 'bg-[#E8F5E9] border-[#D8EAD8] text-[#236625] hover:bg-[#E8F5E9]'}`}
                  >
                    {leaf.name}
                  </button>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "Instant disease detection",
                  "High accuracy AI model",
                  "Treatment recommendations",
                  "Save time and increase yield"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[#236625]/10 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-[#236625]" />
                    </div>
                    <span className="text-sm font-bold text-[#236625]">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={startDemoScan}
                className="flex items-center gap-2 bg-gradient-to-r from-[#236625] to-[#2E7D32] hover:from-[#1B521D] hover:to-[#1B521D] text-white font-extrabold px-6 py-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#236625]/10 hover:scale-[1.02]"
              >
                <span>Scan {selectedLeaf.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Upload Area & Result Row */}
            <motion.div 
              {...slideInRight}
              className="lg:col-span-7 grid md:grid-cols-2 gap-6 items-stretch"
            >
              
              {/* Image Uploader Mockup */}
              <div 
                onClick={startDemoScan}
                className="bg-[#E8F5E9] rounded-[24px] border-2 border-dashed border-[#2E7D32] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#236625] hover:bg-[#E8F5E9]/40 transition-all duration-300 h-72 md:h-auto relative overflow-hidden shadow-sm"
              >
                {uploadedImage || isScanning ? (
                  <>
                    <img src={uploadedImage || selectedLeaf.image} className="absolute inset-0 w-full h-full object-cover z-0" alt="Leaf upload" />
                    {isScanning && (
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="absolute left-0 w-full h-1 bg-[#236625] shadow-[0_0_15px_#236625] z-10"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 z-0" />
                    <span className="relative z-10 bg-[#E8F5E9]/90 text-[#236625] px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase border border-[#D8EAD8]">
                      {isScanning ? 'Scanning Leaf...' : 'Scan Complete'}
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-12 h-12 text-[#236625] mb-4 animate-bounce" style={{ animationDuration: '3s' }} />
                    <h4 className="text-sm font-black text-[#236625] mb-1">Drag & drop or click</h4>
                    <p className="text-xs font-semibold text-[#6B7280] mb-4">to upload leaf photo</p>
                    <span className="text-[10px] font-black text-[#236625]/50 bg-[#E8F5E9] px-3 py-1 rounded-md border border-[#D8EAD8]">.JPG, .PNG up to 5MB</span>
                  </div>
                )}
              </div>

              {/* Diagnosis Result Card */}
              <div className="bg-[#E8F5E9] text-[#1B1B1B] rounded-[24px] p-8 shadow-xl border border-[#D8EAD8] flex flex-col justify-between hover:border-[#236625]/20 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-[10px] uppercase font-black tracking-wider text-[#64748B]/80">Diagnosis Result</h4>
                    {scanResultReady && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${selectedLeaf.riskClass}`}>
                        {selectedLeaf.risk}
                      </span>
                    )}
                  </div>

                  {scanResultReady ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-extrabold text-[#64748B]/80">Crop Health Status</p>
                        <p className="text-sm font-black text-[#1B1B1B] mt-0.5">{selectedLeaf.name} - {selectedLeaf.disease}</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-[#F5E6D3] mb-1.5">
                          <span>Confidence Score</span>
                          <span className="text-[#236625] font-extrabold">{selectedLeaf.confidence}</span>
                        </div>
                        <div className="h-2 w-full bg-[#E8F5E9] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: selectedLeaf.confidence }}
                            transition={{ duration: 1 }}
                            className="h-full bg-[#236625] rounded-full" 
                          />
                        </div>
                      </div>
                      
                      <div className="border-t border-[#D8EAD8]/40 pt-3.5">
                        <p className="text-[10px] font-black text-[#64748B]/80 mb-1 uppercase tracking-wide">Recommended Treatment</p>
                        <p className="text-xs font-bold text-[#236625] leading-relaxed">{selectedLeaf.treatment}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-[#64748B]/80 flex flex-col items-center justify-center h-full">
                      <div className="w-10 h-10 rounded-full bg-[#F9FBF8] flex items-center justify-center text-[#64748B]/80 mb-3 border border-[#D8EAD8]">?</div>
                      <p className="text-xs font-bold text-[#64748B]">No diagnosis completed yet.</p>
                      <p className="text-[10px] font-semibold mt-1">Select a leaf type and press "Scan {selectedLeaf.name}".</p>
                    </div>
                  )}
                </div>

                {scanResultReady && (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full text-center py-3 mt-4 bg-gradient-to-r from-[#236625] to-[#2E7D32] hover:from-[#1B521D] hover:to-[#1B521D] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    View Details
                  </button>
                )}
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* Dynamic ROI Yield Calculator Section */}
      <section className="py-32 bg-[#E8F5E9] relative z-10 border-t border-[#D8EAD8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-4 border border-[#D8EAD8]">
            <span>Dynamic ROI Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#236625] tracking-tight mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Calculate Your Farm's AI Yield Potential
          </h2>
          <p className="text-[#6B7280] font-semibold text-sm mb-12">
            Slide and adjust your farm sizes to see dynamic projections of your seasonal earnings and chemical savings.
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-center bg-[#E8F5E9]/70 border border-[#D8EAD8] rounded-[32px] p-8 shadow-sm text-left">
            {/* Inputs */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <label className="block text-xs font-black text-[#6B7280] uppercase tracking-wider mb-2">Select Crop Type</label>
                <div className="flex gap-3">
                  {['corn', 'wheat', 'soybeans'].map((crop) => (
                    <button
                      key={crop}
                      onClick={() => setCropType(crop)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all capitalize cursor-pointer ${cropType === crop ? 'bg-[#E8F5E9] border-[#236625] text-[#236625]' : 'bg-[#E8F5E9] border-[#D8EAD8] text-[#6B7280] hover:border-[#236625]/45'}`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-black text-[#6B7280] uppercase tracking-wider mb-2">
                  <span>Farm Size (Acres)</span>
                  <span className="text-[#236625] font-black">{farmAcres} Acres</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  value={farmAcres}
                  onChange={(e) => setFarmAcres(Number(e.target.value))}
                  className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#236625]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]/80 font-bold mt-1.5">
                  <span>10 Acres</span>
                  <span>500 Acres</span>
                  <span>1,000 Acres</span>
                </div>
              </div>
            </div>

            {/* Dynamic Results */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#236625] to-[#2E7D32] text-white p-8 border border-[#D8EAD8]/10 rounded-[24px] flex flex-col gap-4 shadow-lg">
              <div>
                <p className="text-[10px] font-black text-white/80 uppercase tracking-wider">Additional Revenue</p>
                <h4 className="text-3xl font-black mt-1 text-white">₹{roi.revenue}</h4>
                <p className="text-[9px] text-white/70 font-bold mt-0.5">Based on average crop market prices</p>
              </div>
              <div className="h-px bg-[#E8F5E9]/20" />
              <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                <div>
                  <p className="text-white/80 text-[9px] uppercase tracking-wider">Fertilizer Saved</p>
                  <p className="text-white mt-0.5">₹{roi.fertilizer}</p>
                </div>
                <div>
                  <p className="text-white/80 text-[9px] uppercase tracking-wider">Water Saved</p>
                  <p className="text-white mt-0.5">{roi.water} Gal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Slider */}
      <section className="py-32 bg-[#F9FBF8] relative z-10 border-t border-[#D8EAD8]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <motion.div {...fadeInScroll} className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-4 border border-[#D8EAD8]">
            <span>What Farmers Say</span>
          </motion.div>
          <motion.h2 
            {...fadeInScroll}
            className="text-3xl sm:text-4xl font-black text-[#236625] tracking-tight mb-16"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Trusted by Farmers Worldwide
          </motion.h2>

          <div className="relative max-w-4xl mx-auto">
            {/* Slide animation container */}
            <div className="overflow-hidden bg-[#E8F5E9] border border-[#D8EAD8] rounded-[32px] p-8 md:p-12 shadow-sm min-h-[220px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="text-left"
                >
                  <div className="flex text-amber-500 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-base md:text-lg font-bold text-[#1B1B1B] italic leading-relaxed mb-8">
                    "{testimonials[testimonialIndex].quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-100 hover:scale-110 transition-transform" src={testimonials[testimonialIndex].image} alt="" />
                    <div>
                      <h4 className="text-sm font-black text-[#1B1B1B]">{testimonials[testimonialIndex].name}</h4>
                      <span className="text-xs font-bold text-[#6B7280]">{testimonials[testimonialIndex].role}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                onClick={() => setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-[#E8F5E9] border border-[#D8EAD8] text-[#1B1B1B] hover:bg-[#E8F5E9] shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-black text-[#6B7280]">
                {testimonialIndex + 1} / {testimonials.length}
              </span>
              <button 
                onClick={() => setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full bg-[#E8F5E9] border border-[#D8EAD8] text-[#1B1B1B] hover:bg-[#E8F5E9] shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Pricing Section with Toggle */}
      <section id="pricing" className="py-32 bg-[#F9FBF8] relative z-10 border-t border-[#D8EAD8]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <motion.div {...fadeInScroll} className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-4 border border-[#D8EAD8]">
            <span>Simple Pricing</span>
          </motion.div>
          <motion.h2 
            {...fadeInScroll}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#236625] tracking-tight mb-4"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Choose the Perfect Plan
          </motion.h2>
          
          {/* Monthly/Yearly toggle switch */}
          <div className="flex items-center justify-center gap-3 mt-6 mb-16">
            <span className="text-xs font-black text-[#6B7280] uppercase tracking-wide">Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className={`w-12 h-6.5 rounded-full p-1 flex items-center transition-colors cursor-pointer ${isYearly ? 'bg-[#236625]' : 'bg-[#D8EAD8]'}`}
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-[#E8F5E9] transition-transform ${isYearly ? 'translate-x-5.5' : 'translate-x-0'} shadow-sm`} />
            </button>
            <span className="text-xs font-black text-[#236625] uppercase tracking-wide flex items-center gap-1.5">
              <span>Yearly</span>
              <span className="bg-[#E8F5E9] text-[#236625] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase border border-[#D8EAD8]">Save 20%</span>
            </span>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.1 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch"
          >
            
            {/* Starter Plan */}
            <motion.div 
              variants={staggerChild}
              whileHover={{ y: -6 }}
              className="bg-[#E8F5E9] rounded-[32px] p-8 border border-[#D8EAD8] hover:border-[#236625]/40 shadow-sm flex flex-col text-left transition-all duration-300"
            >
              <h3 className="text-xl font-black text-[#236625] mb-1">Starter</h3>
              <p className="text-xs font-semibold text-[#6B7280] mb-6">Perfect for small farms</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-[#236625]">
                  ₹{isYearly ? '2,900' : '3,900'}
                </span>
                <span className="text-[#6B7280] text-xs font-bold ml-1">/ {isYearly ? 'year' : 'month'}</span>
              </div>

              <div className="h-px bg-[#D8EAD8]/50 mb-6" />

              <ul className="space-y-4 text-[#236625] font-semibold text-sm mb-8 flex-1">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Up to 10 fields</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Basic crop monitoring</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Weather updates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>

              <button 
                onClick={() => navigate('/login')}
                className="w-full text-center py-3 border border-[#D8EAD8] hover:bg-[#E8F5E9] text-[#236625] font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                Start Free Trial
              </button>
            </motion.div>

            {/* Professional Plan (Highlighted with Glow Borders) */}
            <motion.div 
              variants={staggerChild}
              whileHover={{ y: -8, scale: 1.01 }}
              className="bg-gradient-to-b from-[#E8F5E9]/70 via-white to-white text-[#236625] rounded-[32px] p-8 border-2 border-[#236625] shadow-xl relative flex flex-col text-left transition-all duration-300"
            >
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#236625] text-white text-[10px] font-black tracking-wide uppercase px-3.5 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              
              <h3 className="text-xl font-black text-[#236625] mb-1">Professional</h3>
              <p className="text-xs font-semibold text-[#6B7280] mb-6">For growing farms</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-[#236625]">
                  ₹{isYearly ? '8,000' : '10,000'}
                </span>
                <span className="text-[#6B7280] text-xs font-bold ml-1">/ {isYearly ? 'year' : 'month'}</span>
              </div>

              <div className="h-px bg-[#D8EAD8] mb-6" />

              <ul className="space-y-4 text-[#236625] font-semibold text-sm mb-8 flex-1">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Up to 50 fields</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>AI disease detection</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>

              <button 
                onClick={() => navigate('/login')}
                className="w-full text-center py-3 bg-gradient-to-r from-[#236625] to-[#2E7D32] hover:from-[#1B521D] hover:to-[#1B521D] text-white font-extrabold rounded-xl text-sm transition-all shadow-md shadow-[#236625]/15 cursor-pointer"
              >
                Start Free Trial
              </button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              variants={staggerChild}
              whileHover={{ y: -6 }}
              className="bg-[#E8F5E9] rounded-[32px] p-8 border border-[#D8EAD8] hover:border-[#236625]/40 shadow-sm flex flex-col text-left transition-all duration-300"
            >
              <h3 className="text-xl font-black text-[#236625] mb-1">Enterprise</h3>
              <p className="text-xs font-semibold text-[#6B7280] mb-6">For large farms & organizations</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-[#236625]">
                  ₹{isYearly ? '25,000' : '32,000'}
                </span>
                <span className="text-[#6B7280] text-xs font-bold ml-1">/ {isYearly ? 'year' : 'month'}</span>
              </div>

              <div className="h-px bg-[#D8EAD8]/50 mb-6" />

              <ul className="space-y-4 text-[#236625] font-semibold text-sm mb-8 flex-1">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Unlimited fields</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>Advanced AI features</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-[#236625] flex-shrink-0" />
                  <span>24/7 phone support</span>
                </li>
              </ul>

              <button 
                onClick={() => navigate('/login')}
                className="w-full text-center py-3 border border-[#D8EAD8] hover:bg-[#E8F5E9] text-[#236625] font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                Contact Sales
              </button>
            </motion.div>

          </motion.div>

          <div className="flex justify-center items-center gap-6 text-xs font-bold text-[#6B7280] mt-8">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* 9. Second Stats Row */}
      <section className="bg-gradient-to-r from-[#236625] to-[#86EFAC] text-[#236625] py-20 border-y border-[#2E7D32]/30 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-center">
            <div className="flex flex-col items-center bg-[#E8F5E9]/90 backdrop-blur-md border border-white/50 py-10 px-6 rounded-[28px] shadow-lg shadow-emerald-950/5 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300">
              <span className="text-4xl md:text-5xl font-black text-[#236625] drop-shadow-[0_0_15px_rgba(22,163,74,0.15)]">98%</span>
              <span className="text-xs uppercase font-black text-[#236625] mt-2.5 tracking-wider">Prediction Accuracy</span>
            </div>
            <div className="flex flex-col items-center bg-[#E8F5E9]/90 backdrop-blur-md border border-white/50 py-10 px-6 rounded-[28px] shadow-lg shadow-emerald-950/5 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300">
              <span className="text-4xl md:text-5xl font-black text-[#236625] drop-shadow-[0_0_15px_rgba(22,163,74,0.15)]">50+</span>
              <span className="text-xs uppercase font-black text-[#236625] mt-2.5 tracking-wider">Crops Supported</span>
            </div>
            <div className="flex flex-col items-center bg-[#E8F5E9]/90 backdrop-blur-md border border-white/50 py-10 px-6 rounded-[28px] shadow-lg shadow-emerald-950/5 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300">
              <span className="text-4xl md:text-5xl font-black text-[#236625] drop-shadow-[0_0_15px_rgba(22,163,74,0.15)]">24/7</span>
              <span className="text-xs uppercase font-black text-[#236625] mt-2.5 tracking-wider">AI Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-[#E8F5E9] relative overflow-hidden z-10 border-t border-[#D8EAD8]">
        <div className="absolute inset-0 opacity-[0.03] bg-cover bg-center pointer-events-none mix-blend-overlay"
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070)' }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Software Description */}
            <motion.div 
              {...slideInLeft}
              className="lg:col-span-6"
            >
              <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-6 border border-[#D8EAD8]">
                <span>About Our Software</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#236625] tracking-tight mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                State-of-the-Art ERP <br />
                Built for Modern Farming
              </h2>
              <p className="text-sm sm:text-base text-[#1B1B1B]/75 font-semibold leading-relaxed mb-6">
                AgriAI is a comprehensive SaaS dashboard designed to bring digital transformation to agriculture. Combining machine learning leaf diagnostics, localized weather forecasting, and real-time inventory systems, our software empowers growers, agronomists, and retail administrators to operate with complete transparency.
              </p>
              <p className="text-sm text-[#6B7280] font-semibold leading-relaxed mb-8">
                Whether tracking retail invoices, managing farmer payrolls, or analyzing soil nutrient thresholds, AgriAI scales to support smallholder crops or enterprise agro-corporations.
              </p>
            </motion.div>

            {/* Right Column - Visual Pillars */}
            <motion.div 
              {...slideInRight}
              className="lg:col-span-6 grid sm:grid-cols-2 gap-6"
            >
              <div className="bg-[#E8F5E9] p-6 rounded-3xl border border-[#D8EAD8] hover:border-[#236625] shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#236625] mb-4">
                  <Sparkles className="w-5 h-5 text-[#236625]" />
                </div>
                <h3 className="text-base font-black text-[#236625] mb-2">AI Diagnostics</h3>
                <p className="text-xs font-semibold text-[#6B7280] leading-relaxed">Neural network analysis that highlights crop leaf disease markers in real-time.</p>
              </div>

              <div className="bg-[#E8F5E9] p-6 rounded-3xl border border-[#D8EAD8] hover:border-[#236625] shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#236625] mb-4">
                  <TrendingUp className="w-5 h-5 text-[#236625]" />
                </div>
                <h3 className="text-base font-black text-[#236625] mb-2">Predictive Metrics</h3>
                <p className="text-xs font-semibold text-[#6B7280] leading-relaxed">Predict seasonal yield rates and soil water levels with extreme accuracy.</p>
              </div>

              <div className="bg-[#E8F5E9] p-6 rounded-3xl border border-[#D8EAD8] hover:border-[#236625] shadow-sm col-span-1 sm:col-span-2 transition-all duration-300">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#236625] mb-4">
                  <Layers className="w-5 h-5 text-[#236625]" />
                </div>
                <h3 className="text-base font-black text-[#236625] mb-2">Billing & Udhar Management</h3>
                <p className="text-xs font-semibold text-[#6B7280] leading-relaxed">Generate GST-compliant invoices and keep clean records of ledger accounts for local suppliers and farmers.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions */}
      <section className="py-32 bg-[#F9FBF8] relative z-10 border-t border-[#D8EAD8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Left FAQ accordion */}
            <motion.div {...fadeInScroll} className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#236625] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-4 border border-[#D8EAD8] w-fit">
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#236625] tracking-tight mb-8" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-[#E8F5E9] rounded-2xl border border-[#D8EAD8] overflow-hidden shadow-sm hover:border-[#236625] transition-colors">
                    <button 
                      onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                      className="w-full px-6 py-4.5 flex items-center justify-between text-left font-bold text-[#236625] hover:text-[#236625] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-lg font-black text-[#64748B]/80">
                        {activeFAQ === i ? '−' : '+'}
                      </span>
                    </button>
                    <AnimatePresence>
                      {activeFAQ === i && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-5 text-sm font-semibold text-[#6B7280] leading-relaxed"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Still have questions box */}
            <motion.div 
              {...slideInRight}
              className="bg-gradient-to-br from-[#236625] to-[#2E7D32] text-white p-10 rounded-[32px] relative overflow-hidden flex flex-col justify-between border-none shadow-xl min-h-[350px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8F5E9]/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <h3 className="text-2xl font-black mb-3">Still have questions?</h3>
                <p className="text-sm text-white/95 font-semibold mb-6">Our expert agritech team is here to help you succeed.</p>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[#E8F5E9] hover:bg-[#E8F5E9] text-[#236625] font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer hover:shadow-lg hover:shadow-[#236625]/20"
                >
                  Contact Support
                </button>
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9]/10 flex items-center justify-center border border-white/20 shadow-inner">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 11. Bottom Banner CTA with plant icon */}
      <section className="py-16 bg-[#F9FBF8] relative z-10 border-t border-[#D8EAD8]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            {...fadeInScroll}
            className="bg-gradient-to-r from-[#236625] to-[#2E7D32] text-white rounded-[32px] px-8 py-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl border-none"
          >
            <div className="absolute right-0 top-0 w-48 h-full opacity-10 bg-[#E8F5E9] pointer-events-none filter blur-2xl" />
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-[#E8F5E9]/10 rounded-2xl flex items-center justify-center border border-white/20 flex-shrink-0 shadow-lg">
                <img src="https://img.icons8.com/color/96/sprout.png" className="w-10 h-10 object-contain hover:scale-110 transition-transform" alt="sprout" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-black mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Ready to Transform Your Agriculture?</h3>
                <p className="text-sm font-semibold text-white/90">Join thousands of farmers who are already growing better with AgriAI.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3.5 w-full md:w-auto relative z-10">
              <Link 
                to="/login"
                className="flex-1 md:flex-none text-center bg-[#E8F5E9] hover:bg-[#E8F5E9] text-[#236625] font-extrabold px-6 py-4 rounded-xl transition-all text-sm cursor-pointer hover:scale-[1.02] shadow-md shadow-[#236625]/10"
              >
                Start Free Trial
              </Link>
              <button 
                onClick={() => navigate('/login')}
                className="flex-1 md:flex-none text-center bg-[#E8F5E9]/10 border border-white/30 hover:bg-[#E8F5E9]/20 text-white font-bold px-6 py-4 rounded-xl transition-all text-sm cursor-pointer hover:scale-[1.02]"
              >
                Book a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="bg-[#E8F5E9] text-[#236625]/85 py-20 relative z-10 border-t border-[#D8EAD8]">
        
        {/* Subtle top gradient border line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#236625] via-[#2E7D32] to-[#236625]" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-6 mb-12">
            
            {/* Info Col */}
            <div className="col-span-2 md:col-span-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#236625] to-[#2E7D32] rounded-lg flex items-center justify-center text-white border border-[#D8EAD8]/30">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black text-[#236625] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  AgriAI
                </span>
              </div>
              <p className="text-xs font-semibold leading-relaxed max-w-xs mb-6 text-[#236625]/75">
                Empowering farmers with AI technology for a sustainable, high-yield future.
              </p>
              <div className="flex gap-4">
                {[
                  {
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                      </svg>
                    ),
                    url: 'https://facebook.com',
                    label: 'Facebook',
                    hover: 'hover:bg-[#1877F2] hover:border-[#1877F2]'
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                    url: 'https://twitter.com',
                    label: 'Twitter',
                    hover: 'hover:bg-[#000000] hover:border-[#000000]'
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764 0-.973.784-1.763 1.75-1.763s1.75.79 1.75 1.763c0 .974-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    ),
                    url: 'https://linkedin.com',
                    label: 'LinkedIn',
                    hover: 'hover:bg-[#0A66C2] hover:border-[#0A66C2]'
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    ),
                    url: 'https://youtube.com',
                    label: 'YouTube',
                    hover: 'hover:bg-[#FF0000] hover:border-[#FF0000]'
                  }
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-8 h-8 rounded-lg bg-[#E8F5E9] border border-[#D8EAD8] flex items-center justify-center text-[#236625] cursor-pointer hover:text-white ${s.hover} hover:scale-110 transition-all duration-300`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter input layout */}
            <div className="col-span-2 md:col-span-4 md:order-last flex flex-col items-start">
              <h4 className="text-xs font-black text-[#236625] uppercase tracking-wider mb-4">Stay Connected</h4>
              <p className="text-[11px] font-semibold mb-4 leading-relaxed text-[#236625]/70">Subscribe to our newsletter for latest agricultural insights.</p>
              <div className="flex w-full max-w-sm rounded-xl overflow-hidden border border-[#D8EAD8] bg-[#E8F5E9] focus-within:border-[#236625] transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow bg-transparent px-4 py-2.5 text-xs text-[#236625] outline-none placeholder-[#236625]/40 font-semibold"
                />
                <button className="bg-[#236625] hover:bg-[#1B521D] text-white px-4 flex items-center justify-center transition-colors cursor-pointer border-none">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Links Col 1 */}
            <div className="col-span-1 md:col-span-1.5">
              <h4 className="text-xs font-black text-[#236625] uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5 text-xs font-bold text-[#236625]/70">
                <li><a href="#" className="hover:text-[#236625] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[#236625] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#236625] transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-[#236625] transition-colors">Updates</a></li>
              </ul>
            </div>

            {/* Links Col 2 */}
            <div className="col-span-1 md:col-span-1.5">
              <h4 className="text-xs font-black text-[#236625] uppercase tracking-wider mb-4">Solutions</h4>
              <ul className="space-y-2.5 text-xs font-bold text-[#236625]/70">
                <li><a href="#" className="hover:text-[#236625] transition-colors">Crop Management</a></li>
                <li><a href="#" className="hover:text-[#236625] transition-colors">Farm Operations</a></li>
                <li><a href="#" className="hover:text-[#236625] transition-colors">Financials</a></li>
                <li><a href="#" className="hover:text-[#236625] transition-colors">Analytics</a></li>
              </ul>
            </div>

            {/* Links Col 3 */}
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-xs font-black text-[#236625] uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5 text-xs font-bold text-[#236625]/70">
                <li><a href="#" className="hover:text-[#236625] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#236625] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#236625] transition-colors">Blog</a></li>
              </ul>
            </div>

          </div>

          <div className="h-px bg-[#D8EAD8] mb-8" />

          {/* Bottom links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#236625]/70">
            <p>© 2026 AgriAI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#236625] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#236625] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#236625] transition-colors">Cookie Policy</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
