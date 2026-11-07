'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import { User, Phone, Mail, Lock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password validation helper
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;
  const doPasswordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!hasMinLength) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (!hasUpperCase) {
      setErrorMsg('Password must contain at least one uppercase letter (A-Z).');
      return;
    }
    if (!hasLowerCase) {
      setErrorMsg('Password must contain at least one lowercase letter (a-z).');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setLoading(true);
    toast.loading('Creating your account...', { id: 'auth-toast' });
    const success = await register(
      name.trim(),
      email.trim(),
      password,
      '/client-review-1.jpg'
    );
    setLoading(false);

    if (success) {
      toast.success('Registration completed! Welcome to AYRO.', { id: 'auth-toast' });
      router.push('/');
      router.refresh();
    } else {
      setErrorMsg('Registration failed. This email may already be registered.');
      toast.error('Registration failed. This email may already be registered.', { id: 'auth-toast' });
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    toast.loading('Connecting with Google...', { id: 'auth-toast' });
    await loginWithGoogle('/');
  };

  return (
    <div className="min-h-[85vh] bg-background flex flex-col">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#1C3B27] font-medium">Register for an account</span>
        </div>
      </div>

      {/* Main Split Card */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-card rounded-2xl sm:rounded-3xl border border-border/70 shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Column: Brand Picture */}
          <div className="w-full md:w-1/2 bg-[#f6f2ec] dark:bg-muted/30 p-8 sm:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-border/50">
            <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
              <Image
                src="/ayro-auth-brand.jpg"
                alt="AYRO Timeless Essentials"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Column: Register Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-center text-foreground">
              Register Now!
            </h1>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xl flex items-center gap-2 px-5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="relative flex items-center rounded-full border border-border/80 bg-background px-4 py-3 focus-within:border-[#0c1a24] dark:focus-within:border-primary transition-colors">
                <User className="w-4 h-4 text-muted-foreground shrink-0 mr-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Phone Number */}
              <div className="relative flex items-center rounded-full border border-border/80 bg-background px-4 py-3 focus-within:border-[#0c1a24] dark:focus-within:border-primary transition-colors">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0 mr-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Email Address */}
              <div className="relative flex items-center rounded-full border border-border/80 bg-background px-4 py-3 focus-within:border-[#0c1a24] dark:focus-within:border-primary transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0 mr-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center rounded-full border border-border/80 bg-background px-4 py-3 focus-within:border-[#0c1a24] dark:focus-within:border-primary transition-colors">
                <Lock className="w-4 h-4 text-muted-foreground shrink-0 mr-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative flex items-center rounded-full border border-border/80 bg-background px-4 py-3 focus-within:border-[#0c1a24] dark:focus-within:border-primary transition-colors">
                <Lock className="w-4 h-4 text-muted-foreground shrink-0 mr-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Password Validation Criteria Checklist */}
              {password.length > 0 && (
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1.5 animate-in fade-in duration-150">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Password Security Requirements:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                      {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>6+ chars</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                      {hasUpperCase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                      {hasLowerCase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Lowercase</span>
                    </div>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className="pt-1 border-t border-border/50 text-[11px]">
                      {password === confirmPassword ? (
                        <span className="text-emerald-500 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Passwords match</span>
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Passwords do not match</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (password.length > 0 && !isPasswordValid) || (confirmPassword.length > 0 && !doPasswordsMatch)}
                className="w-full py-3.5 rounded-full bg-[#0c1a24] hover:bg-[#132838] dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-1 text-xs">
              <p className="text-muted-foreground">
                Already have account?{' '}
                <Link
                  href="/login"
                  className="font-bold text-[#1C3B27] hover:underline"
                >
                  Login Now!
                </Link>
              </p>
            </div>

            {/* Google Register option */}
            <div className="pt-2">
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-border w-full" />
                <span className="bg-card px-3 text-[10px] text-muted-foreground uppercase font-semibold">
                  Or Register With
                </span>
                <div className="border-t border-border w-full" />
              </div>

              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-full border border-border bg-background hover:bg-accent text-foreground text-xl font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
