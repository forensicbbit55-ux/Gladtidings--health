import { NextResponse } from 'next/server'
;
;export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const size = searchParams.size || '60'
  
  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/6}" fill="#9ca3af" text-anchor="middle" dy=".3em">
        📦
      </text>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  })
};
