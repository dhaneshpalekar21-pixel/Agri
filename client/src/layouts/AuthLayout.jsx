import { Outlet } from 'react-router-dom'
import { Leaf, Package, Receipt, CreditCard, BarChart3, Globe, ShieldCheck, Cloud, HeadphonesIcon, Lock } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="h-screen flex bg-slate-50 relative overflow-hidden">
      {/* Decorative Leaves Bottom Right (visible only on desktop if needed, or always) */}
      <div className="hidden xl:block absolute bottom-0 right-0 pointer-events-none z-0 opacity-60">
        <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
      </div>

      {/* Left Panel - Branding */}
      <div 
        className="hidden lg:flex lg:w-[45%] flex-col justify-center p-10 xl:p-16 text-white relative z-10 h-full"
        style={{ 
          background: 'linear-gradient(145deg, #0e3b1c 0%, #155e2a 100%)',
          borderTopRightRadius: '3rem',
          borderBottomRightRadius: '3rem',
          boxShadow: '10px 0 40px rgba(0,0,0,0.08)'
        }}
      >
        {/* Background decorative image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay rounded-r-[3rem]"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e3b1c] via-transparent to-transparent rounded-r-[3rem]" />
        
        {/* Subtle dot pattern background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none rounded-r-[3rem]" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-20 w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-md shadow-lg border border-white/20">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              AgriAI
            </h1>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black mb-2 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Smart Agriculture <br />
            <span className="text-emerald-400">Management System</span>
          </h2>
          <p className="text-sm opacity-90 mt-4 leading-relaxed font-semibold max-w-sm text-emerald-50">
            The smartest digital SaaS dashboard for modern agriculture and operational fields.
          </p>

          {/* Feature highlights with Lucide symbols */}
          <div className="mt-8 space-y-4">
            {[
              { icon: <Package className="w-5 h-5 text-emerald-100" />, text: 'Real-time inventory tracking' },
              { icon: <Receipt className="w-5 h-5 text-emerald-100" />, text: 'GST-compliant billing' },
              { icon: <CreditCard className="w-5 h-5 text-emerald-100" />, text: 'Udhar & credit management' },
              { icon: <BarChart3 className="w-5 h-5 text-emerald-100" />, text: 'Analytics & reports' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-4 text-xs font-bold tracking-wide">
                <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-inner">
                  {icon}
                </div>
                <span className="text-slate-50">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-[55%] flex flex-col relative z-10 h-full">
        
        {/* Subtle dot pattern for right side */}
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Language Selector */}
        <div className="absolute top-4 right-6 z-20 hidden sm:block">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer transition-all hover:border-slate-300">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>English</span>
            <svg className="w-3.5 h-3.5 text-slate-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-4 lg:hidden bg-white p-3 rounded-xl border border-slate-200 shadow-sm w-full max-w-[380px] justify-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>AgriAI</h1>
            </div>
          </div>

          <div className="w-full max-w-[390px]">
            <div className="bg-white rounded-2xl shadow-[0_15px_40px_rgb(0,0,0,0.04)] p-6 lg:p-8 border border-slate-100/50">
              <Outlet />
            </div>
          </div>
        </div>
        
        {/* Footer features */}
        <div className="pb-4 px-6 hidden md:block relative z-10 mt-auto">
          <div className="flex justify-center items-center gap-6 lg:gap-10 text-[0.65rem] uppercase tracking-wider font-bold text-slate-500 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="leading-tight">Secure &<br />Reliable</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-600" />
              <span className="leading-tight">Cloud<br />Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <HeadphonesIcon className="w-4 h-4 text-emerald-600" />
              <span className="leading-tight">24/7<br />Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="leading-tight">Your Data<br />is Safe</span>
            </div>
          </div>
          <p className="text-center text-slate-400 text-[10px] font-semibold mt-4">
            © 2026 AgriAI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
