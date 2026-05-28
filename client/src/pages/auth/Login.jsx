import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn, Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import { login } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await login(data)
      setAuth(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}! 🌾`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Demo login shortcuts
  const demoLogin = async (role) => {
    const credentials = {
      admin: { email: 'admin@agroerp.com', password: 'admin123' },
      user: { email: 'staff@agroerp.com', password: 'staff123' },
      superadmin: { email: 'super@agroerp.com', password: 'super123' },
    }
    setLoading(true)
    try {
      const res = await login(credentials[role])
      setAuth(res.data.token, res.data.user)
      toast.success(`Logged in as ${role} 🌾`)
      navigate('/dashboard')
    } catch {
      toast.error('Demo login failed — make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4 text-center lg:text-left">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Welcome Back
        </h1>
        <p className="text-xs text-slate-700 font-bold mt-0.5">Sign in to your AgriAI dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail size={16} />
            </div>
            <input
              id="login-email"
              type="email"
              className={`w-full pl-9 pr-4 py-2 rounded-xl border-2 font-bold text-xs text-slate-700 bg-white focus:outline-none transition-all ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'}`}
              placeholder="admin@agriai.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
              })}
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Password</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={16} />
            </div>
            <input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              className={`w-full pl-9 pr-9 py-2 rounded-xl border-2 font-bold text-xs text-slate-700 bg-white focus:outline-none transition-all ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'}`}
              placeholder="••••••••"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.password.message}</p>}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link to="/forgot-password" className="text-[10px] font-black hover:text-emerald-700 transition-colors" style={{ color: '#2E7D32' }}>
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 mt-1 bg-[#2a7a40] hover:bg-[#206030] text-white rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} className="transform rotate-180" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">OR</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <p className="text-center text-xs font-bold text-slate-800 mt-4">
        New to AgriAI?{' '}
        <Link to="/register" className="font-extrabold text-emerald-600 hover:text-emerald-700 transition-colors">
          Create your account
        </Link>
      </p>
    </div>
  )
}
