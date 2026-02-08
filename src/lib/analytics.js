import { getServerSession } from 'next-auth/nextjs'
;
;// Analytics tracking utilities
class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId()
    this.initTracking()
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  initTracking() {
    if (typeof window !== 'undefined') {
      // Track page view
      this.trackEvent('page_view', {
        page: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      })

      // Track UTM parameters
      this.trackUTMParameters()
    }
  }

  trackUTMParameters() {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const utmParams = {
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        utm_term: urlParams.get('utm_term'),
        utm_content: urlParams.get('utm_content')
      }

      // Store UTM parameters in session storage
      Object.keys(utmParams).forEach(key => {
        if (utmParams[key]) {
          sessionStorage.setItem(key, utmParams[key])
        }
      })
    }
  }

  getUTMParameter(param) {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(param) || new URLSearchParams(window.location.search).get(param)
    }
    return null
  }

  async trackEvent(eventType, eventData = {}) {
    try {
      const session = await getServerSession()
      
      const payload = {
        eventType,
        eventData: {
          ...eventData,
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId
        },
        userId: session?.user?.id || null,
        sessionId: this.sessionId,
        referrer: this.getUTMParameter('referrer') || (typeof window !== 'undefined' ? document.referrer : null),
        utmSource: this.getUTMParameter('utm_source'),
        utmMedium: this.getUTMParameter('utm_medium'),
        utmCampaign: this.getUTMParameter('utm_campaign'),
        utmTerm: this.getUTMParameter('utm_term'),
        utmContent: this.getUTMParameter('utm_content')
      }

      // Send to analytics API
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  async trackUserRegistration(userId, acquisitionData = {}) {
    await this.trackEvent('user_registration', {
      userId,
      acquisitionChannel: acquisitionData.channel || 'organic',
      ...acquisitionData
    })

    // Track registration in dedicated table
    try {
      await fetch('/api/analytics/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          registrationDate: new Date().toISOString().split('T')[0],
          referrer: this.getUTMParameter('referrer'),
          utmSource: this.getUTMParameter('utm_source'),
          utmMedium: this.getUTMParameter('utm_medium'),
          utmCampaign: this.getUTMParameter('utm_campaign'),
          acquisitionChannel: acquisitionData.channel || 'organic'
        })
      })
    } catch (error) {
      console.error('Registration tracking error:', error)
    }
  }

  async trackAppointmentBooking(appointmentData, conversionTime = null) {
    await this.trackEvent('appointment_booking', {
      appointmentId: appointmentData.id,
      serviceType: appointmentData.serviceType,
      status: appointmentData.status,
      conversionTime
    })

    // Track booking in dedicated table
    try {
      await fetch('/api/analytics/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointmentData.id,
          userId: appointmentData.userId,
          serviceType: appointmentData.serviceType,
          bookingDate: appointmentData.appointmentDate,
          bookingTime: appointmentData.appointmentTime,
          status: appointmentData.status,
          conversionTime,
          referrer: this.getUTMParameter('referrer'),
          utmSource: this.getUTMParameter('utm_source'),
          utmMedium: this.getUTMParameter('utm_medium'),
          utmCampaign: this.getUTMParameter('utm_campaign'),
          deviceType: this.getDeviceType(),
          browser: this.getBrowser()
        })
      })
    } catch (error) {
      console.error('Appointment tracking error:', error)
    }
  }

  async trackNewsletterSignup(subscriberId, signupData = {}) {
    await this.trackEvent('newsletter_signup', {
      subscriberId,
      signupSource: signupData.source || 'unknown',
      conversionTime: signupData.conversionTime
    })

    // Track signup in dedicated table
    try {
      await fetch('/api/analytics/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId,
          signupDate: new Date().toISOString().split('T')[0],
          signupSource: signupData.source || 'unknown',
          referrer: this.getUTMParameter('referrer'),
          utmSource: this.getUTMParameter('utm_source'),
          utmMedium: this.getUTMParameter('utm_medium'),
          utmCampaign: this.getUTMParameter('utm_campaign'),
          conversionTime: signupData.conversionTime,
          deviceType: this.getDeviceType(),
          browser: this.getBrowser()
        })
      })
    } catch (error) {
      console.error('Newsletter tracking error:', error)
    }
  }

  async trackFunnelStep(funnelName, stepName, stepNumber) {
    try {
      await fetch('/api/analytics/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnelName,
          stepName,
          stepNumber,
          date: new Date().toISOString().split('T')[0]
        })
      })
    } catch (error) {
      console.error('Funnel tracking error:', error)
    }
  }

  getDeviceType() {
    if (typeof window === 'undefined') return 'unknown'
    
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'mobile'
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet'
    } else if (/desktop|windows|mac|linux/i.test(userAgent)) {
      return 'desktop'
    }
    
    return 'unknown'
  }

  getBrowser() {
    if (typeof window === 'undefined') return 'unknown'
    
    const userAgent = navigator.userAgent
    
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'
    
    return 'unknown'
  }

  // Calculate conversion time from first visit
  calculateConversionTime() {
    if (typeof window === 'undefined') return null
    
    const firstVisit = sessionStorage.getItem('first_visit')
    if (!firstVisit) {
      sessionStorage.setItem('first_visit', new Date().toISOString())
      return null
    }
    
    const visitTime = new Date(firstVisit)
    const currentTime = new Date()
    return Math.floor((currentTime - visitTime) / (1000 * 60)) // minutes
  }
}

// Create singleton instance
let analyticsInstance = null

export function getAnalyticsTracker() {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker()
  }
  return analyticsInstance
};

// React Hook for analytics
export function useAnalytics() {
  const tracker = getAnalyticsTracker()
  
  return {
    trackEvent: tracker.trackEvent.bind(tracker),
    trackUserRegistration: tracker.trackUserRegistration.bind(tracker),
    trackAppointmentBooking: tracker.trackAppointmentBooking.bind(tracker),
    trackNewsletterSignup: tracker.trackNewsletterSignup.bind(tracker),
    trackFunnelStep: tracker.trackFunnelStep.bind(tracker),
    getUTMParameter: tracker.getUTMParameter.bind(tracker),
    calculateConversionTime: tracker.calculateConversionTime.bind(tracker)
  }
}
