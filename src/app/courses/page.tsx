import Link from 'next/link'
import { Play, Clock, Users, Star, BookOpen, Award, Calendar, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const courseCategories = [
  {
    id: 'herbal-medicine',
    name: 'Herbal Medicine',
    description: 'Learn about natural remedies and herbal treatments',
    icon: '🌿',
    courseCount: 8,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'natural-healing',
    name: 'Natural Healing',
    description: 'Discover holistic healing techniques and therapies',
    icon: '🌸',
    courseCount: 6,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'wellness-coaching',
    name: 'Wellness Coaching',
    description: 'Become a certified wellness coach',
    icon: '💚',
    courseCount: 4,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'nutrition-courses',
    name: 'Nutrition Courses',
    description: 'Master the science of nutrition and diet',
    icon: '🥗',
    courseCount: 7,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'meditation-mindfulness',
    name: 'Meditation & Mindfulness',
    description: 'Practice mental wellness and inner peace',
    icon: '🧘',
    courseCount: 5,
    color: 'from-indigo-500 to-purple-600'
  }
]

const featuredCourses = [
  {
    id: 1,
    title: 'Complete Herbal Medicine Course',
    instructor: 'Dr. Sarah Johnson',
    category: 'Herbal Medicine',
    level: 'Beginner to Advanced',
    duration: '12 weeks',
    students: 1234,
    rating: 4.9,
    reviews: 287,
    price: 199.99,
    originalPrice: 299.99,
    image: '/images/courses/herbal-medicine.jpg',
    badge: 'Best Seller',
    lessons: 48,
    certificate: true,
    description: 'Master the art of herbal medicine with comprehensive training'
  },
  {
    id: 2,
    title: 'Natural Healing Fundamentals',
    instructor: 'Dr. Michael Chen',
    category: 'Natural Healing',
    level: 'Beginner',
    duration: '8 weeks',
    students: 892,
    rating: 4.7,
    reviews: 156,
    price: 149.99,
    originalPrice: null,
    image: '/images/courses/natural-healing.jpg',
    badge: 'Popular',
    lessons: 32,
    certificate: true,
    description: 'Learn foundational principles of natural healing therapies'
  },
  {
    id: 3,
    title: 'Wellness Coaching Certification',
    instructor: 'Lisa Anderson',
    category: 'Wellness Coaching',
    level: 'Intermediate',
    duration: '10 weeks',
    students: 567,
    rating: 4.8,
    reviews: 98,
    price: 249.99,
    originalPrice: 349.99,
    image: '/images/courses/wellness-coaching.jpg',
    badge: 'Professional',
    lessons: 40,
    certificate: true,
    description: 'Become a certified wellness coach with expert guidance'
  },
  {
    id: 4,
    title: 'Nutrition Science Masterclass',
    instructor: 'Dr. Robert Williams',
    category: 'Nutrition Courses',
    level: 'Advanced',
    duration: '14 weeks',
    students: 445,
    rating: 4.9,
    reviews: 76,
    price: 299.99,
    originalPrice: null,
    image: '/images/courses/nutrition.jpg',
    badge: 'Advanced',
    lessons: 56,
    certificate: true,
    description: 'Deep dive into nutritional science and dietary planning'
  },
  {
    id: 5,
    title: 'Meditation & Mindfulness Mastery',
    instructor: 'Emma Thompson',
    category: 'Meditation & Mindfulness',
    level: 'All Levels',
    duration: '6 weeks',
    students: 1567,
    rating: 4.8,
    reviews: 234,
    price: 99.99,
    originalPrice: 149.99,
    image: '/images/courses/meditation.jpg',
    badge: 'New',
    lessons: 24,
    certificate: false,
    description: 'Transform your life through meditation and mindfulness practices'
  },
  {
    id: 6,
    title: 'Essential Oils & Aromatherapy',
    instructor: 'Jennifer Davis',
    category: 'Natural Healing',
    level: 'Beginner',
    duration: '4 weeks',
    students: 789,
    rating: 4.6,
    reviews: 123,
    price: 79.99,
    originalPrice: null,
    image: '/images/courses/essential-oils.jpg',
    badge: null,
    lessons: 16,
    certificate: false,
    description: 'Learn therapeutic uses of essential oils and aromatherapy'
  }
]

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Natural Health Courses</h1>
            <p className="text-xl mb-8 text-purple-100">
              Transform your life with expert-led natural health education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Browse All Courses
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Course Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {courseCategories.map((category) => (
            <Link
              key={category.id}
              href={`/courses/${category.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className={`aspect-square bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                <div className="text-white text-5xl">{category.icon}</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <p className="text-sm text-purple-600 font-medium">
                  {category.courseCount} courses
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Featured Courses</h2>
          <div className="flex gap-4">
            <Button variant="outline" size="sm">
              All Levels
            </Button>
            <Button variant="outline" size="sm">
              All Categories
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
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
                  <span className="text-xs text-purple-600 font-medium uppercase">{course.category}</span>
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

      {/* Learning Path Section */}
      <div className="bg-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Learning Path</h2>
            <p className="text-gray-600">Structured programs to guide your natural health journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">🌱</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Beginner Path</h3>
              <p className="text-gray-600 text-sm mb-4">Start your natural health journey with foundational courses</p>
              <Link href="/courses/beginner" className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                Get Started <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">🚀</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Advanced Path</h3>
              <p className="text-gray-600 text-sm mb-4">Deepen your knowledge with specialized advanced courses</p>
              <Link href="/courses/advanced" className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                Explore Advanced <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">🎓</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Professional Path</h3>
              <p className="text-gray-600 text-sm mb-4">Become a certified natural health practitioner</p>
              <Link href="/courses/professional" className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                Professional Track <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Start Your Natural Health Journey Today</h2>
          <p className="mb-6 text-purple-100">
            Join thousands of students learning natural health and wellness
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              Download Course Catalog
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
