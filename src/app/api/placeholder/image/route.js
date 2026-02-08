import { NextResponse } from 'next/server'
;
;export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const width = searchParams.width || '400'
  const height = searchParams.height || '300'
  const category = searchParams.category || 'product'
  
  // Generate different colored placeholders based on category
  const colors = {
    product: '#10b981', // emerald
    remedy: '#059669', // emerald dark
    service: '#3b82f6', // blue
    team: '#8b5cf6', // violet
    mission: '#dc2626', // red
  }
  
  const bgColor = colors[category] || '#6b7280'
  const icons = {
    product: '🌿',
    remedy: '💊', 
    service: '🏥',
    team: '👥',
    mission: '🙏'
  }
  
  const icon = icons[category] || '📦'
  
  // Generate SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 4}" fill="#ffffff" text-anchor="middle" dy=".3em">
        ${icon}
      </text>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
};
