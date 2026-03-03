import Link from 'next/link'
import { Play, Clock, Users, Star, BookOpen, Award, ChevronLeft, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const meditationCourses = [
  {
    id: 1,
    title: 'Meditation & Mindfulness Mastery',
    instructor: 'Emma Thompson',
    level: 'All Levels',
    duration: '6 weeks',
    students: 1567,
    rating: 4.8,
    reviews: 234,
    price: 99.99,
    originalPrice: 149.99,
    image: '/images/courses/meditation-mastery.jpg',
    badge: 'Best Seller',
    lessons: 24,
    certificate: false,
    description: 'Transform your life through meditation and mindfulness practices'
  },
  {
    id: 2,
    title: 'Advanced Meditation Techniques',
    instructor: 'Master David Chen',
    level: 'Advanced',
    duration: '8 weeks',
    students: 445,
    rating: 4.9,
    reviews: 89,
    price: 179.99,
    originalPrice: 249.99,
    image: '/images/courses/advanced-meditation.jpg',
    badge: 'Expert',
    lessons: 32,
    certificate: true,
    description: 'Deepen your practice with advanced meditation techniques and traditions'
  },
  {
    id: 3,
    title: 'Mindfulness-Based Stress Reduction',
    instructor: 'Dr. Sarah Mitchell',
    level: 'Beginner',
    duration: '8 weeks',
    students: 892,
    rating: 4.7,
    reviews: 156,
    price: 149.99,
    originalPrice: null,
    image: '/images/courses/mbsr.jpg',
    badge: 'Popular',
    lessons: 32,
    certificate: true,
    description: 'Evidence-based program for reducing stress and improving well-being'
  },
  {
    id: 4,
    title: 'Zen Meditation Fundamentals',
    instructor: 'Master Ryu Tanaka',
    level: 'Beginner',
    duration: '4 weeks',
    students: 623,
    rating: 4.6,
    reviews: 112,
    price: 79.99,
    originalPrice: null,
    image: '/images/courses/zen-meditation.jpg',
    badge: null,
    lessons: 16,
    certificate: false,
    description: 'Learn traditional Zen meditation practices for inner peace and clarity'
  },
  {
    id: 5,
    title: 'Meditation Teacher Training',
    instructor: 'Lisa Anderson',
    level: 'Advanced',
    duration: '12 weeks',
    students: 234,
    rating: 4.8,
    reviews: 45,
    price: 399.99,
    originalPrice: 499.99,
    image: '/images/courses/meditation-teacher.jpg',
    badge: 'Professional',
    lessons: 48,
    certificate: true,
    description: 'Become a certified meditation teacher with comprehensive training'
  },
  {
    id: 6,
    title: 'Mindfulness for Anxiety',
    instructor: 'Dr. Michael Brown',
    level: 'Beginner',
    duration: '4 weeks',
    students: 1123,
    rating: 4.7,
    reviews: 198,
    price: 69.99,
    originalPrice: null,
    image: '/images/courses/mindfulness-anxiety.jpg',
    badge: 'Best Value',
    lessons: 16,
    certificate: false,
    description: 'Specific mindfulness techniques for managing anxiety and panic'
  },
  {
    id: 7,
    title: 'Yoga and Meditation Integration',
    instructor: 'Jennifer Davis',
    level: 'Intermediate',
    duration: '6 weeks',
    students: 567,
    rating: 4.8,
    reviews: 78,
    price: 129.99,
    originalPrice: null,
    image: '/images/courses/yoga-meditation.jpg',
    badge: null,
    lessons: 24,
    certificate: false,
    description: 'Combine yoga practice with meditation for holistic mind-body wellness'
  },
  {
    id: 8,
    title: 'Loving-Kindness Meditation',
    instructor: 'Dr. Emma Williams',
    level: 'All Levels',
    duration: '3 weeks',
    students: 789,
    rating: 4.9,
    reviews: 145,
    price: 49.99,
    originalPrice: 79.99,
    image: '/images/courses/loving-kindness.jpg',
    badge: 'New',
    lessons: 12,
    certificate: false,
    description: 'Cultivate compassion and empathy through loving-kindness meditation'
  }
]

export default function MeditationMindfulnessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-4">
            <Link href="/courses" className="flex items-center text-indigo-100 hover:text-white transition-colors">
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Courses
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Meditation & Mindfulness</h1>
            <p className="text-xl mb-8 text-indigo-100">
              Practice mental wellness and inner peace through guided meditation and mindfulness
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
                <h4 className="font-medium text-gray-700 mb-3">Meditation Style</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Mindfulness</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Zen</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Vipassana</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Loving-Kindness</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Goal</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Stress Reduction</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Anxiety Management</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Spiritual Growth</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Better Sleep</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Duration</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="duration" className="mr-2" />
                    <span className="text-sm text-gray-600">Under 4 weeks</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="duration" className="mr-2" />
                    <span className="text-sm text-gray-600">4-8 weeks</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="duration" className="mr-2" />
                    <span className="text-sm text-gray-600">Over 8 weeks</span>
                  </label>
                </div>
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing {meditationCourses.length} courses</p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Sort by: Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Duration: Short to Long</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meditationCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <Play className="h-12 w-12 text-indigo-600" />
                    </div>
                    {course.badge && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                        {course.badge}
                      </div>
                    )}
                    {course.certificate && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                        <Award className="h-4 w-4 text-indigo-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-xs text-indigo-600 font-medium uppercase">Meditation & Mindfulness</span>
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
                      <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
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
