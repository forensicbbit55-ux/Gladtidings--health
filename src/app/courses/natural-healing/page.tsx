import Link from 'next/link'
import { Play, Clock, Users, Star, BookOpen, Award, ChevronLeft, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const naturalHealingCourses = [
  {
    id: 1,
    title: 'Natural Healing Fundamentals',
    instructor: 'Dr. Michael Chen',
    level: 'Beginner',
    duration: '8 weeks',
    students: 892,
    rating: 4.7,
    reviews: 156,
    price: 149.99,
    originalPrice: null,
    image: '/images/courses/natural-healing-fundamentals.jpg',
    badge: 'Popular',
    lessons: 32,
    certificate: true,
    description: 'Learn foundational principles of natural healing therapies including energy work, bodywork, and holistic approaches'
  },
  {
    id: 2,
    title: 'Advanced Energy Healing',
    instructor: 'Sarah Mitchell',
    level: 'Advanced',
    duration: '10 weeks',
    students: 456,
    rating: 4.8,
    reviews: 89,
    price: 299.99,
    originalPrice: 399.99,
    image: '/images/courses/energy-healing.jpg',
    badge: 'Advanced',
    lessons: 40,
    certificate: true,
    description: 'Master advanced energy healing techniques including Reiki, crystal healing, and vibrational medicine'
  },
  {
    id: 3,
    title: 'Holistic Bodywork Therapy',
    instructor: 'James Thompson',
    level: 'Intermediate',
    duration: '12 weeks',
    students: 623,
    rating: 4.6,
    reviews: 112,
    price: 249.99,
    originalPrice: null,
    image: '/images/courses/bodywork-therapy.jpg',
    badge: null,
    lessons: 48,
    certificate: true,
    description: 'Learn various bodywork techniques including massage, reflexology, and therapeutic touch'
  },
  {
    id: 4,
    title: 'Essential Oils & Aromatherapy',
    instructor: 'Jennifer Davis',
    level: 'Beginner',
    duration: '4 weeks',
    students: 789,
    rating: 4.6,
    reviews: 123,
    price: 79.99,
    originalPrice: null,
    image: '/images/courses/essential-oils.jpg',
    badge: 'Best Value',
    lessons: 16,
    certificate: false,
    description: 'Learn therapeutic uses of essential oils and aromatherapy for physical and emotional healing'
  },
  {
    id: 5,
    title: 'Traditional Chinese Medicine',
    instructor: 'Dr. Wei Zhang',
    level: 'Intermediate',
    duration: '14 weeks',
    students: 334,
    rating: 4.9,
    reviews: 67,
    price: 349.99,
    originalPrice: 449.99,
    image: '/images/courses/tcm.jpg',
    badge: 'Expert',
    lessons: 56,
    certificate: true,
    description: 'Explore ancient Chinese healing practices including acupuncture, herbs, and Qi Gong'
  },
  {
    id: 6,
    title: 'Mind-Body Medicine Integration',
    instructor: 'Dr. Emma Williams',
    level: 'Intermediate',
    duration: '8 weeks',
    students: 567,
    rating: 4.7,
    reviews: 98,
    price: 199.99,
    originalPrice: null,
    image: '/images/courses/mind-body.jpg',
    badge: null,
    lessons: 32,
    certificate: true,
    description: 'Understand the connection between mental and physical health and learn integrated healing approaches'
  }
]

export default function NaturalHealingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-4">
            <Link href="/courses" className="flex items-center text-purple-100 hover:text-white transition-colors">
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Courses
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Natural Healing</h1>
            <p className="text-xl mb-8 text-purple-100">
              Discover holistic healing techniques and therapies for mind, body, and spirit
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Filter by</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Level</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Beginner</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Intermediate</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Advanced</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Duration</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Under 8 weeks</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">8-12 weeks</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Over 12 weeks</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">Under $150</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">$150 - $300</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">Over $300</span>
                  </label>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing {naturalHealingCourses.length} courses</p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Sort by: Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Duration: Short to Long</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {naturalHealingCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Play className="h-12 w-12 text-purple-600" />
                    </div>
                    {course.badge && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        {course.badge}
                      </div>
                    )}
                    {course.certificate && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-xs text-purple-600 font-medium uppercase">Natural Healing</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({course.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold text-gray-800">${course.price}</span>
                        {course.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${course.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{course.level}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                        Enroll Now
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
