'use client'

import { useState } from 'react'
;
;export default function SettingsManagement() {
  // State for each section
  const [websiteInfo, setWebsiteInfo] = useState({
    siteName: 'Glad Tidings Medical Missionary',
    siteDescription: 'Bringing hope and healing through medical missionary work and evangelism',
    siteUrl: 'https://gladtidings.org',
    contactEmail: 'info@gladtidings.org',
    contactPhone: '+254-123-456-7890',
    address: '123 Mission Street, Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    postalCode: '00100',
    timezone: 'Africa/Nairobi'
  })

  const [contactDetails, setContactDetails] = useState({
    primaryEmail: 'info@gladtidings.org',
    supportEmail: 'support@gladtidings.org',
    prayerEmail: 'prayer@gladtidings.org',
    volunteerEmail: 'volunteer@gladtidings.org',
    donationEmail: 'donate@gladtidings.org',
    primaryPhone: '+254-123-456-7890',
    supportPhone: '+254-123-456-7891',
    fax: '+254-123-456-7892',
    officeHours: 'Monday-Friday 9:00 AM - 5:00 PM',
    emergencyContact: '+254-712-345-6789'
  })

  const [socialMedia, setSocialMedia] = useState({
    facebook: 'https://facebook.com/gladtidings',
    twitter: 'https://twitter.com/gladtidings',
    instagram: 'https://instagram.com/gladtidings',
    youtube: 'https://youtube.com/gladtidings',
    linkedin: 'https://linkedin.com/company/gladtidings',
    whatsapp: 'https://wa.me/2541234567890'
  })

  const [adminProfile, setAdminProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@gladtidings.org',
    username: 'admin',
    role: 'Administrator',
    bio: 'Administrator managing Glad Tidings Medical Missionary website and communications.',
    avatar: null,
    lastLogin: '2024-01-29 16:30:00',
    notifications: {
      email: true,
      sms: true,
      push: true,
      weeklyDigest: true,
      newAnnouncements: true,
      systemUpdates: false
    }
  })

  const [activeSection, setActiveSection] = useState('website')
  const [saveStatus, setSaveStatus] = useState({})

  const handleSave = (section) => {
    setSaveStatus({ ...saveStatus, [section]: 'saving' })
    
    // Mock save operation
    setTimeout(() => {
      setSaveStatus({ ...saveStatus, [section]: 'success' })
      setTimeout(() => {
        setSaveStatus({})
      }, 2000)
    }, 1000)
  }

  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage website configuration and administrative settings</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('website')}
              className={`py-4 px-1 border-b-2 border-transparent text-sm font-medium transition-colors ${
                activeSection === 'website'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Website Info
            </button>
            <button
              onClick={() => setActiveSection('contact')}
              className={`py-4 px-1 border-b-2 border-transparent text-sm font-medium transition-colors ${
                activeSection === 'contact'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Contact Details
            </button>
            <button
              onClick={() => setActiveSection('social')}
              className={`py-4 px-1 border-b-2 border-transparent text-sm font-medium transition-colors ${
                activeSection === 'social'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Social Media
            </button>
            <button
              onClick={() => setActiveSection('profile')}
              className={`py-4 px-1 border-b-2 border-transparent text-sm font-medium transition-colors ${
                activeSection === 'profile'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin Profile
            </button>
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Website Info Section */}
        {activeSection === 'website' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Website Information</h2>
              
              <div className="grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={websiteInfo.siteName}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, siteName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Description *</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Describe your website..."
                    value={websiteInfo.siteDescription}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, siteDescription: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site URL *</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://example.com"
                    value={websiteInfo.siteUrl}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, siteUrl: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="contact@example.com"
                    value={websiteInfo.contactEmail}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, contactEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+254-123-456-7890"
                    value={websiteInfo.contactPhone}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, contactPhone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="123 Main Street"
                    value={websiteInfo.address}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nairobi"
                    value={websiteInfo.city}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Kenya"
                    value={websiteInfo.country}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, country: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="00100"
                    value={websiteInfo.postalCode}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, postalCode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={websiteInfo.timezone}
                    onChange={(e) => setWebsiteInfo({...websiteInfo, timezone: e.target.value})}
                  >
                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                    <option value="Africa/Cairo">Africa/Cairo</option>
                    <option value="Africa/Lagos">Africa/Lagos</option>
                    <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                    <option value="Africa/Addis Ababa">Africa/Addis Ababa</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('website')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  disabled={saveStatus.website === 'saving'}
                >
                  {saveStatus.website === 'saving' ? 'Saving...' : saveStatus.website === 'success' ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Details Section */}
        {activeSection === 'contact' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h2>
              
              <div className="space-y-4">
                {/* Email Addresses */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Email Addresses</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Primary Email *</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={contactDetails.primaryEmail}
                        onChange={(e) => setContactDetails({...contactDetails, primaryEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Support Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={contactDetails.supportEmail}
                        onChange={(e) => setContactDetails({...contactDetails, supportEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Prayer Request Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={contactDetails.prayerEmail}
                        onChange={(e) => setContactDetails({...contactDetails, prayerEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Volunteer Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={contactDetails.volunteerEmail}
                        onChange={(e) => setContactDetails({...contactDetails, volunteerEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Donation Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={contactDetails.donationEmail}
                        onChange={(e) => setContactDetails({...contactDetails, donationEmail: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Phone Numbers</h3>
                  <div className="grid grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Primary Phone *</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={contactDetails.primaryPhone}
                        onChange={(e) => setContactDetails({...contactDetails, primaryPhone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Support Phone</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={contactDetails.supportPhone}
                        onChange={(e) => setContactDetails({...contactDetails, supportPhone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Fax</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={contactDetails.fax}
                        onChange={(e) => setContactDetails({...contactDetails, fax: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Office Hours</h3>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={contactDetails.officeHours}
                    onChange={(e) => setContactDetails({...contactDetails, officeHours: e.target.value})}
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Emergency Contact</h3>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={contactDetails.emergencyContact}
                    onChange={(e) => setContactDetails({...contactDetails, emergencyContact: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('contact')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  disabled={saveStatus.contact === 'saving'}
                >
                  {saveStatus.contact === 'saving' ? 'Saving...' : saveStatus.contact === 'success' ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Section */}
        {activeSection === 'social' && (
          <div className="social media management page">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h2>
                <p className="text-gray-600">Connect with your community through social media platforms</p>
              </div>

              <div className="grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://facebook.com/yourpage"
                    value={socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://twitter.com/yourpage"
                    value={socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://instagram.com/yourpage"
                    value={socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://youtube.com/yourchannel"
                    value={socialMedia.youtube}
                    onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://linkedin.com/company/your-page"
                    value={socialMedia.linkedin}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://wa.me/1234567890"
                    value={socialMedia.whatsapp}
                    onChange={(e) => handleSocialMediaChange('whatsapp', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('social')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  disabled={saveStatus.social === 'saving'}
                >
                  {saveStatus.social === 'saving' ? 'Saving...' : saveStatus.social === 'success' ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Profile Section */}
        {activeSection === 'profile' && (
          <div className="admin profile settings page">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Profile</h2>
                <p className="text-gray-600">Manage your administrative account and preferences</p>
              </div>

              <div className="grid grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={adminProfile.firstName}
                        onChange={(e) => setAdminProfile({...adminProfile, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={adminProfile.lastName}
                        onChange={(e) => setAdminProfile({...adminProfile, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={adminProfile.username}
                        onChange={(e) => setAdminProfile({...adminProfile, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={adminProfile.email}
                        onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={adminProfile.role}
                        onChange={(e) => setAdminProfile({...adminProfile, role: e.target.value})}
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Profile Settings */}
                <div>
                  <h3 className="display: text-md font-medium text-gray-700 mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Tell us about yourself..."
                        value={adminProfile.bio}
                        onChange={(e) => setAdminProfile({...adminProfile, bio: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Avatar</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {adminProfile.firstName[0]}{adminProfile.lastName[0]}
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                        >
                          Change Avatar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div>
                    <h3 className="display: text-md font-medium text-gray-700 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          checked={adminProfile.notifications.email}
                          onChange={(e) => setAdminProfile({
                            ...adminProfile,
                            notifications: {
                              ...adminProfile.notifications,
                              email: e.target.checked
                            }
                          })}
                        />
                        <label className="ml-2 text-sm text-gray-700">Email Notifications</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          checked={adminProfile.notifications.sms}
                          onChange={(e) => setAdminProfile({
                            ...adminProfile,
                            notifications: {
                              ...adminProfile.notifications,
                              sms: e.target.checked
                            }
                          })}
                        />
                        <label className="ml-2 text-sm text-gray-700">SMS Notifications</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          checked={adminProfile.notifications.push}
                          onChange={(e) => setAdminProfile({
                            ...adminProfile,
                            notifications: {
                              ...adminProfile.notifications,
                              push: e.target.checked
                            }
                          })}
                        />
                        <label className="ml-2 text-sm text-gray-700">Push Notifications</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          checked={adminProfile.notifications.weeklyDigest}
                          onChange={(e) => setAdminProfile({
                            ...adminProfile,
                            notifications: {
                              ...adminProfile.notifications,
                              weeklyDigest: e.target.checked
                            }
                          })}
                        />
                        <label className="ml-2 text-sm text-gray-700">Weekly Digest</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave('profile')}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      disabled={saveStatus.profile === 'saving'}
                    >
                      {saveStatus.profile === 'saving' ? 'Saving...' : saveStatus.profile === 'success' ? 'Saved!' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
};;
