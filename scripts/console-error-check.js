#!/usr/bin/env node

/**
 * Console Error Check Script
 * Monitors and reports console errors in production
 */

const https = require('https')
const http = require('http')
const { JSDOM } = require('jsdom')

// Configuration
const config = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  timeout: 30000,
  pages: [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/dashboard',
    '/appointments',
    '/admin',
    '/admin/analytics',
    '/contact'
  ]
}

// Test results
const results = {
  javascript: { passed: 0, failed: 0, details: [] },
  console: { passed: 0, failed: 0, details: [] },
  network: { passed: 0, failed: 0, details: [] },
  performance: { passed: 0, failed: 0, details: [] }
}

// Utility functions
function log(category, message, status = 'info') {
  const timestamp = new Date().toISOString()
  const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : 'ℹ️'
  console.log(`${timestamp} ${statusIcon} [${category.toUpperCase()}] ${message}`)
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https')
    const client = isHttps ? https : http
    
    const requestOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'Console-Error-Checker/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      },
      timeout: config.timeout,
      ...options
    }

    const req = client.request(url, requestOptions, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        })
      })
    })

    req.on('error', reject)
    req.on('timeout', () => reject(new Error('Request timeout')))
    req.end()
  })
}

// Check for JavaScript errors
async function checkJavaScriptErrors(page) {
  log('javascript', `Checking JavaScript errors on ${page}...`)
  
  try {
    const response = await makeRequest(`${config.baseUrl}${page}`)
    
    if (response.status !== 200) {
      log('javascript', `Page ${page} returned ${response.status}`, 'fail')
      results.javascript.failed++
      return
    }

    // Parse HTML and check for JavaScript errors
    const dom = new JSDOM(response.data, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: `${config.baseUrl}${page}`
    })

    const window = dom.window
    const document = dom.window.document

    // Capture console errors
    const consoleErrors = []
    const originalConsoleError = window.console.error
    window.console.error = function(...args) {
      consoleErrors.push(args.join(' '))
      originalConsoleError.apply(window.console, args)
    }

    // Check for common JavaScript errors
    const errorPatterns = [
      /ReferenceError/i,
      /TypeError/i,
      /SyntaxError/i,
      /NetworkError/i,
      /DOMException/i,
      /console\.error/i,
      /throw new Error/i,
      /Cannot read property/i,
      /Cannot access property/i,
      /undefined is not/i,
      /null is not/i
    ]

    const htmlContent = response.data
    const foundErrors = []

    errorPatterns.forEach(pattern => {
      const matches = htmlContent.match(pattern)
      if (matches) {
        foundErrors.push(...matches)
      }
    })

    // Check for inline script errors
    const scripts = document.querySelectorAll('script')
    scripts.forEach(script => {
      if (script.textContent) {
        const scriptContent = script.textContent
        errorPatterns.forEach(pattern => {
          const matches = scriptContent.match(pattern)
          if (matches) {
            foundErrors.push(...matches)
          }
        })
      }
    })

    if (foundErrors.length === 0 && consoleErrors.length === 0) {
      log('javascript', `No JavaScript errors found on ${page}`, 'pass')
      results.javascript.passed++
    } else {
      const allErrors = [...foundErrors, ...consoleErrors]
      log('javascript', `${allErrors.length} JavaScript errors found on ${page}`, 'fail')
      results.javascript.failed++
      
      allErrors.forEach(error => {
        log('javascript', `  - ${error}`, 'fail')
      })
    }

  } catch (error) {
    log('javascript', `Error checking ${page}: ${error.message}`, 'fail')
    results.javascript.failed++
  }
}

