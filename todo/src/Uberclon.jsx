import React, { useState, useEffect } from 'react';
import { User, MapPin, Clock, Star, Menu, X, Edit2, Save, Camera } from 'lucide-react';

const Uberclon = () => {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // Mock user data
  const mockUsers = [
    {
      id: 1,
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      rating: 4.8,
      trips: 47
    }
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location
      });
    }
  }, [user]);

  const handleLogin = () => {
    const foundUser = mockUsers.find(
      u => u.email === loginForm.email && u.password === loginForm.password
    );
    
    if (foundUser) {
      setUser(foundUser);
      setCurrentView('dashboard');
      setLoginForm({ email: '', password: '' });
    } else {
      alert('Invalid credentials. Try john@example.com / password123');
    }
  };

  const handleSignup = () => {
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.phone) {
      alert('Please fill in all fields');
      return;
    }
    
    const newUser = {
      id: Date.now(),
      ...signupForm,
      location: 'Not specified',
      rating: 5.0,
      trips: 0
    };
    
    setUser(newUser);
    setCurrentView('dashboard');
    setSignupForm({ name: '', email: '', password: '', phone: '' });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    setEditingProfile(false);
  };

  const handleProfileSave = () => {
    setUser({ ...user, ...profileData });
    setEditingProfile(false);
  };

  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-black text-white text-2xl font-bold p-4 rounded-xl mb-4 inline-block">
            UBER
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentView('signup')}
              className="text-black font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
          <strong>Demo:</strong> Use john@example.com / password123
        </div>
      </div>
    </div>
  );

  const SignupPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-black text-white text-2xl font-bold p-4 rounded-xl mb-4 inline-block">
            UBER
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create account</h2>
          <p className="text-gray-600 mt-2">Join millions of riders</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={signupForm.name}
              onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={signupForm.phone}
              onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Create a password"
            />
          </div>
          
          <button
            onClick={handleSignup}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors transform hover:scale-105"
          >
            Create Account
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentView('login')}
              className="text-black font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-black text-white text-xl font-bold p-2 rounded-lg">
            UBER
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard' 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('profile')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'profile' 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <button
          onClick={() => setShowMobileMenu(true)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white w-64 h-full p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-black text-white text-lg font-bold p-2 rounded-lg">
                UBER
              </div>
              <button onClick={() => setShowMobileMenu(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentView('profile');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-600 rounded-lg hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Good morning, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Where would you like to go today?</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Book a ride</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-green-500" size={20} />
                  <input
                    type="text"
                    placeholder="Pickup location"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-red-500" size={20} />
                  <input
                    type="text"
                    placeholder="Where to?"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Find rides
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick actions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Clock className="mx-auto mb-2 text-gray-600" size={24} />
                  <span className="text-sm font-medium">Schedule ride</span>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <User className="mx-auto mb-2 text-gray-600" size={24} />
                  <span className="text-sm font-medium">Ride history</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Your stats</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user?.trips || 0}</div>
                  <div className="text-sm opacity-75">Total trips</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold flex items-center justify-center">
                    <Star className="mr-1 text-yellow-400" size={20} />
                    {user?.rating || 5.0}
                  </div>
                  <div className="text-sm opacity-75">Rating</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent activity</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-400" size={16} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Office → Home</div>
                    <div className="text-xs text-gray-500">Yesterday, 6:30 PM</div>
                  </div>
                  <div className="text-sm font-medium">$12.50</div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-400" size={16} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Airport → Hotel</div>
                    <div className="text-xs text-gray-500">Dec 30, 3:15 PM</div>
                  </div>
                  <div className="text-sm font-medium">$28.90</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const Profile = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            
            <button
              onClick={() => editingProfile ? handleProfileSave() : setEditingProfile(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {editingProfile ? <Save size={16} /> : <Edit2 size={16} />}
              <span>{editingProfile ? 'Save' : 'Edit'}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={32} className="text-gray-500" />
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                <Camera size={12} />
              </button>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user?.name}
              </h2>
              <p className="text-gray-600">Member since 2024</p>
              <div className="flex items-center mt-2">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span className="text-sm font-medium">{user?.rating} rating</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-sm text-gray-600">{user?.trips} trips</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!editingProfile}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!editingProfile}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50 transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!editingProfile}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  disabled={!editingProfile}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50 transition-all"
                />
              </div>
            </div>
          </div>
          
          {editingProfile && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Changes will be saved locally for this demo session.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );

  // Main render logic
  if (!user && currentView === 'login') return <LoginPage />;
  if (!user && currentView === 'signup') return <SignupPage />;
  if (user && currentView === 'dashboard') return <Dashboard />;
  if (user && currentView === 'profile') return <Profile />;
  
  return <LoginPage />;
};

export default Uberclon;