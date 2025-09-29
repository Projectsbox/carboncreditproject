import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Globe, TrendingUp, Users, Lock, Zap, CheckCircle, ArrowRight, Menu, X, Download, Share2, BarChart3 } from 'lucide-react';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const stats = [
    { label: 'Active Projects', value: '2,456', icon: BarChart3 },
    { label: 'Credits Issued', value: '8.9M', icon: CheckCircle },
    { label: 'Global Users', value: '45K+', icon: Users },
    { label: 'Market Value', value: '$127M', icon: TrendingUp }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Immutable Records',
      desc: 'Clear records that cannot be changed or tampered with, ensuring complete data integrity.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      desc: 'Access your data anytime, anywhere with our decentralized blockchain network.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Cost-Effective',
      desc: 'Scalable solutions that eliminate middlemen and reduce operational costs significantly.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      desc: 'Encourages participation from all stakeholders in a transparent ecosystem.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Investor Confidence',
      desc: 'Boost stakeholder trust with complete transparency and verifiable transactions.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Lock,
      title: 'Smart Contracts',
      desc: 'Automated execution of agreements with built-in security and compliance.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const workflow = [
    { step: '01', title: 'Register', desc: 'Create your blockchain identity' },
    { step: '02', title: 'Record', desc: 'Log transactions immutably' },
    { step: '03', title: 'Verify', desc: 'Network validates data' },
    { step: '04', title: 'Track', desc: 'Monitor in real-time' }
  ];

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/10 via-green-500/10 to-yellow-500/10 blur-3xl"
        />
      </div>

      {/* Floating Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 px-6 md:px-12 py-6 flex items-center justify-between"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            BlockChain SIH
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Benefits', 'How It Works', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {item}
            </motion.a>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-semibold"
          >
            Get Started
          </motion.button>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative px-6 md:px-12 py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-sm font-semibold mb-6"
              >
                🏆 Smart India Hackathon 2025
              </motion.span>
              
              <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Revolutionize
                </span>
                <br />
                Trust with
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Blockchain
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Transform traditional systems with immutable, transparent, and decentralized records. Build trust across agriculture, healthcare, supply chain, and beyond.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-lg flex items-center gap-2"
                >
                  Launch Platform
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full border-2 border-white/20 backdrop-blur-sm font-bold text-lg flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Report
                </motion.button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl p-8">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-30 animate-pulse" />
              
              <div className="relative space-y-4">
                <div className="text-sm text-slate-400 mb-4">Real-Time Network Stats</div>
                
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 border border-white/10"
                    >
                      <stat.icon className="w-8 h-8 mb-2 text-blue-400" />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 text-sm text-green-400 pt-4"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Network Active • 99.9% Uptime
                </motion.div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 opacity-20 blur-xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 opacity-20 blur-xl"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-slate-400">Built for transparency, security, and scale</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl p-8"
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-8 h-8" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>

                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                  className={`h-1 rounded-full bg-gradient-to-r ${feature.color} mt-6`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="how-it-works" className="relative px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-slate-400">Simple, secure, and transparent process</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-xl p-8 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-black"
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </motion.div>

                {i < workflow.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                    className="hidden md:block absolute top-1/3 -right-4 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xl p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 animate-pulse" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Ready to Build the Future?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of innovators creating transparent, trustworthy systems
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-full bg-white text-slate-900 font-bold text-lg flex items-center gap-2"
                >
                  Start Building Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-full border-2 border-white font-bold text-lg flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share Project
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 md:px-12 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p className="text-lg">
            © {new Date().getFullYear()} BlockChain SIH Project • Built with 💙 for Smart India Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}
