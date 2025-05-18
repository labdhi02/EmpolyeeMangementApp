import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Monitor, 
  Mail, 
  Lock, 
  Globe, 
  Save, 
  ChevronDown, 
  CheckCircle,
  X,
  Loader
} from 'lucide-react';
import { useAuth } from '../../../context/authContext';
import { User as AuthUser } from '../../../types/auth';

const AdminSettings = () => {
  const { user } = useAuth();
  // Use optional chaining and fallback for user.name/email to avoid TS error
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: (user as AuthUser)?.name || '',
    email: (user as AuthUser)?.email || '',
    jobTitle: 'System Administrator',
    phoneNumber: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    systemNotifications: true,
    leaveRequests: true,
    newEmployees: true,
    payrollProcessed: true,
    securityAlerts: true,
  });
  
  const [systemSettings, setSystemSettings] = useState({
    darkMode: false,
    compactLayout: false,
    defaultLanguage: 'english',
    timezone: 'IST',
    dataRetention: '90',
    autoLogout: '30',
  });
  
  const [notification, setNotification] = useState<{type: string, message: string} | null>(null);
  
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      setProfileData({
        name: data.user.name || user?.name || '',
        email: data.user.email || user?.email || '',
        jobTitle: data.user.jobTitle || 'System Administrator',
        phoneNumber: data.user.phoneNumber || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to load profile'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };
  
  const handleSystemSettingChange = (setting: string, value: string | boolean) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Save profile data
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // In a real app, save notification and system settings too
      console.log('Saving notification settings:', notificationSettings);
      console.log('Saving system settings:', systemSettings);
      
      // Show success notification
      setNotification({ 
        type: 'success', 
        message: 'Settings saved successfully!' 
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save settings'
      });
    } finally {
      setLoading(false);
      
      // Auto-dismiss notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };
  
  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 bg-white py-3 px-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          Admin Settings
        </h1>
      </div>
      
      {notification && (
        <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
          notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? 
              <CheckCircle className="h-5 w-5 mr-2" /> : 
              <X className="h-5 w-5 mr-2" />
            }
            <p>{notification.message}</p>
          </div>
          <button onClick={dismissNotification} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <Loader size={24} className="text-blue-600 animate-spin mr-3" />
            <p className="text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="md:flex">
          {/* Settings Navigation */}
          <div className="md:w-64 bg-gray-50 p-6 border-r border-gray-100">
            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center p-3 rounded-lg transition-all ${
                      activeTab === 'profile' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User size={20} className="mr-3" />
                    <span className="font-medium">Profile Settings</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center p-3 rounded-lg transition-all ${
                      activeTab === 'notifications' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Bell size={20} className="mr-3" />
                    <span className="font-medium">Notification Preferences</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('system')}
                    className={`w-full flex items-center p-3 rounded-lg transition-all ${
                      activeTab === 'system' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Monitor size={20} className="mr-3" />
                    <span className="font-medium">System Preferences</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center p-3 rounded-lg transition-all ${
                      activeTab === 'security' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Shield size={20} className="mr-3" />
                    <span className="font-medium">Security Settings</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 md:p-8">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center shadow-md">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Admin Profile</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Manage your profile and personal information
                      </p>
                      <button className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700">
                        Change avatar
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input 
                        type="text" 
                        name="jobTitle"
                        value={profileData.jobTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Mail className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.emailAlerts}
                        onChange={() => handleNotificationChange('emailAlerts')}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Bell className="h-6 w-6 text-purple-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">System Notifications</h3>
                        <p className="text-sm text-gray-600">Receive in-app notifications</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.systemNotifications}
                        onChange={() => handleNotificationChange('systemNotifications')}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="p-5 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-4">
                      Events to notify
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Leave requests</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.leaveRequests}
                            onChange={() => handleNotificationChange('leaveRequests')}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">New employee registrations</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.newEmployees}
                            onChange={() => handleNotificationChange('newEmployees')}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Payroll processed</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.payrollProcessed}
                            onChange={() => handleNotificationChange('payrollProcessed')}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Security alerts</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.securityAlerts}
                            onChange={() => handleNotificationChange('securityAlerts')}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Preferences */}
            {activeTab === 'system' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">System Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Monitor className="h-6 w-6 text-indigo-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Dark Mode</h3>
                        <p className="text-sm text-gray-600">Use dark theme across the application</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={systemSettings.darkMode}
                        onChange={() => handleSystemSettingChange('darkMode', !systemSettings.darkMode)}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Monitor className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Compact Layout</h3>
                        <p className="text-sm text-gray-600">Use condensed UI for more content</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={systemSettings.compactLayout}
                        onChange={() => handleSystemSettingChange('compactLayout', !systemSettings.compactLayout)}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Language
                      </label>
                      <div className="relative">
                        <select
                          value={systemSettings.defaultLanguage}
                          onChange={(e) => handleSystemSettingChange('defaultLanguage', e.target.value)}
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="english">English</option>
                          <option value="hindi">Hindi</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <div className="relative">
                        <select
                          value={systemSettings.timezone}
                          onChange={(e) => handleSystemSettingChange('timezone', e.target.value)}
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="IST">India Standard Time (IST)</option>
                          <option value="UTC">Universal Coordinated Time (UTC)</option>
                          <option value="EST">Eastern Standard Time (EST)</option>
                          <option value="PST">Pacific Standard Time (PST)</option>
                          <option value="GMT">Greenwich Mean Time (GMT)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Retention (days)
                      </label>
                      <div className="relative">
                        <select
                          value={systemSettings.dataRetention}
                          onChange={(e) => handleSystemSettingChange('dataRetention', e.target.value)}
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="30">30 days</option>
                          <option value="60">60 days</option>
                          <option value="90">90 days</option>
                          <option value="180">180 days</option>
                          <option value="365">365 days</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auto Logout (minutes)
                      </label>
                      <div className="relative">
                        <select
                          value={systemSettings.autoLogout}
                          onChange={(e) => handleSystemSettingChange('autoLogout', e.target.value)}
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">60 minutes</option>
                          <option value="120">2 hours</option>
                          <option value="never">Never</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-4">
                      <Lock className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="font-medium text-gray-800">Change Password</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="px-5 py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-4">
                      <Globe className="h-6 w-6 text-green-600 mr-3" />
                      <h3 className="font-medium text-gray-800">Login Sessions</h3>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">Current Session</p>
                          <p className="text-sm text-gray-600">Mumbai, India • Chrome on Windows</p>
                          <p className="text-xs text-gray-500 mt-1">Started: {new Date().toLocaleString()}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <button className="mt-4 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                      Logout from all other devices
                    </button>
                  </div>
                  
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-4">
                      <Shield className="h-6 w-6 text-purple-600 mr-3" />
                      <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-3">
                      Add an extra layer of security by enabling two-factor authentication.
                    </p>
                    
                    <button className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Save Button - always visible */}
            <div className="mt-8 border-t border-gray-100 pt-6 flex justify-end">
              <button 
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center font-medium disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
