'use client'

import { useEffect, useRef } from 'react'
;
;export default function AnalyticsTracker({ children }) {
  const trackerRef = useRef(null)
  const hasTracked = useRef(false)

  useEffect(() => {
    // Only track once per component mount
    if (hasTracked.current) return
    hasTracked.current = true

    // Initialize analytics tracking
    if (typeof window !== 'undefined') {
      // Track page view
      const trackPageView = () => {
        const eventData = {
          page: window.location.pathname,
          title: document.title,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }

        // Send to analytics API
        fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_view',
            eventData
          })
        }).catch(error => {
          console.error('Analytics tracking error:', error)
        })
      }

      // Track UTM parameters
      const trackUTMParameters = () => {
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

      // Track user engagement
      const trackEngagement = (eventType, eventData) => {
        fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType,
            eventData
          })
        }).catch(error => {
          console.error('Engagement tracking error:', error)
        })
      }

      // Initialize tracking
      trackPageView()
      trackUTMParameters()

      // Make tracking functions globally available
      window.analyticsTracker = {
        trackEvent: trackEngagement,
        trackPageView,
        getUTMParameter: (param) => {
          return sessionStorage.getItem(param) || 
                 new URLSearchParams(window.location.search).get(param)
        },
        calculateConversionTime: () => {
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

      // Track first visit
      if (!sessionStorage.getItem('first_visit')) {
        sessionStorage.setItem('first_visit', new Date().toISOString())
      }

      // Track scroll depth
      let maxScroll = 0
      const trackScroll = () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        )
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent
          trackEngagement('scroll_depth', { 
            depth: scrollPercent,
            maxDepth: maxScroll 
          })
        }
      }

      // Track time on page
      const startTime = Date.now()
      const trackTimeOnPage = () => {
        const timeOnPage = Math.floor((Date.now() - startTime) / 1000)
        trackEngagement('time_on_page', { 
          duration: timeOnPage,
          page: window.location.pathname 
        })
      }

      // Add event listeners
      window.addEventListener('scroll', trackScroll, { passive: true })
      
      // Track page unload
      const handlePageUnload = () => {
        trackTimeOnPage()
        trackEngagement('page_leave', {
          timeOnPage: Math.floor((Date.now() - startTime) / 1000),
          maxScroll
        })
      }

      window.addEventListener('beforeunload', handlePageUnload)
      window.addEventListener('pagehide', handlePageUnload)

      // Track clicks on external links
      const trackExternalLinks = () => {
        const links = document.querySelectorAll('a[href^="http"]')
        links.forEach(link => {
          link.addEventListener('click', (e) => {
            trackEngagement('external_link_click', {
              url: link.href,
              text: link.textContent,
              page: window.location.pathname
            })
          })
        })
      }

      // Delay external link tracking to ensure DOM is ready
      setTimeout(trackExternalLinks, 1000)
    }
  }, [])

  return <div ref={trackerRef}>{children}</div>
};;

// Hook for manual tracking
export function useAnalytics() {
  const trackEvent = (eventType, eventData = {}) => {
    if (typeof window !== 'undefined' && window.analyticsTracker) {
      window.analyticsTracker.trackEvent(eventType, eventData)
    }
  }

  const trackUserRegistration = (userId, acquisitionData = {}) => {
    if (typeof window !== 'undefined' && window.analyticsTracker) {
      const conversionTime = window.analyticsTracker.calculateConversionTime()
      
      trackEvent('user_registration', {
        userId,
        conversionTime,
        ...acquisitionData
      })

      // Send to dedicated registration API
      fetch('/api/analytics/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          registrationDate: new Date().toISOString().split('T')[0],
          referrer: window.analyticsTracker.getUTMParameter('referrer') || document.referrer,
          utmSource: window.analyticsTracker.getUTMParameter('utm_source'),
          utmMedium: window.analyticsTracker.getUTMParameter('utm_medium'),
          utmCampaign: window.analyticsTracker.getUTMParameter('utm_campaign'),
          acquisitionChannel: acquisitionData.channel || 'organic'
        })
      }).catch(error => {
        console.error('Registration tracking error:', error)
      })
    }
  }

  const trackAppointmentBooking = (appointmentData, conversionTime = null) => {
    if (typeof window !== 'undefined' && window.analyticsTracker) {
      trackEvent('appointment_booking', {
        appointmentId: appointmentData.id,
        serviceType: appointmentData.serviceType,
        status: appointmentData.status,
        conversionTime
      })

      // Send to dedicated appointment API
      fetch('/api/analytics/appointments', {
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
          referrer: window.analyticsTracker.getUTMParameter('referrer') || document.referrer,
          utmSource: window.analyticsTracker.getUTMParameter('utm_source'),
          utmMedium: window.analyticsTracker.getUTMParameter('utm_medium'),
          utmCampaign: window.analyticsTracker.getUTMParameter('utm_campaign'),
          deviceType: getDeviceType(),
          browser: getBrowser()
        })
      }).catch(error => {
        console.error('Appointment tracking error:', error)
      })
    }
  }

  const trackNewsletterSignup = (subscriberId, signupData = {}) => {
    if (typeof window !== 'undefined' && window.analyticsTracker) {
      const conversionTime = window.analyticsTracker.calculateConversionTime()
      
      trackEvent('newsletter_signup', {
        subscriberId,
        conversionTime,
        ...signupData
      })

      // Send to dedicated newsletter API
      fetch('/api/analytics/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId,
          signupDate: new Date().toISOString().split('T')[0],
          signupSource: signupData.source || 'unknown',
          referrer: window.analyticsTracker.getUTMParameter('referrer') || document.referrer,
          utmSource: window.analyticsTracker.getUTMParameter('utm_source'),
          utmMedium: window.analyticsTracker.getUTMParameter('utm_medium'),
          utmCampaign: window.analyticsTracker.getUTMParameter('utm_campaign'),
          conversionTime,
          deviceType: getDeviceType(),
          browser: getBrowser()
        })
      }).catch(error => {
        console.error('Newsletter tracking error:', error)
      })
    }
  }

  const trackFunnelStep = (funnelName, stepName, stepNumber) => {
    if (typeof window !== 'undefined' && window.analyticsTracker) {
      trackEvent('funnel_step', {
        funnelName,
        stepName,
        stepNumber,
        page: window.location.pathname
      })

      // Send to funnel API
      fetch('/api/analytics/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnelName,
          stepName,
          stepNumber,
          date: new Date().toISOString().split('T')[0]
        })
      }).catch(error => {
        console.error('Funnel tracking error:', error)
      })
    }
  }

  const getDeviceType = () => {
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

  const getBrowser = () => {
    if (typeof window === 'undefined') return 'unknown'
    
    const userAgent = navigator.userAgent
    
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'
    
    return 'unknown'
  }

  return {
    trackEvent,
    trackUserRegistration,
    trackAppointmentBooking,
    trackNewsletterSignup,
    trackFunnelStep,
    getUTMParameter: () => window.analyticsTracker?.getUTMParameter() || null,
    calculateConversionTime: () => window.analyticsTracker?.calculateConversionTime() || null
  }
};
