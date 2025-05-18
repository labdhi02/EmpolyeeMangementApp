import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Moon, 
  Lock, 
  User, 
  Shield,
  Mail,
  Phone,
  Calendar,
  Globe,
  Save,
  Monitor,
  ChevronDown,
  CheckCircle,
  X,
  Loader
} from 'lucide-react';

interface SettingsForm {
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'system';
    compactView: boolean;
  };
  notifications: {
    email: boolean;
    desktop: boolean;
    salary: boolean;
    attendance: boolean;
    leaves: boolean;
    announcements: boolean;
  };
}

const EmployeeSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsForm>({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: ''
    },
    preferences: {
      language: 'english',
      timezone: 'IST',
      theme: 'light',
      compactView: false
    },
    notifications: {
      email: true,
      desktop: true,
      salary: true,
      attendance: true,
      leaves: true,
      announcements: true
    }
  });
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/employee/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSettings(prev => ({
          ...prev,
          personalInfo: {
            firstName: data.employee.firstName || '',
            lastName: data.employee.lastName || '',
            email: data.employee.email || '',
            phone: data.employee.phone || '',
            dateOfBirth: data.employee.dateOfBirth || '',
            address: data.employee.address || ''
          }
        }));
      }
    } catch (error) {
      showNotification('error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/employee/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        showNotification('success', 'Settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      showNotification('error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('', '');
    setLoading(true);

    try {
      if (settings.newPassword !== settings.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/employee/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      showNotification('success', 'Password updated successfully');
      setSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
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
            <button 
              onClick={() => setNotification(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-64 bg-gray-50 p-6 border-r border-gray-200">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'profile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <User className="inline-block w-5 h-5 mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'preferences' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Monitor className="inline-block w-5 h-5 mr-2" />
                  Preferences
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'notifications' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Bell className="inline-block w-5 h-5 mr-2" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'security' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Shield className="inline-block w-5 h-5 mr-2" />
                  Security
                </button>
              </nav>
            </div>

            <div className="flex-1 p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800">Profile Settings</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={settings.personalInfo.firstName}
                      onChange={(e) => setSettings({ ...settings, personalInfo: { ...settings.personalInfo, firstName: e.target.value } })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={settings.personalInfo.lastName}
                      onChange={(e) => setSettings({ ...settings, personalInfo: { ...settings.personalInfo, lastName: e.target.value } })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.personalInfo.email}
                      onChange={(e) => setSettings({ ...settings, personalInfo: { ...settings.personalInfo, email: e.target.value } })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={settings.personalInfo.phone}
                      onChange={(e) => setSettings({ ...settings, personalInfo: { ...settings.personalInfo, phone: e.target.value } })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={settings.personalInfo.dateOfBirth}
                      onChange={(e) => setSettings({ ...settings, personalInfo: { ...settings.personalInfo, dateOfBirth: e.target.value } })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={settings.personalInfo.address}
                      onChange={(e) => setSettings({ ...settings, personalInfo: { ...settings.personalInfo, address: e.target.value } })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800">Preferences</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, language: e.target.value } })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <input
                      type="text"
                      value={settings.preferences.timezone}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, timezone: e.target.value } })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      value={settings.preferences.theme}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, theme: e.target.value as 'light' | 'dark' | 'system' } })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.preferences.compactView}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, compactView: e.target.checked } })}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Enable Compact View
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, email: e.target.checked } })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Desktop Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications on desktop</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.desktop}
                          onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, desktop: e.target.checked } })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={settings.currentPassword}
                        onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={settings.newPassword}
                        onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={settings.confirmPassword}
                        onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettings;
