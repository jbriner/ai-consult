import { useState } from 'react';
import { Zap, CheckCircle, FileText, Send, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

function FunnelPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  });

  const [status, setStatus] = useState<FormStatus>({ type: 'idle', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending...' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service: 'Free Infographic Download',
          message: `Lead capture from infographic funnel page.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Success! Check your email for the download link.' });
        setFormData({ name: '', email: '', phone: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-delayed"></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">247ignite</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Value proposition */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">Free Download</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                The Ultimate Guide to{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  AI Implementation
                </span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Discover the 7 key strategies that successful businesses use to implement AI and transform their operations.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Step-by-step AI implementation roadmap',
                  'Common pitfalls and how to avoid them',
                  'ROI calculation framework',
                  'Real-world case studies',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-blue-100">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[
                      'https://i.pravatar.cc/100?img=11',
                      'https://i.pravatar.cc/100?img=32',
                      'https://i.pravatar.cc/100?img=44',
                      'https://i.pravatar.cc/100?img=52',
                      'https://i.pravatar.cc/100?img=68',
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-white font-semibold ml-1">4.9</span>
                    </div>
                    <p className="text-blue-200 text-sm">Trusted by <span className="text-white font-semibold">2,847</span> business leaders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:pl-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">
                  Get Your Free Infographic
                </h2>
                <p className="text-blue-200 mb-6 text-center">
                  Enter your details below for instant access
                </p>

                {status.type === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">You're All Set!</h3>
                    <p className="text-blue-200 mb-6">{status.message}</p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Back to Homepage
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {status.type === 'error' && (
                      <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-200 text-sm">{status.message}</p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-blue-200 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status.type === 'loading'}
                      className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-200 font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {status.type === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Get Free Infographic
                        </>
                      )}
                    </button>

                    <p className="text-xs text-blue-300/60 text-center mt-4">
                      By submitting, you agree to receive communications from 247ignite.
                      <br />
                      We respect your privacy and will never share your information.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-300/60 text-sm">
            &copy; 2024 247ignite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default FunnelPage;
