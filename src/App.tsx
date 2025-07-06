import React, { useState, useEffect } from 'react';
import { Monitor, Shield, Brain, Zap, User, Lock, CheckCircle, XCircle, Mail, Phone, Clock, BookOpen, LogOut, Search, Menu, X } from 'lucide-react';
import { AuthModal } from './components/Auth/AuthModal';
import { CourseGrid } from './components/Courses/CourseGrid';
import { CourseFilters } from './components/Courses/CourseFilters';
import { courses } from './data/courses';
import { Course, Purchase, User as UserType } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [notifications, setNotifications] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user data (replace with actual database calls)
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedPurchases = localStorage.getItem('cyberpunk-purchases');
    const savedUsers = localStorage.getItem('cyberpunk-users');
    const savedCurrentUser = localStorage.getItem('cyberpunk-current-user');

    if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('cyberpunk-purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('cyberpunk-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cyberpunk-current-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cyberpunk-current-user');
    }
  }, [currentUser]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  const showNotification = (message: string) => {
    setNotifications(message);
    setTimeout(() => setNotifications(''), 5000);
  };

  const handleAuth = (type: 'signin' | 'signup', data: any) => {
    if (type === 'signup') {
      const newUser: UserType = {
        id: generateId(),
        email: data.email,
        username: data.username,
        phone: data.phone,
        created_at: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      showNotification('Account created successfully!');
    } else {
      const user = users.find(u => u.email === data.email);
      if (user) {
        setCurrentUser(user);
        showNotification('Welcome back!');
      } else {
        showNotification('Invalid credentials');
        return;
      }
    }
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    showNotification('Logged out successfully');
  };

  const handlePurchase = (course: Course) => {
    if (!currentUser) {
      setShowAuthModal(true);
      showNotification('Please sign in to purchase courses');
      return;
    }
    setSelectedCourse(course);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedCourse || !currentUser) return;

    const newPurchase: Purchase = {
      id: generateId(),
      user_id: currentUser.id,
      course_id: selectedCourse.id,
      course_name: selectedCourse.name,
      user_name: currentUser.username,
      user_email: currentUser.email,
      user_phone: currentUser.phone,
      amount: selectedCourse.price,
      payment_status: 'pending',
      created_at: new Date().toISOString()
    };

    setPurchases(prev => [...prev, newPurchase]);
    setShowPurchaseModal(false);
    setActiveSection('payment');
    showNotification(`Purchase request submitted for ${selectedCourse.name}. Please complete payment and wait for approval.`);
  };

  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === 'Adarshkosta' && password === 'Adarshkosta@@1212') {
      setIsAdminLoggedIn(true);
      showNotification('Admin login successful');
    } else {
      showNotification('Invalid admin credentials');
    }
  };

  const approvePurchase = (purchaseId: string) => {
    const updatedPurchases = purchases.map(p => {
      if (p.id === purchaseId) {
        return { ...p, payment_status: 'approved' as const, approved_at: new Date().toISOString() };
      }
      return p;
    });

    setPurchases(updatedPurchases);
    const purchase = purchases.find(p => p.id === purchaseId);
    if (purchase) {
      showNotification(`Payment approved for ${purchase.user_name}. Course access granted!`);
      
      // Find course details
      const course = courses.find(c => c.id === purchase.course_id);
      if (course) {
        setTimeout(() => {
          alert(`📧 Email sent to ${purchase.user_email}\n\nSubject: Course Access Granted - ${purchase.course_name}\n\nHi ${purchase.user_name},\n\nYour payment has been approved! You now have access to:\n\n${purchase.course_name}\n\nCourse Link: ${course.driveLink}\n\nWelcome to CyberCourse Academy!\n\nFor support: adarshkosta1@gmail.com`);
        }, 1000);
      }
    }
  };

  const rejectPurchase = (purchaseId: string) => {
    const updatedPurchases = purchases.filter(p => p.id !== purchaseId);
    setPurchases(updatedPurchases);
    showNotification('Payment rejected and removed from system');
  };

  const pendingPurchases = purchases.filter(p => p.payment_status === 'pending');
  const userCourses = currentUser ? purchases.filter(p => p.user_id === currentUser.id && p.payment_status === 'approved') : [];

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-cyan-300 font-mono">
      {/* Notification */}
      {notifications && (
        <div className="fixed top-4 right-4 z-50 bg-cyan-500 text-black px-6 py-3 rounded-lg shadow-lg animate-pulse max-w-sm">
          {notifications}
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-cyan-500/30 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-cyan-400 tracking-wider">
            <Zap className="inline w-8 h-8 mr-2" />
            CYBERCOURSE
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {['home', 'courses', 'payment', 'library', 'admin'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === section
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/50'
                    : 'hover:bg-cyan-500/20 hover:text-cyan-400'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-cyan-400">Welcome, {currentUser.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cyan-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 border-t border-cyan-500/30">
            <div className="px-6 py-4 space-y-4">
              {['home', 'courses', 'payment', 'library', 'admin'].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    setActiveSection(section);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === section
                      ? 'bg-cyan-500 text-black'
                      : 'hover:bg-cyan-500/20 hover:text-cyan-400'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black px-6 py-2 rounded-lg font-bold"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20">
        {/* Home Section */}
        {activeSection === 'home' && (
          <section className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                LEARN THE FUTURE
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-gray-300">
                Master cutting-edge technologies with our cyberpunk-themed courses
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setActiveSection('courses')}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black px-12 py-4 rounded-lg text-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Explore 100+ Courses
                </button>
                {!currentUser && (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-4 rounded-lg text-xl font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Courses Section */}
        {activeSection === 'courses' && (
          <section className="min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-center mb-16 text-cyan-400">
                100+ PREMIUM COURSES
              </h2>
              
              <CourseFilters
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onSearchChange={setSearchTerm}
                onCategoryChange={setSelectedCategory}
              />

              <div className="mb-8 text-center">
                <p className="text-gray-300 text-lg">
                  Showing {filteredCourses.length} of {courses.length} courses
                </p>
              </div>

              <CourseGrid courses={filteredCourses} onPurchase={handlePurchase} />
            </div>
          </section>
        )}

        {/* Payment Section */}
        {activeSection === 'payment' && (
          <section className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-center mb-16 text-cyan-400">
                PAYMENT PORTAL
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* QR Code */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 text-pink-400">Scan QR Code to Pay</h3>
                  <div className="bg-white p-6 rounded-lg inline-block shadow-lg">
                    <img
                      src="/payment-qr.png"
                      alt="UPI Payment QR Code"
                      className="w-80 h-80 object-contain rounded-lg"
                      onError={(e) => {
                        console.log('QR Code failed to load');
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.textContent = 'QR Code not available. Please use UPI ID below.';
                      }}
                    />
                    <div className="hidden text-red-500 text-sm mt-2"></div>
                  </div>
                  <div className="mt-6 bg-black/50 border border-cyan-500/30 rounded-lg p-4">
                    <p className="text-cyan-300 text-lg">
                      UPI ID: <span className="text-pink-400 font-bold text-xl">adarshkosta@fam</span>
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Scan QR or use UPI ID for instant payment
                    </p>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-cyan-400">Payment Instructions</h3>
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-start">
                      <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                      <p>Scan the QR code or use UPI ID: <span className="text-pink-400 font-bold">adarshkosta@fam</span></p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                      <p>Complete the payment for your selected course</p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                      <p>Click "Verify Payment" button below after payment</p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</span>
                      <p>Wait for admin approval (1-2 hours)</p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">5</span>
                      <p>Access your course from the Library section</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      onClick={() => showNotification('Payment request submitted! Please wait for admin approval (1-2 hours). You will receive course access via email.')}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                    >
                      ✅ Verify Payment
                    </button>
                    <p className="text-gray-400 text-sm mt-3 text-center">
                      Click after completing payment. Approval takes 1-2 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Library Section */}
        {activeSection === 'library' && (
          <section className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-center mb-16 text-cyan-400">
                COURSE LIBRARY
              </h2>

              {!currentUser ? (
                <div className="text-center">
                  <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-300 mb-4">Sign In Required</h3>
                  <p className="text-gray-400 mb-8">Please sign in to access your course library</p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-pink-400 mb-2">
                      Welcome back, {currentUser.username}!
                    </h3>
                    <p className="text-gray-300">You have {userCourses.length} course(s) in your library</p>
                  </div>

                  {userCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-300">No courses found in your library</p>
                      <p className="text-gray-400 mt-2 mb-6">Purchase a course to get started!</p>
                      <button
                        onClick={() => setActiveSection('courses')}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                      >
                        Browse Courses
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userCourses.map((purchase) => {
                        const course = courses.find(c => c.id === purchase.course_id);
                        return (
                          <div
                            key={purchase.id}
                            className="bg-black/50 border border-cyan-500/30 rounded-lg p-6"
                          >
                            <div className="flex items-center mb-4">
                              <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                              <h4 className="text-xl font-bold text-cyan-400">{purchase.course_name}</h4>
                            </div>
                            <p className="text-gray-300 mb-4">
                              Purchased on: {new Date(purchase.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-gray-300 mb-4">
                              Instructor: {course?.instructor}
                            </p>
                            <a
                              href={course?.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                            >
                              Access Course
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Admin Section */}
        {activeSection === 'admin' && (
          <section className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-center mb-16 text-cyan-400">
                ADMIN CONTROL PANEL
              </h2>

              {!isAdminLoggedIn ? (
                <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold mb-6 text-center text-pink-400">Admin Login</h3>
                  <form onSubmit={handleAdminLogin} className="space-y-6">
                    <div>
                      <label className="block text-cyan-300 mb-2">
                        <User className="inline w-5 h-5 mr-2" />
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        required
                        className="w-full bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-300 focus:border-cyan-500 focus:outline-none"
                        placeholder="Enter admin username"
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-300 mb-2">
                        <Lock className="inline w-5 h-5 mr-2" />
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        className="w-full bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-300 focus:border-cyan-500 focus:outline-none"
                        placeholder="Enter admin password"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
                    >
                      Login
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-bold text-pink-400">
                      Pending Payments ({pendingPurchases.length})
                    </h3>
                    <button
                      onClick={() => setIsAdminLoggedIn(false)}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>

                  {pendingPurchases.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-300">No pending payments to review</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingPurchases.map((purchase) => (
                        <div
                          key={purchase.id}
                          className="bg-black/50 border border-cyan-500/30 rounded-lg p-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <p><span className="text-pink-400 font-bold">Name:</span> {purchase.user_name}</p>
                              <p><span className="text-pink-400 font-bold">Email:</span> {purchase.user_email}</p>
                              <p><span className="text-pink-400 font-bold">Phone:</span> {purchase.user_phone}</p>
                              <p><span className="text-pink-400 font-bold">Course:</span> {purchase.course_name}</p>
                            </div>
                            <div className="space-y-3">
                              <p><span className="text-pink-400 font-bold">Amount:</span> ₹{purchase.amount.toLocaleString()}</p>
                              <p><span className="text-pink-400 font-bold">Date:</span> {new Date(purchase.created_at).toLocaleString()}</p>
                              <div className="flex space-x-4 mt-4">
                                <button
                                  onClick={() => approvePurchase(purchase.id)}
                                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  <CheckCircle className="w-5 h-5 mr-2" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectPurchase(purchase.id)}
                                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  <XCircle className="w-5 h-5 mr-2" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-lg max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-6 text-cyan-400">Purchase {selectedCourse.name}</h3>
            <div className="mb-6">
              <p className="text-gray-300 mb-2">Course: {selectedCourse.name}</p>
              <p className="text-gray-300 mb-2">Price: ₹{selectedCourse.price.toLocaleString()}</p>
              <p className="text-gray-300 mb-4">Instructor: {selectedCourse.instructor}</p>
            </div>
            <form onSubmit={handlePurchaseSubmit} className="space-y-6">
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-black py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  Proceed to Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />

      {/* Footer */}
      <footer className="bg-black/80 border-t border-cyan-500/30 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-cyan-400" />
              <span>adarshkosta1@gmail.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-cyan-400" />
              <span>+91 98765 43210</span>
            </div>
          </div>
          <p className="text-gray-400">
            © 2024 CyberCourse. All rights reserved. Built with cyberpunk aesthetics.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;