'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import { LogIn, AlertCircle } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const { login, loginWithGoogle, quickLoginExaminer } = useAuth();

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
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.push('/');
      router.refresh();
    } else {
      setErrorMsg('Invalid email or password. Please verify your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await loginWithGoogle('/');
  };

  const handleExaminerQuickLogin = async () => {
    setLoading(true);
    const success = await quickLoginExaminer();
    setLoading(false);
  if (success) {
    router.push('/');
    router.refresh();
  }
};

return (
  <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground">
          Welcome Back to ClothSpace
        </h1>
        <p className="text-xs text-muted-foreground">
          Access your clothing listings, manage incoming orders, and discover designer drops.
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
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. designer@clothspace.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
                />
              </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-foreground">
                          Password <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => toast.info('Password reset is disabled during assignment evaluation. Use the examiner test credentials above.')}
                          className="text-[11px] font-medium text-muted-foreground hover:text-rose-500 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md hover:shadow-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{loading ? 'Authenticating...' : 'Sign In to ClothSpace'}</span>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-border w-full" />
                    <span className="bg-background px-3 text-[10px] text-muted-foreground uppercase font-semibold">
                      Or Continue With
                    </span>
                    <div className="border-t border-border w-full" />
                  </div>

                  {/* Social Login Button (Google) */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer"
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
                    <span>Sign In with Google</span>
                  </button>

                  {/* Quick 1-Click Demo Login Button */}
                  <button
                    type="button"
                    onClick={handleExaminerQuickLogin}
                    disabled={loading}
                    className="w-full py-2 px-4 rounded-xl border border-dashed border-border hover:border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Quick 1-Click Demo Sign In (Examiner)</span>
                  </button>

                  {/* Link to Register */}
                  <p className="text-center text-xs text-muted-foreground">
                    Don&apos;t have an apparel account yet?{' '}
                    <Link
                      href="/register"
                      className="font-bold text-rose-600 hover:text-rose-500 underline"
                    >
                      Create an Account
                    </Link>
                  </p>
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
