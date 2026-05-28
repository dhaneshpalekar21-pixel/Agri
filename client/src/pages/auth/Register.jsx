import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react'
import { register as registerUser } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await registerUser(data)
      setAuth(res.data.token, res.data.user)
      toast.success('Shop registered! Welcome to AgroERP 🌾')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Register Your Shop 🏪
        </h1>
        <p className="text-sm text-gray-500 mt-1">Start your digital agriculture journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              id="reg-name"
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
              placeholder="Ramesh Patil"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              id="reg-phone"
              className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
              placeholder="9876543210"
              {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid phone' } })}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
          <input
            id="reg-shopName"
            className={`input-field ${errors.shopName ? 'border-red-400' : ''}`}
            placeholder="Patil Krushi Seva Kendra"
            {...register('shopName', { required: 'Shop name is required' })}
          />
          {errors.shopName && <p className="text-xs text-red-500 mt-1">{errors.shopName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
          <input
            id="reg-gst"
            className="input-field"
            placeholder="27AABCU9603R1ZX"
            {...register('gstNumber')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="reg-email"
            type="email"
            className={`input-field ${errors.email ? 'border-red-400' : ''}`}
            placeholder="owner@shop.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
            })}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPass ? 'text' : 'password'}
              className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
              placeholder="Min 6 characters"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <button
          id="reg-submit"
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          {loading ? 'Registering...' : 'Register Shop'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold" style={{ color: '#2E7D32' }}>Sign in</Link>
      </p>
    </div>
  )
}
