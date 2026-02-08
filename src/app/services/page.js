export default function Services() {
  const services = [
    {
      title: "Natural Health Consultation",
      description: "Personalized health assessment and natural remedy recommendations based on your specific needs and health goals.",
      price: "$75",
      duration: "60 minutes",
      features: ["Health assessment", "Custom remedy plan", "Follow-up support", "Nutritional guidance"]
    },
    {
      title: "Spiritual Counseling",
      description: "Christ-centered spiritual guidance and prayer support for emotional and spiritual wellness.",
      price: "$50",
      duration: "45 minutes",
      features: ["Prayer session", "Biblical guidance", "Emotional support", "Follow-up care"]
    },
    {
      title: "Nutritional Planning",
      description: "Comprehensive nutritional assessment and meal planning using natural, whole foods approach.",
      price: "$85",
      duration: "75 minutes",
      features: ["Diet analysis", "Custom meal plans", "Recipe guidance", "Supplement recommendations"]
    },
    {
      title: "Herbal Medicine Workshop",
      description: "Learn to prepare and use herbal remedies for common health conditions in this hands-on workshop.",
      price: "$120",
      duration: "3 hours",
      features: ["Hands-on training", "Herb identification", "Remedy preparation", "Take-home samples"]
    },
    {
      title: "Detoxification Program",
      description: "Comprehensive detox program using natural methods to cleanse and rejuvenate your body.",
      price: "$200",
      duration: "4 weeks",
      features: ["Detox plan", "Natural supplements", "Progress monitoring", "Lifestyle coaching"]
    },
    {
      title: "Family Health Package",
      description: "Complete health and wellness package for the entire family with ongoing support.",
      price: "$350",
      duration: "Monthly",
      features: ["Family consultations", "Group sessions", "Emergency support", "Priority scheduling"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Our Services</h1>
          <p className="text-center text-emerald-100 mt-4 max-w-2xl mx-auto">
            Comprehensive natural health and wellness services to support your journey to optimal health
          </p>
        </div>
      </section>

      {/* Services Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Can Help You</h2>
            <p className="text-lg text-gray-600 mb-8">
              At Glad Tidings, we offer a range of services designed to address your physical, emotional, and spiritual needs. 
              Our experienced practitioners combine traditional wisdom with modern understanding to provide holistic care.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <span className="text-2xl font-bold text-emerald-600">{service.price}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {service.duration}
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How to Book Our Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Choose Service</h3>
                <p className="text-sm text-gray-600">Select the service that best meets your needs</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">Call or email to schedule your appointment</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Consultation</h3>
                <p className="text-sm text-gray-600">Attend your personalized consultation session</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Follow-up</h3>
                <p className="text-sm text-gray-600">Receive ongoing support and guidance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today to schedule your consultation and take the first step toward natural health and wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-amber-500 text-emerald-900 px-8 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors">
              Book Consultation
            </a>
            <a href="tel:+14032537717" className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
};;
