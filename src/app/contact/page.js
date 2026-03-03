'use client'

import { useState } from 'react'
;
;export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Client-side validation
  const validateForm = () => {
    const newErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters'
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    } else if (formData.subject.length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters'
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear general error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Client-side validation first
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    setErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Thank you for contacting us! We will get back to you soon.')
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        // Handle different error types
        if (data.type === 'rate_limit') {
          setError(`Rate limit exceeded. ${data.message}`)
        } else if (data.type === 'spam_filter') {
          setError(data.error)
        } else if (data.type === 'honeypot') {
          setError(data.error)
        } else if (data.fields) {
          setErrors(data.fields)
          setError('Please correct the errors below')
        } else {
          setError(data.error || 'Failed to submit contact form')
        }
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getInputClass = (fieldName) => {
    return `w-full px-3 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
      errors[fieldName] 
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300'
    }`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-2 text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-4.474 4.474 0-8-8.53a8 8 0 100-4.474 4.474 0-8-8.53zm-3.052a1 1 0 011.052 1.419 0-2.367-2.367 0-4.474 4.474 0-8-8.53l-2.367 2.367a1 1 0 011.052 1.419 0-2.367-2.367 0-4.474 4.474 0-8-8.53z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-4.474 4.474 0-8-8.53a8 8 0 100-4.474 4.474 0-8-8.53zm-3.052a1 1 0 011.052 1.419 0-2.367-2.367 0-4.474 4.474 0-8-8.53l-2.367 2.367a1 1 0 011.052 1.419 0-2.367-2.367 0-4.474 4.474 0-8-8.53z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-4.474 4.474 0-8-8.53a8 8 0 100-4.474 4.474 0-8-8.53zm-3.052a1 1 0 011.052 1.419 0-2.367-2.367 0-4.474 4.474 0-8-8.53l-2.367 2.367a1 1 0 011.052 1.419 0-2.367-2.367 0-4.474 4.474 0-8-8.53z" clipRule="evenodd" />
                  </svg>
                  <span>Please correct the errors below:</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={getInputClass('name')}
                  placeholder="Your full name"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClass('email')}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={getInputClass('subject')}
                  placeholder="How can we help you?"
                  maxLength={200}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className={getInputClass('message')}
                  placeholder="Tell us more about your needs..."
                  minLength={10}
                  maxLength={2000}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.message.length}/2000 characters (minimum 10 characters)
                </p>
              </div>

              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="honeypot"
                tabIndex="-1"
                autoComplete="off"
                style={{ 
                  position: 'absolute', 
                  left: '-9999px', 
                  top: '-9999px',
                  opacity: 0,
                  height: 0,
                  width: 0
                }}
              />

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 100-4.474 4.474 0-8-8.53a8 8 0 100-4.474 4.474 0-8-8.53zm-3.052a1 1 0 011.052 1.419 0-2.367-2.367 0-4.474 4.474 0-8-8.53l-2.367 2.367a1 1 0 011.052 1.419 0-2.367-2.367 0-4.474 4.474 0-8-8.53z" clipRule="evenodd" />
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAACUCAMAAAAOCP0eAAAAbFBMVEX///8AAADd3d1YWFj29vaPj4+wsLAcHBy6urq0tLQHBwe+vr7Gxsb5+fmCgoI3NzdBQUFRUVHS0tJlZWVeXl4ODg4YGBju7u5sbGwwMDDMzMzn5+ciIiKXl5eJiYlxcXEpKSl5eXlJSUmmpqZ2AIvzAAAEoElEQVR4nO2c6XqqMBCGA1JFC4gbLkHFev/3eECP8iUsbsnknD7z/WoTS/J2kpnJgkKwWCwWi8VisVgsFovFYrFYLJZrBb5LrQ2SRMuBQ30bJAlXnkONTZKMHIJMmIRJmIRJjJCkX1a1T3IqkvwcBzZ1WFGReKPQ4MMb2qtx2PI8MZlBaNoTzpNKtqwS6yD2fZcdqwQNEEsk2couStMitkiShV2rAEg+tUoSyoGlf9ZFX/B/OuytkgyFTOvGRmZRYgQ5BWPLJCLIAMWoB0OQYyyGtklEDCgm5wpO9kX5u30SEaQWUBSvdaxKCEiEnEGrkZEWlDhyiqsiChLhgwczYhW0yCQJLmUkJMZRDvXTVsnf/S0aEmWAZR83hV7rBkJFIuS0bjz/sC2wSBlHbqVUJCKG5vOP4gqCbOJ7MRmJENCB1QcoCLKAckKSeAt9eBdFSVEQhJJErH+gF+95sEDJtZQqShLhgwebvGMVxSJJoNSRknyMgnMk0c5JaEmEDwPs9cw46QGhJhESpn3xYpsIcgr0WmoSEUB3ti9ZBUE2zWpyEiWuvBIiT/B3i5Z6ByRB8cZciZMHIC5IhIRpnz8XV3riyE0uSBRn/BSKGkfi1s84IVFQiicGmOJ+G17rKjckKspDq5yeAHFFouyDbR+gIEgzjtzkikSss2dREKTVa13ljEQEsPvdN1cQpCUg3uWORKwhcZl2WSV+ENlrOSRR4koHSqCs2Xuf5pJEzIsHKDGCHPof5pRkjOvhactcwaHl7fsf5pJkWGBHvWKnf+Co1Gf9KA5JwsxTNdX2jI9afb9V3JFEej9LFMUqDRDPO/c8zxlJ2OynGiI3bR/oQXFF8o1uq/4xvQ0wJY7UyoftibA7km/o/TKCdDIdy4rDR5ADmKfoRHFD8g3541KKOW4eHc/D4Rfu8SUigCmz7UJxQhIByMIvCxBF16Hs+RpROnrqgiTCoeVfirpRDpc0XgJKx+aSA5I53GoZ+LdCPFYF3Za6EuZK1pqj0ZNI6OfMvxf7YKhaddK4xosj83+BZA4dGvhQ4bdYBbNfBaXlBJmaBNPfma9UrQda+jJVsxO5rKvyJgoxCU6Hn8YYOS9gCqUnvR5RmosAWpIdxIkmSGmWcL9J88lqO0vOjcy4RIHD8FS3CikJWiRtm7VVb+e7KNp1vETiL7tRKEnQPXWBPBBeUdiqjyAkkTAJpi1j5ylhCM0Uj0FHggcn6bsg6u6lJ6GCjESaAdESG0ChIvHh7nvD7bwmRBnVc4WIBAO4vlx/WXPcJ7ujEN2KwrOfT4bWVXPYXbo7QZqbanh2/TlIGWFb/DnJ7UEYWisTINru5dUZU9zohLEwMXMNsrQKeJDRJSEguGXrQZumQEqr4HqmWldaJ1FuEpgDUdfQFYptErw1+PhA8SUhSiEtk4R4k3Nk+mWHCKb9jwytkiQPVqwfagdPXyZWSfBNGvMgCsoqs0pi1SKVds2GbJPYAWlDsUxiC6REmVCSWH0zMyroSOy+LasfV/7PbzCnZCS0YhImYRImeZfk13ybz+/5hqXf861XLBaLxWKxWCwWi8VisVgsFov1nv4Ao/lUHXQlAREAAAAASUVORK5CYII=" 
                    alt="Email Icon" 
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">glad.tidings.health@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img 
                    src="data:image/png;base64,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" 
                    alt="Phone Icon" 
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">+254 237 30980</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img 
                    src="data:image/png;base64,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" 
                    alt="Address Icon" 
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    P.O. Box 107, Sare<br />
                    Awendo Town<br />
                    MIGORI, Kenya
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10">
                  <img 
                    src="data:image/png;base64,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" 
                    alt="Office Hours Icon" 
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Office Hours</h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Sunday - Friday:</span> 9:00 AM - 6:00 PM<br />
                    <span className="font-medium text-red-600">Saturday:</span> Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Find Us at Skyrider Awendo</h3>
              <div className="rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d-1.0437!2d34.4833!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSkyrider%20Awendo%2C%20Migori%2C%20Kenya!5e0!3m2!1sen!2ske!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title="Glad Tidings Office Location - Skyrider Awendo"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Located at Skyrider Awendo, easily accessible from all directions in Migori County.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};;
