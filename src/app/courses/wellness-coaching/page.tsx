import Link from 'next/link'
import { Play, Clock, Users, Star, BookOpen, Award, ChevronLeft, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const wellnessCoachingCourses = [
  {
    id: 1,
    title: 'Wellness Coaching Certification',
    instructor: 'Lisa Anderson',
    level: 'Intermediate',
    duration: '10 weeks',
    students: 567,
    rating: 4.8,
    reviews: 98,
    price: 249.99,
    originalPrice: 349.99,
    image: '/images/courses/wellness-coaching-certification.jpg',
    badge: 'Professional',
    lessons: 40,
    certificate: true,
    description: 'Become a certified wellness coach with expert guidance and practical skills'
  },
  {
    id: 2,
    title: 'Advanced Wellness Coaching',
    instructor: 'Dr. Robert Martinez',
    level: 'Advanced',
    duration: '12 weeks',
    students: 234,
    rating: 4.9,
    reviews: 45,
    price: 399.99,
    originalPrice: 499.99,
    image: '/images/courses/advanced-wellness-coaching.jpg',
    badge: 'Expert',
    lessons: 48,
    certificate: true,
    description: 'Master advanced coaching techniques and specialize in niche wellness areas'
  },
  {
    id: 3,
    title: 'Corporate Wellness Coaching',
    instructor: 'Jennifer Thompson',
    level: 'Intermediate',
    duration: '8 weeks',
    students: 445,
    rating: 4.7,
    reviews: 78,
    price: 299.99,
    originalPrice: null,
    image: '/images/courses/corporate-wellness.jpg',
    badge: 'Business',
    lessons: 32,
    certificate: true,
    description: 'Learn to implement wellness programs in corporate environments'
  },
  {
    id: 4,
    title: 'Nutrition Coaching Fundamentals',
    instructor: 'Dr. Sarah Johnson',
    level: 'Beginner',
    duration: '6 weeks',
    students: 678,
    rating: 4.6,
    reviews: 134,
    price: 179.99,
    originalPrice: null,
    image: '/images/courses/nutrition-coaching.jpg',
    badge: 'Popular',
    lessons: 24,
    certificate: false,
    description: 'Essential nutrition coaching skills for helping clients achieve health goals'
  }
]

export default function WellnessCoachingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-4">
            <Link href="/courses" className="flex items-center text-blue-100 hover:text-white transition-colors">
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Courses
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Wellness Coaching</h1>
            <p className="text-xl mb-8 text-blue-100">
              Become a certified wellness coach and help others achieve optimal health
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
                <h4 className="font-medium text-gray-700 mb-3">Specialization</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">General Wellness</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Nutrition</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Corporate</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Mental Health</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Certification</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Certificate Included</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Professional Development</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">Under $200</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">$200 - $350</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">Over $350</span>
                  </label>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing {wellnessCoachingCourses.length} courses</p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sort by: Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Duration: Short to Long</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wellnessCoachingCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Play className="h-12 w-12 text-blue-600" />
                    </div>
                    {course.badge && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {course.badge}
                      </div>
                    )}
                    {course.certificate && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                        <Award className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-xs text-blue-600 font-medium uppercase">Wellness Coaching</span>
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
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
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