// Check for console errors
async function checkConsoleErrors(page) {
  log('console', `Checking console errors on ${page}...`)
  
  try {
    const response = await makeRequest(`${config.baseUrl}${page}`)
    
    if (response.status !== 200) {
      log('console', `Page ${page} returned ${response.status}`, 'fail')
      results.console.failed++
      return
    }

    // Parse HTML and check for console statements
    const dom = new JSDOM(response.data)
    const document = dom.window.document

    // Check for console.error, console.warn, console.log statements
    const scripts = document.querySelectorAll('script')
    const consoleStatements = []

    scripts.forEach(script => {
      if (script.textContent) {
        const scriptContent = script.textContent
        
        // Look for console statements
        const consolePatterns = [
          /console\.error\s*\(/gi,
          /console\.warn\s*\(/gi,
          /console\.log\s*\(/gi,
          /console\.debug\s*\(/gi
        ]

        consolePatterns.forEach(pattern => {
          const matches = scriptContent.match(pattern)
          if (matches) {
            consoleStatements.push(...matches)
          }
        })
      }
    })

    // Check for error handling
    const errorHandlingPatterns = [
      /try\s*\{/gi,
      /catch\s*\(/gi,
      /throw\s+new\s+Error/gi,
      /\.catch\s*\(/gi
    ]

    const htmlContent = response.data
    const errorHandlingFound = []

    errorHandlingPatterns.forEach(pattern => {
      const matches = htmlContent.match(pattern)
      if (matches) {
        errorHandlingFound.push(...matches)
      }
    })

    if (consoleStatements.length === 0) {
      log('console', `No console statements found on ${page}`, 'pass')
      results.console.passed++
    } else {
      log('console', `${consoleStatements.length} console statements found on ${page}`, 'fail')
      results.console.failed++
      
      consoleStatements.forEach(statement => {
        log('console', `  - ${statement}`, 'fail')
      })
    }

    if (errorHandlingFound.length > 0) {
      log('console', `${errorHandlingFound.length} error handling patterns found on ${page}`, 'pass')
      results.console.passed++
    }

  } catch (error) {
    log('console', `Error checking ${page}: ${error.message}`, 'fail')
    results.console.failed++
  }
}

// Check for network errors
async function checkNetworkErrors(page) {
  log('network', `Checking network errors on ${page}...`)
  
  try {
    const startTime = Date.now()
    const response = await makeRequest(`${config.baseUrl}${page}`)
    const endTime = Date.now()
    const loadTime = endTime - startTime

    if (response.status === 200) {
      log('network', `Page ${page} loaded successfully (${loadTime}ms)`, 'pass')
      results.network.passed++
    } else if (response.status >= 400 && response.status < 500) {
      log('network', `Page ${page} returned client error ${response.status}`, 'fail')
      results.network.failed++
    } else if (response.status >= 500) {
      log('network', `Page ${page} returned server error ${response.status}`, 'fail')
      results.network.failed++
    } else {
      log('network', `Page ${page} returned unexpected status ${response.status}`, 'fail')
      results.network.failed++
    }

    // Check for broken resources
    const dom = new JSDOM(response.data)
    const document = dom.window.document

    const resources = [
      ...Array.from(document.querySelectorAll('img[src]')).map(img => img.getAttribute('src')),
      ...Array.from(document.querySelectorAll('link[href]')).map(link => link.getAttribute('href'))),
      ...Array.from(document.querySelectorAll('script[src]')).map(script => script.getAttribute('src'))
    ]

    const brokenResources = []

    for (const resource of resources) {
      if (resource && !resource.startsWith('http') && !resource.startsWith('//')) {
        try {
          const resourceUrl = resource.startsWith('/') 
            ? `${config.baseUrl}${resource}` 
            : `${config.baseUrl}/${resource}`
          
          const resourceResponse = await makeRequest(resourceUrl)
          if (resourceResponse.status >= 400) {
            brokenResources.push(resource)
          }
        } catch (error) {
          brokenResources.push(resource)
        }
      }
    }

    if (brokenResources.length === 0) {
      log('network', `No broken resources found on ${page}`, 'pass')
      results.network.passed++
    } else {
      log('network', `${brokenResources.length} broken resources found on ${page}`, 'fail')
      results.network.failed++
      
      brokenResources.forEach(resource => {
        log('network', `  - ${resource}`, 'fail')
      })
    }

  } catch (error) {
    log('network', `Error checking ${page}: ${error.message}`, 'fail')
    results.network.failed++
  }
}

// Check performance metrics
async function checkPerformance(page) {
  log('performance', `Checking performance metrics for ${page}...`)
  
  try {
    const startTime = Date.now()
    const response = await makeRequest(`${config.baseUrl}${page}`)
    const endTime = Date.now()
    const loadTime = endTime - startTime

    // Parse HTML to get page size
    const pageSize = Buffer.byteLength(response.data, 'utf8')
    const pageSizeKB = (pageSize / 1024).toFixed(2)

    log('performance', `Page ${page}: ${loadTime}ms load time, ${pageSizeKB}KB size`, 'pass')
    results.performance.passed++

    // Performance thresholds
    if (loadTime < 2000) {
      log('performance', `Page ${page} loads quickly (< 2s)`, 'pass')
      results.performance.passed++
    } else if (loadTime < 5000) {
      log('performance', `Page ${page} load time is acceptable (2-5s)`, 'pass')
      results.performance.passed++
    } else {
      log('performance', `Page ${page} load time is slow (> 5s)`, 'fail')
      results.performance.failed++
    }

    if (pageSizeKB < 500) {
      log('performance', `Page ${page} size is good (< 500KB)`, 'pass')
      results.performance.passed++
    } else if (pageSizeKB < 1000) {
      log('performance', `Page ${page} size is acceptable (500KB-1MB)`, 'pass')
      results.performance.passed++
    } else {
      log('performance', `Page ${page} size is large (> 1MB)`, 'fail')
      results.performance.failed++
    }

    // Check for performance optimizations
    const dom = new JSDOM(response.data)
    const document = dom.window.document

    const optimizations = {
      hasMinifiedJS: false,
      hasMinifiedCSS: false,
      hasImageOptimization: false,
      hasLazyLoading: false
    }

    // Check for minified scripts
    const scripts = document.querySelectorAll('script[src]')
    scripts.forEach(script => {
      const src = script.getAttribute('src')
      if (src && src.includes('.min.')) {
        optimizations.hasMinifiedJS = true
      }
    })

    // Check for minified CSS
    const links = document.querySelectorAll('link[rel="stylesheet"]')
    links.forEach(link => {
      const href = link.getAttribute('href')
      if (href && href.includes('.min.')) {
        optimizations.hasMinifiedCSS = true
      }
    })

    // Check for lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]')
    if (images.length > 0) {
      optimizations.hasLazyLoading = true
    }

    const optimizationCount = Object.values(optimizations).filter(Boolean).length
    log('performance', `Page ${page}: ${optimizationCount}/4 performance optimizations found`, 
        optimizationCount >= 2 ? 'pass' : 'fail')
    
    if (optimizationCount >= 2) {
      results.performance.passed++
    } else {
      results.performance.failed++
    }

  } catch (error) {
    log('performance', `Error checking ${page}: ${error.message}`, 'fail')
    results.performance.failed++
  }
}

// Main function
async function runConsoleErrorCheck() {
  console.log('🔍 Starting Console Error Check...')
  console.log(`📍 Target: ${config.baseUrl}`)
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  console.log('')

  try {
    // Check each page
    for (const page of config.pages) {
      log('general', `Checking page: ${page}`)
      
      await checkJavaScriptErrors(page)
      await checkConsoleErrors(page)
      await checkNetworkErrors(page)
      await checkPerformance(page)
      
      console.log('')
    }

    // Generate summary
    console.log('📊 CONSOLE ERROR CHECK SUMMARY')
    console.log('==============================')
    
    const categories = ['javascript', 'console', 'network', 'performance']
    let totalPassed = 0
    let totalFailed = 0

    categories.forEach(category => {
      const categoryResult = results[category]
      totalPassed += categoryResult.passed
      totalFailed += categoryResult.failed
      
      const status = categoryResult.failed === 0 ? '✅' : categoryResult.passed > categoryResult.failed ? '⚠️' : '❌'
      console.log(`${status} ${category.toUpperCase()}: ${categoryResult.passed} passed, ${categoryResult.failed} failed`)
    })

    console.log('')
    console.log(`📈 TOTAL: ${totalPassed} passed, ${totalFailed} failed`)
    
    const successRate = totalPassed / (totalPassed + totalFailed) * 100
    console.log(`🎯 Success Rate: ${successRate.toFixed(1)}%`)

    if (totalFailed === 0) {
      console.log('\n🎉 NO CONSOLE ERRORS FOUND!')
      console.log('🔍 All pages are clean and error-free.')
    } else if (successRate >= 90) {
      console.log('\n⚠️  MINOR CONSOLE ISSUES FOUND')
      console.log('🔍 Some pages have minor issues but are functional.')
    } else {
      console.log('\n❌ SIGNIFICANT CONSOLE ERRORS FOUND')
      console.log('🔍 Pages have errors that need attention.')
    }

    console.log('\n📋 Recommendations:')
    console.log('1. Fix any JavaScript errors found')
    console.log('2. Remove console.log statements from production')
    console.log('3. Optimize page load times')
    console.log('4. Fix broken resources')
    console.log('5. Add proper error handling')

  } catch (error) {
    console.error('\n💥 Console error check failed:', error)
  }
}

// Run check
if (require.main === module) {
  runConsoleErrorCheck()
}

module.exports = {
  checkJavaScriptErrors,
  checkConsoleErrors,
  checkNetworkErrors,
  checkPerformance,
  runConsoleErrorCheck
}
