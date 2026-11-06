'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import { User, Lock, AlertCircle } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    setLoading(true);
    toast.loading('Signing in to your account...', { id: 'auth-toast' });
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      toast.success('Signed in successfully!', { id: 'auth-toast' });
      router.push('/');
      router.refresh();
    } else {
      setErrorMsg('Invalid email or password. Please verify your credentials.');
      toast.error('Invalid email or password. Please verify your credentials.', { id: 'auth-toast' });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    toast.loading('Redirecting to Google sign in...', { id: 'auth-toast' });
    await loginWithGoogle('/');
  };

  return (
    <div className="min-h-[82vh] bg-background flex flex-col">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#b57a48] font-medium">Login to your Account</span>
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

          {/* Right Column: Login Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-center text-foreground">
              Login Now
            </h1>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2 px-5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email */}
              <div className="relative flex items-center rounded-full border border-border/80 bg-background px-4 py-3 focus-within:border-[#0c1a24] dark:focus-within:border-primary transition-colors">
                <User className="w-4 h-4 text-muted-foreground shrink-0 mr-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username"
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
                  placeholder="password"
                  className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#0c1a24] hover:bg-[#132838] dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'login'}
              </button>
            </form>

            {/* Sign Up & Forgot Password Links */}
            <div className="text-center space-y-2 pt-1 text-xs">
              <p className="text-muted-foreground">
                Don&apos;t have account?{' '}
                <Link
                  href="/register"
                  className="font-bold text-[#b57a48] hover:underline"
                >
                  Sign Up Now!
                </Link>
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => toast.info('Password reset instructions will be sent to your registered email.')}
                  className="text-xs text-muted-foreground hover:text-[#b57a48] transition-colors cursor-pointer"
                >
                  Forgot Password!
                </button>
              </div>
            </div>

            {/* Google Sign In option */}
            <div className="pt-2">
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-border w-full" />
                <span className="bg-card px-3 text-[10px] text-muted-foreground uppercase font-semibold">
                  Or Continue With
                </span>
                <div className="border-t border-border w-full" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-full border border-border bg-background hover:bg-accent text-foreground text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading login...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
