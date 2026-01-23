import { Brain, Zap, Target, TrendingUp, Users, Shield, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              247ignite
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
            <a href="#expertise" className="text-gray-600 hover:text-blue-600 transition-colors">Expertise</a>
            <a href="#why-us" className="text-gray-600 hover:text-blue-600 transition-colors">Why Us</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            <a href="#contact" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 overflow-hidden">
        {/* Animated floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-delayed"></div>
          <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">AI-Powered Business Transformation</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Ignite Your Business with{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                AI Excellence
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Transform your operations with cutting-edge artificial intelligence. We deliver strategic AI consulting
              that drives measurable results, 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-200 font-semibold text-lg flex items-center justify-center gap-2 group">
                Start Your AI Journey
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#services" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200 font-semibold text-lg">
                View Our Services
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
            {[
              { label: 'Rapid project kickoff', value: 'Fast' },
              { label: 'Tailored engagement models', value: 'Flexible' },
              { label: 'Dedicated to your success', value: 'Focused' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive AI Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From strategy to implementation, we deliver end-to-end AI consulting services tailored to your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI Strategy & Consulting',
                description: 'Develop comprehensive AI roadmaps aligned with your business objectives and industry requirements.',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Machine Learning Solutions',
                description: 'Custom ML models that predict, optimize, and automate your critical business processes.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Process Automation',
                description: 'Intelligent automation that eliminates repetitive tasks and accelerates operations.',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Data Analytics & Insights',
                description: 'Transform raw data into actionable intelligence with advanced AI-powered analytics.',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'AI Training & Workshops',
                description: 'Empower your team with cutting-edge AI knowledge and practical implementation skills.',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'AI Governance & Ethics',
                description: 'Ensure responsible AI deployment with robust governance frameworks and ethical guidelines.',
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="expertise" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Expertise That Drives Results
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our team of AI specialists brings decades of combined experience across industries,
                delivering solutions that transform businesses and create competitive advantages.
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: 'Industry Leadership',
                    description: 'Former executives from leading tech companies with proven track records in AI innovation.',
                  },
                  {
                    title: 'Technical Excellence',
                    description: 'Senior engineers specializing in deep learning, NLP, computer vision, and more.',
                  },
                  {
                    title: 'Business Focus',
                    description: 'ROI-driven approach ensuring every AI initiative delivers measurable business value.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-2 h-2 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Natural Language Processing', level: '95%' },
                { label: 'Computer Vision', level: '92%' },
                { label: 'Predictive Analytics', level: '98%' },
                { label: 'Process Automation', level: '96%' },
              ].map((skill, idx) => (
                <div key={idx} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                    {skill.level}
                  </div>
                  <div className="text-sm text-gray-600 leading-tight">{skill.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose 247ignite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We don't just implement AI—we transform how you do business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Dedicated Partnership',
                description: 'A committed team that works alongside you from strategy through implementation and beyond.',
                gradient: 'from-blue-600 to-cyan-500',
              },
              {
                title: 'Rapid Deployment',
                description: 'Agile methodologies that get your AI solutions from concept to production in record time.',
                gradient: 'from-cyan-500 to-teal-500',
              },
              {
                title: 'Proven ROI',
                description: 'Data-driven approach with clear metrics and tangible returns on your AI investments.',
                gradient: 'from-teal-500 to-emerald-500',
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="relative p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Let's Start a Conversation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your business with AI? Get in touch and let's discuss your needs.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-50 mb-10 leading-relaxed">
            Join hundreds of forward-thinking companies leveraging AI to gain competitive advantage.
            Let's discuss how we can ignite your AI journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 font-semibold text-lg">
              Schedule Consultation
            </a>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">247ignite</span>
              </Link>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Leading AI consulting firm dedicated to transforming businesses through intelligent automation
                and cutting-edge machine learning solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Links</h4>
              <ul className="space-y-2">
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2024 247ignite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
