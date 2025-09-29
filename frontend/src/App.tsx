import { Outlet, Link, useNavigate } from 'react-router-dom'
import './App.css'
import { useAuth } from './state/auth'
import { motion } from 'framer-motion'
import { Shield, Home, Menu, X } from 'lucide-react'
import { useState } from 'react'

function App() {
  const { user, clear } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Animated Background - matching Landing */}
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
      <nav className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900/50 border-b border-white/10">
        <div className="w-full px-4 md:px-6 py-3 flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold">CarbonChain</span>
          </motion.div>

          <div className="hidden md:flex gap-3 text-sm">
            <Link to="/" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link to="/admin" className="hover:text-blue-400 transition-colors">Admin</Link>
            <Link to="/creator" className="hover:text-blue-400 transition-colors">Creator</Link>
            <Link to="/validator" className="hover:text-blue-400 transition-colors">Validator</Link>
            <Link to="/buyer" className="hover:text-blue-400 transition-colors">Buyer</Link>
          </div>

          <div className="ml-auto text-sm">
            {!user ? (
              <>
                <Link className="mr-3 hover:text-blue-400 transition-colors" to="/login">Login</Link>
                <Link to="/register" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{user.fullName} ({user.role})</span>
                <button 
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all" 
                  onClick={() => { clear(); navigate('/login'); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-900/90 backdrop-blur"
          >
            <div className="px-4 py-4 flex flex-col gap-3 text-sm">
              <Link to="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link to="/admin" className="hover:text-blue-400 transition-colors">Admin</Link>
              <Link to="/creator" className="hover:text-blue-400 transition-colors">Creator</Link>
              <Link to="/validator" className="hover:text-blue-400 transition-colors">Validator</Link>
              <Link to="/buyer" className="hover:text-blue-400 transition-colors">Buyer</Link>
            </div>
          </motion.div>
        )}
      </nav>

      <main className="w-full relative">
        <Outlet />
      </main>
    </div>
  )
}

export default App