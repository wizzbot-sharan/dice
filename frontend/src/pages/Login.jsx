import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const { setOperator } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await axios.post('/api/auth/request-otp', { email });
      setStep(2);
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('/api/auth/verify-otp', { email, otp });
      setOperator(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white tracking-tight">
            Operator Login
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            {step === 1 ? 'Enter your email to receive an OTP' : 'Check your email for the code'}
          </p>
        </div>
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4">
            <p className="text-sm text-rose-400 text-center">{error}</p>
          </div>
        )}

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleRequestOtp}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-black border border-white/10 placeholder-zinc-600 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 sm:text-sm transition-colors"
                  placeholder="name@applywizz.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-emerald-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="otp-code" className="sr-only">OTP Code</label>
                <input
                  id="otp-code"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-black border border-white/10 placeholder-zinc-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 sm:text-sm tracking-widest text-center text-2xl font-mono transition-colors"
                  placeholder=""
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-emerald-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
              
              <div className="flex justify-between items-center px-1 pt-2">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleRequestOtp}
                  className="text-xs font-medium text-emerald-500 hover:text-emerald-400 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(''); }}
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Change Email
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
