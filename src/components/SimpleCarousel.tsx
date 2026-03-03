'use client'

export default function SimpleCarousel() {
  return (
    <div className="relative w-full h-[200px] bg-blue-500 overflow-hidden">
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Test Carousel</h1>
          <p>This is a simple test to see if the component renders</p>
        </div>
      </div>
    </div>
  )
}
