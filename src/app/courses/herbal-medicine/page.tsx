import Link from 'next/link'
import { Play, Clock, Users, Star, BookOpen, Award, Calendar, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const courses = [
  {
    id: 1,
    title: 'Complete Herbal Medicine Course',
    instructor: 'Dr. Sarah Johnson',
    description: 'Master the art of herbal medicine with comprehensive training from basic to advanced techniques',
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
    language: 'English',
    subtitles: true,
    whatYouLearn: [
      'Identify and prepare medicinal herbs',
      'Create herbal remedies and tinctures',
      'Understand herbal safety and contraindications',
      'Build a professional herbal practice'
    ],
    requirements: 'No prior experience needed'
  },
  {
    id: 2,
    title: 'Advanced Herbal Formulation',
    instructor: 'Dr. Michael Chen',
    description: 'Deep dive into creating complex herbal formulations for specific health conditions',
    level: 'Advanced',
    duration: '8 weeks',
    students: 567,
    rating: 4.8,
    reviews: 156,
    price: 249.99,
    originalPrice: null,
    image: '/images/courses/advanced-formulation.jpg',
    badge: 'Professional',
    lessons: 32,
    certificate: true,
    language: 'English',
    subtitles: true,
    whatYouLearn: [
      'Advanced formulation techniques',
      'Synergistic herb combinations',
      'Clinical applications',
      'Quality control and testing'
    ],
    requirements: 'Basic herbal knowledge required'
  },
  {
    id: 3,
    title: 'Herbal Medicine for Beginners',
    instructor: 'Lisa Anderson',
    description: 'Start your herbal journey with foundational knowledge and practical skills',
    level: 'Beginner',
    duration: '6 weeks',
    students: 2341,
    rating: 4.7,
    reviews: 445,
    price: 99.99,
    originalPrice: 149.99,
    image: '/images/courses/beginner-herbal.jpg',
    badge: 'Popular',
    lessons: 24,
    certificate: false,
    language: 'English',
    subtitles: true,
    whatYouLearn: [
      'Basic herb identification',
      'Simple home remedies',
      'Herbal safety basics',
      'Creating a home herbal garden'
    ],
    requirements: 'No experience required'
  },
  {
    id: 4,
    title: 'Clinical Herbal Medicine',
    instructor: 'Dr. Robert Williams',
    description: 'Professional-level training for clinical herbal practice and patient care',
    level: 'Professional',
    duration: '16 weeks',
    students: 234,
    rating: 4.9,
    reviews: 67,
    price: 499.99,
    originalPrice: null,
    image: '/images/courses/clinical-herbal.jpg',
    badge: 'Advanced',
    lessons: 64,
    certificate: true,
    language: 'English',
    subtitles: true,
    whatYouLearn: [
      'Patient assessment techniques',
      'Clinical diagnosis methods',
      'Treatment planning',
      'Professional ethics and practice'
    ],
    requirements: 'Healthcare background or herbal certification'
  },
  {
    id: 5,
    title: 'Traditional Chinese Herbal Medicine',
    instructor: 'Master Wei Zhang',
    description: 'Learn ancient Chinese herbal traditions and modern applications',
    level: 'Intermediate',
    duration: '10 weeks',
    students: 789,
    rating: 4.8,
    reviews: 123,
    price: 179.99,
    originalPrice: null,
    image: '/images/courses/chinese-herbal.jpg',
    badge: 'Specialty',
    lessons: 40,
    certificate: true,
    language: 'English',
    subtitles: true,
    whatYouLearn: [
      'Traditional Chinese theory',
      'Herbal properties and energetics',
      'Classic formulas',
      'Modern clinical applications'
    ],
    requirements: 'Basic herbal knowledge'
  },
  {
    id: 6,
    title: 'Herbal Medicine Business',
    instructor: 'Jennifer Davis',
    description: 'Build a successful herbal medicine practice or product line',
    level: 'All Levels',
    duration: '4 weeks',
    students: 456,
    rating: 4.6,
    reviews: 89,
    price: 149.99,
    originalPrice: null,
    image: '/images/courses/herbal-business.jpg',
    badge: 'Business',
    lessons: 16,
    certificate: false,
    language: 'English',
    subtitles: true,
    whatYouLearn: [
      'Business planning and strategy',
      'Product development',
      'Marketing and sales',
      'Legal and regulatory compliance'
    ],
    requirements: 'Interest in herbal business'
  }
]

export default function HerbalMedicineCoursePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-6">
            <Link href="/courses" className="text-green-100 hover:text-white flex items-center gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Herbal Medicine Courses</h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Master the ancient art of herbal medicine with expert-led courses. From beginner basics to professional clinical practice.
            </p>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{courses.length}</div>
              <div className="text-sm text-gray-600">Courses Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {courses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Happy Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {courses.filter(course => course.certificate).length}
              </div>
              <div className="text-sm text-gray-600">Certificate Programs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">All Levels</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">With Certificate</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Self-Paced</span>
            <button className="text-gray-500 hover:text-gray-700 text-sm">Clear filters</button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{courses.length} courses</span>
            <select className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Sort by: Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Play className="h-12 w-12 text-green-600" />
                </div>
                {course.badge && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {course.badge}
                  </div>
                )}
                {course.certificate && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs text-green-600 font-medium uppercase">{course.level}</span>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                <p className="text-sm text-gray-700 mb-4">Instructor: {course.instructor}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({course.reviews} reviews)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
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
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{course.certificate ? 'Certificate' : 'No Certificate'}</span>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">What you'll learn:</h4>
                  <div className="space-y-1">
                    {course.whatYouLearn.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{item}</span>
                      </div>
                    ))}
                    {course.whatYouLearn.length > 2 && (
                      <span className="text-xs text-green-600">+{course.whatYouLearn.length - 2} more</span>
                    )}
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
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
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

      {/* Learning Path */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Herbal Medicine Journey</h2>
            <p className="text-gray-600">Choose the right path based on your experience and goals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">🌱</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Beginner Path</h3>
              <p className="text-gray-600 text-sm mb-4">Start with foundational knowledge and basic skills</p>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-700">• No experience required</div>
                <div className="text-sm text-gray-700">• 6-12 weeks duration</div>
                <div className="text-sm text-gray-700">• Focus on home remedies</div>
              </div>
              <Link href="/courses/herbal-medicine/beginner" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                Start Learning →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">🚀</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Advanced Path</h3>
              <p className="text-gray-600 text-sm mb-4">Deepen your knowledge with advanced techniques</p>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-700">• Basic knowledge required</div>
                <div className="text-sm text-gray-700">• 8-16 weeks duration</div>
                <div className="text-sm text-gray-700">• Professional formulations</div>
              </div>
              <Link href="/courses/herbal-medicine/advanced" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                Advanced Courses →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">🎓</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Professional Path</h3>
              <p className="text-gray-600 text-sm mb-4">Become a certified herbal practitioner</p>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-700">• Advanced level required</div>
                <div className="text-sm text-gray-700">• 12-20 weeks duration</div>
                <div className="text-sm text-gray-700">• Clinical practice</div>
              </div>
              <Link href="/courses/herbal-medicine/professional" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                Professional Track →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Start Your Herbal Medicine Journey Today</h2>
          <p className="mb-6 text-green-100">
            Join thousands of students learning the healing power of herbs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              Download Course Catalog
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
