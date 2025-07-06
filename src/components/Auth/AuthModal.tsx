import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (type: 'signin' | 'signup', data: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth(isSignUp ? 'signup' : 'signin', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-lg max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <div>
                <label className="block text-cyan-300 mb-2">
                  <User className="inline w-5 h-5 mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-300 focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-2">
                  <Phone className="inline w-5 h-5 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-300 focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-cyan-300 mb-2">
              <Mail className="inline w-5 h-5 mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-300 focus:border-cyan-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-cyan-300 mb-2">
              <Lock className="inline w-5 h-5 mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-300 focus:border-cyan-500 focus:outline-none pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-cyan-400 hover:text-cyan-300 ml-2 font-semibold"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
