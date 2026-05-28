import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { forgotPassword } from '../../services/authService'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await forgotPassword(data)
      setSent(true)
      toast.success('Password reset link sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">
          <CheckCircle size={52} style={{ color: '#2E7D32' }} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Check Your Email</h2>
        <p className="text-sm text-gray-500 mb-6">We've sent a password reset link to your email address.</p>
        <Link to="/login" className="btn-primary inline-flex">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Forgot Password?</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <input
              id="forgot-email"
              type="email"
              className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
              placeholder="your@email.com"
              {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
            />
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <button id="forgot-submit" type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/login" className="flex items-center justify-center gap-1 font-medium" style={{ color: '#2E7D32' }}>
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </p>
    </div>
  )
}
