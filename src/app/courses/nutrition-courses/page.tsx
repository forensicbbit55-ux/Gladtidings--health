import Link from 'next/link'
import { Play, Clock, Users, Star, BookOpen, Award, ChevronLeft, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nutritionCourses = [
  {
    id: 1,
    title: 'Nutrition Science Masterclass',
    instructor: 'Dr. Robert Williams',
    level: 'Advanced',
    duration: '14 weeks',
    students: 445,
    rating: 4.9,
    reviews: 76,
    price: 299.99,
    originalPrice: null,
    image: '/images/courses/nutrition-science.jpg',
    badge: 'Advanced',
    lessons: 56,
    certificate: true,
    description: 'Deep dive into nutritional science and dietary planning for optimal health'
  },
  {
    id: 2,
    title: 'Plant-Based Nutrition',
    instructor: 'Maria Rodriguez',
    level: 'Beginner',
    duration: '6 weeks',
    students: 789,
    rating: 4.7,
    reviews: 145,
    price: 149.99,
    originalPrice: 199.99,
    image: '/images/courses/plant-based-nutrition.jpg',
    badge: 'Popular',
    lessons: 24,
    certificate: false,
    description: 'Learn the fundamentals of plant-based nutrition and meal planning'
  },
  {
    id: 3,
    title: 'Sports Nutrition Certification',
    instructor: 'Dr. James Mitchell',
    level: 'Intermediate',
    duration: '10 weeks',
    students: 356,
    rating: 4.8,
    reviews: 89,
    price: 279.99,
    originalPrice: 379.99,
    image: '/images/courses/sports-nutrition.jpg',
    badge: 'Professional',
    lessons: 40,
    certificate: true,
    description: 'Specialize in sports nutrition and athletic performance optimization'
  },
  {
    id: 4,
    title: 'Pediatric Nutrition',
    instructor: 'Dr. Emma Thompson',
    level: 'Intermediate',
    duration: '8 weeks',
    students: 267,
    rating: 4.6,
    reviews: 56,
    price: 229.99,
    originalPrice: null,
    image: '/images/courses/pediatric-nutrition.jpg',
    badge: null,
    lessons: 32,
    certificate: true,
    description: 'Nutrition for children and adolescents - growth, development, and health'
  },
  {
    id: 5,
    title: 'Clinical Nutrition',
    instructor: 'Dr. Sarah Chen',
    level: 'Advanced',
    duration: '16 weeks',
    students: 189,
    rating: 4.9,
    reviews: 34,
    price: 449.99,
    originalPrice: 549.99,
    image: '/images/courses/clinical-nutrition.jpg',
    badge: 'Expert',
    lessons: 64,
    certificate: true,
    description: 'Advanced clinical nutrition for disease prevention and management'
  },
  {
    id: 6,
    title: 'Weight Management Coaching',
    instructor: 'Lisa Anderson',
    level: 'Beginner',
    duration: '4 weeks',
    students: 923,
    rating: 4.5,
    reviews: 178,
    price: 99.99,
    originalPrice: null,
    image: '/images/courses/weight-management.jpg',
    badge: 'Best Value',
    lessons: 16,
    certificate: false,
    description: 'Effective strategies for sustainable weight management and healthy lifestyle'
  },
  {
    id: 7,
    title: 'Nutritional Psychology',
    instructor: 'Dr. Michael Brown',
    level: 'Intermediate',
    duration: '8 weeks',
    students: 412,
    rating: 4.7,
    reviews: 92,
    price: 189.99,
    originalPrice: null,
    image: '/images/courses/nutritional-psychology.jpg',
    badge: null,
    lessons: 32,
    certificate: true,
    description: 'Understanding the connection between nutrition, mental health, and behavior'
  }
]

export default function NutritionCoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-4">
            <Link href="/courses" className="flex items-center text-orange-100 hover:text-white transition-colors">
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Courses
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Nutrition Courses</h1>
            <p className="text-xl mb-8 text-orange-100">
              Master the science of nutrition and diet for optimal health and wellness
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
                <h4 className="font-medium text-gray-700 mb-3">Focus Area</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">General Nutrition</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Sports Nutrition</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Clinical Nutrition</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Weight Management</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Diet Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Plant-Based</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Keto</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Mediterranean</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Balanced Diet</span>
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

              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing {nutritionCourses.length} courses</p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>Sort by: Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Duration: Short to Long</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nutritionCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                      <Play className="h-12 w-12 text-orange-600" />
                    </div>
                    {course.badge && (
                      <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                        {course.badge}
                      </div>
                    )}
                    {course.certificate && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                        <Award className="h-4 w-4 text-orange-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-xs text-orange-600 font-medium uppercase">Nutrition</span>
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
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
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
