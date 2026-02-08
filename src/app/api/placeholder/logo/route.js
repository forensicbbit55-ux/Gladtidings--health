import { NextResponse } from 'next/server'
;
;export async function GET() {
  // Generate a simple SVG logo placeholder
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#10b981"/>
      <circle cx="100" cy="80" r="40" fill="#ffffff" opacity="0.9"/>
      <text x="100" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">
        GLAD
      </text>
      <text x="100" y="165" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">
        TIDINGS
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
