'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import { UserPlus, AlertCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password validation helper
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !password) {
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

    setLoading(true);
    const success = await register(
      name.trim(),
      email.trim(),
      password,
      photoURL.trim() || '/client-review-1.jpg'
    );
    setLoading(false);

    if (success) {
      toast.success('Registration completed! You can now log in.');
      router.push('/login');
    } else {
      setErrorMsg('Registration failed. This email may already be registered.');
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const success = await loginWithGoogle();
    setLoading(false);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground">
            Join the ClothSpace Collective
          </h1>
          <p className="text-xs text-muted-foreground">
            Create an artisan or collector profile to discover, share, and list bespoke clothing.
          </p>
        </div>

        {/* Error Alert in form */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marc Jacobs / Sofia Chen"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@domain.com"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Profile Photo URL (Optional)
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://... or leave empty for default avatar"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Supports ImgBB, PostImage, or existing public pictures.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters, uppercase & lowercase"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />

            {/* Password Validation Criteria Checklist */}
            <div className="mt-2.5 p-3 rounded-xl bg-muted/40 border border-border space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Password Security Requirements:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>At least 6 chars</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {hasUpperCase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>Uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {hasLowerCase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>Lowercase letter</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (password.length > 0 && !isPasswordValid)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md hover:shadow-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register Designer Profile'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-background px-3 text-[10px] text-muted-foreground uppercase font-semibold">
            Or Register With
          </span>
          <div className="border-t border-border w-full" />
        </div>

        {/* Social Register Button (Google) */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Link to Login */}
        <p className="text-center text-xs text-muted-foreground">
          Already a ClothSpace member?{' '}
          <Link
            href="/login"
            className="font-bold text-rose-600 hover:text-rose-500 underline"
          >
            Log In Here
          </Link>
        </p>
      </div>
    </div>
  );
}

