#!/usr/bin/env node

/**
 * Comprehensive System Audit Script
 * Checks for errors, console issues, and system integrity
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const config = {
  projectRoot: __dirname + '/..',
  srcDir: 'src',
  excludeDirs: ['node_modules', '.next', '.git'],
  fileExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  consoleErrorPatterns: [
    /console\.error/i,
    /console\.warn/i,
    /throw new Error/i,
    /TypeError:/i,
    /ReferenceError:/i,
    /SyntaxError:/i,
    /Cannot read property/i,
    /Cannot access property/i,
    /undefined is not/i,
    /null is not/i,
    /Failed to fetch/i,
    /Network error/i,
    /404 Not Found/i,
    /500 Internal Server Error/i
  ]
}

// Audit results
const results = {
  syntax: { passed: 0, failed: 0, errors: [] },
  console: { passed: 0, failed: 0, errors: [] },
  imports: { passed: 0, failed: 0, errors: [] },
  structure: { passed: 0, failed: 0, errors: [] },
  performance: { passed: 0, failed: 0, errors: [] }
}

// Utility functions
function log(category, message, status = 'info') {
  const timestamp = new Date().toISOString()
  const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : 'ℹ️'
  console.log(`${timestamp} ${statusIcon} [${category.toUpperCase()}] ${message}`)
}

function getAllFiles(dir, extensions, excludeDirs = []) {
  let files = []
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !excludeDirs.includes(item)) {
        traverse(fullPath)
      } else if (stat.isFile()) {
        const ext = path.extname(item)
        if (extensions.includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  }
  
  traverse(dir)
  return files
}

// Check syntax errors
function checkSyntaxErrors() {
  log('syntax', 'Checking for syntax errors...')
  
  try {
    const files = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    
    for (const file of files) {
      try {
        // Try to parse the file
        const content = fs.readFileSync(file, 'utf8')
        
        // Basic syntax checks
        const issues = []
        
        // Check for unmatched brackets
        const openBrackets = (content.match(/\(/g) || []).length
        const closeBrackets = (content.match(/\)/g) || []).length
        if (openBrackets !== closeBrackets) {
          issues.push('Unmatched parentheses')
        }
        
        const openBraces = (content.match(/\{/g) || []).length
        const closeBraces = (content.match(/\}/g) || []).length
        if (openBraces !== closeBraces) {
          issues.push('Unmatched braces')
        }
        
        const openBrackets2 = (content.match(/\[/g) || []).length
        const closeBrackets2 = (content.match(/\]/g) || []).length
        if (openBrackets2 !== closeBrackets2) {
          issues.push('Unmatched brackets')
        }
        
        // Check for common syntax issues
        if (content.includes('=>') && content.includes('=> =>')) {
          issues.push('Double arrow function')
        }
        
        if (content.includes(',,') || content.includes('{{') || content.includes('}}')) {
          issues.push('Double punctuation')
        }
        
        if (issues.length > 0) {
          log('syntax', `Syntax issues in ${path.relative(config.projectRoot, file)}: ${issues.join(', ')}`, 'fail')
          results.syntax.failed++
          results.syntax.errors.push({ file, issues })
        } else {
          results.syntax.passed++
        }
        
      } catch (error) {
        log('syntax', `Error reading ${path.relative(config.projectRoot, file)}: ${error.message}`, 'fail')
        results.syntax.failed++
        results.syntax.errors.push({ file, error: error.message })
      }
    }
    
    log('syntax', `Syntax check completed: ${results.syntax.passed} passed, ${results.syntax.failed} failed`)
    
  } catch (error) {
    log('syntax', `Syntax check failed: ${error.message}`, 'fail')
    results.syntax.failed++
  }
}

// Check console errors
function checkConsoleErrors() {
  log('console', 'Checking for console errors...')
  
  try {
    const files = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        const relativePath = path.relative(config.projectRoot, file)
        
        let consoleErrors = []
        
        // Check for console.error statements
        const consoleErrorMatches = content.match(/console\.error\s*\([^)]*\)/g)
        if (consoleErrorMatches) {
          consoleErrors.push(...consoleErrorMatches.map(match => match.trim()))
        }
        
        // Check for console.warn statements
        const consoleWarnMatches = content.match(/console\.warn\s*\([^)]*\)/g)
        if (consoleWarnMatches) {
          consoleErrors.push(...consoleWarnMatches.map(match => match.trim()))
        }
        
        // Check for throw statements
        const throwMatches = content.match(/throw\s+new\s+Error\s*\([^)]*\)/g)
        if (throwMatches) {
          consoleErrors.push(...throwMatches.map(match => match.trim()))
        }
        
        // Check for error patterns
        config.consoleErrorPatterns.forEach(pattern => {
          const matches = content.match(pattern)
          if (matches) {
            consoleErrors.push(...matches.map(match => match.trim()))
          }
        })
        
        if (consoleErrors.length > 0) {
          log('console', `Console errors found in ${relativePath}: ${consoleErrors.length} issues`, 'fail')
          results.console.failed++
          results.console.errors.push({ file: relativePath, errors: consoleErrors })
        } else {
          results.console.passed++
        }
        
      } catch (error) {
        log('console', `Error checking ${path.relative(config.projectRoot, file)}: ${error.message}`, 'fail')
        results.console.failed++
        results.console.errors.push({ file: path.relative(config.projectRoot, file), error: error.message })
      }
    }
    
    log('console', `Console error check completed: ${results.console.passed} passed, ${results.console.failed} failed`)
    
  } catch (error) {
    log('console', `Console error check failed: ${error.message}`, 'fail')
    results.console.failed++
  }
}

// Check import/export issues
function checkImportExportIssues() {
  log('imports', 'Checking for import/export issues...')
  
  try {
    const files = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        const relativePath = path.relative(config.projectRoot, file)
        
        let importExportIssues = []
        
        // Check for import statements
        const importMatches = content.match(/import\s+.*from\s+['"][^'"]+['"]/g)
        if (importMatches) {
          importMatches.forEach(importStatement => {
            // Check for missing semicolons
            if (!importStatement.endsWith(';')) {
              importExportIssues.push(`Missing semicolon: ${importStatement}`)
            }
          })
        }
        
        // Check for export statements
        const exportMatches = content.match(/export\s+.*['"][^'"]+['"]/g)
        if (exportMatches) {
          exportMatches.forEach(exportStatement => {
            // Check for missing semicolons
            if (!exportStatement.endsWith(';')) {
              importExportIssues.push(`Missing semicolon: ${exportStatement}`)
            }
          })
        }
        
        // Check for default export issues
        if (content.includes('export default') && content.includes('export default function')) {
          const functionMatches = content.match(/export default function\s+\w+/g)
          if (functionMatches) {
            functionMatches.forEach(func => {
              if (!content.includes(`${func.replace('export default ', '')}()`)) {
                importExportIssues.push(`Unused exported function: ${func}`)
              }
            })
          }
        }
        
        if (importExportIssues.length > 0) {
          log('imports', `Import/export issues in ${relativePath}: ${importExportIssues.length} issues`, 'fail')
          results.imports.failed++
          results.imports.errors.push({ file: relativePath, issues: importExportIssues })
        } else {
          results.imports.passed++
        }
        
      } catch (error) {
        log('imports', `Error checking ${path.relative(config.projectRoot, file)}: ${error.message}`, 'fail')
        results.imports.failed++
        results.imports.errors.push({ file: path.relative(config.projectRoot, file), error: error.message })
      }
    }
    
    log('imports', `Import/export check completed: ${results.imports.passed} passed, ${results.imports.failed} failed`)
    
  } catch (error) {
    log('imports', `Import/export check failed: ${error.message}`, 'fail')
    results.imports.failed++
  }
}

// Check project structure
function checkProjectStructure() {
  log('structure', 'Checking project structure...')
  
  try {
    const requiredDirs = [
      'src',
      'src/app',
      'src/components',
      'src/lib',
      'public',
      'scripts',
      'database',
      'prisma'
    ]
    
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'tailwind.config.js',
      'src/app/layout.js',
      'src/app/page.js',
      'prisma/schema.prisma'
    ]
    
    let structureIssues = []
    
    // Check directories
    for (const dir of requiredDirs) {
      const dirPath = path.join(config.projectRoot, dir)
      if (!fs.existsSync(dirPath)) {
        structureIssues.push(`Missing directory: ${dir}`)
        results.structure.failed++
      } else {
        results.structure.passed++
      }
    }
    
    // Check files
    for (const file of requiredFiles) {
      const filePath = path.join(config.projectRoot, file)
      if (!fs.existsSync(filePath)) {
        structureIssues.push(`Missing file: ${file}`)
        results.structure.failed++
      } else {
        results.structure.passed++
      }
    }
    
    // Check for duplicate files
    const allFiles = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    const fileNames = allFiles.map(file => path.basename(file))
    const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index)
    
    if (duplicates.length > 0) {
      structureIssues.push(`Duplicate files: ${duplicates.join(', ')}`)
      results.structure.failed++
    }
    
    if (structureIssues.length > 0) {
      log('structure', `Structure issues found: ${structureIssues.length} issues`, 'fail')
      results.structure.errors.push({ issues: structureIssues })
    }
    
    log('structure', `Structure check completed: ${results.structure.passed} passed, ${results.structure.failed} failed`)
    
  } catch (error) {
    log('structure', `Structure check failed: ${error.message}`, 'fail')
    results.structure.failed++
  }
}

// Check performance issues
function checkPerformanceIssues() {
  log('performance', 'Checking for performance issues...')
  
  try {
    const files = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        const relativePath = path.relative(config.projectRoot, file)
        
        let performanceIssues = []
        
        // Check for large files
        const stats = fs.statSync(file)
        const fileSizeKB = stats.size / 1024
        if (fileSizeKB > 100) {
          performanceIssues.push(`Large file: ${fileSizeKB.toFixed(1)}KB`)
        }
        
        // Check for console.log in production
        const consoleLogMatches = content.match(/console\.log\s*\([^)]*\)/g)
        if (consoleLogMatches && consoleLogMatches.length > 3) {
          performanceIssues.push(`Too many console.log statements: ${consoleLogMatches.length}`)
        }
        
        // Check for unused imports
        const importMatches = content.match(/import\s+.*from\s+['"][^'"]+['"]/g)
        if (importMatches) {
          importMatches.forEach(importStatement => {
            const importName = importStatement.match(/import\s+(?:\{[^}]*\}|\w+)\s+from/)?.[1]
            if (importName && !content.includes(importName.replace(/[{}]/g, '').trim())) {
              performanceIssues.push(`Unused import: ${importStatement}`)
            }
          })
        }
        
        // Check for nested loops
        const forMatches = content.match(/for\s*\(/g)
        if (forMatches && forMatches.length > 2) {
          performanceIssues.push(`Multiple for loops: ${forMatches.length}`)
        }
        
        if (performanceIssues.length > 0) {
          log('performance', `Performance issues in ${relativePath}: ${performanceIssues.length} issues`, 'fail')
          results.performance.failed++
          results.performance.errors.push({ file: relativePath, issues: performanceIssues })
        } else {
          results.performance.passed++
        }
        
      } catch (error) {
        log('performance', `Error checking ${path.relative(config.projectRoot, file)}: ${error.message}`, 'fail')
        results.performance.failed++
        results.performance.errors.push({ file: path.relative(config.projectRoot, file), error: error.message })
      }
    }
    
    log('performance', `Performance check completed: ${results.performance.passed} passed, ${results.performance.failed} failed`)
    
  } catch (error) {
    log('performance', `Performance check failed: ${error.message}`, 'fail')
    results.performance.failed++
  }
}

// Generate summary
function generateSummary() {
  console.log('\n📊 SYSTEM AUDIT SUMMARY')
  console.log('======================')
  
  const categories = ['syntax', 'console', 'imports', 'structure', 'performance']
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

  // Show detailed errors
  if (totalFailed > 0) {
    console.log('\n🔍 DETAILED ERRORS:')
    console.log('==================')
    
    categories.forEach(category => {
      if (results[category].errors.length > 0) {
        console.log(`\n❌ ${category.toUpperCase()} ERRORS:`)
        results[category].errors.forEach(error => {
          if (error.file) {
            console.log(`  📁 ${error.file}`)
            if (error.issues) {
              error.issues.forEach(issue => console.log(`    - ${issue}`))
            }
            if (error.errors) {
              error.errors.forEach(err => console.log(`    - ${err}`))
            }
            if (error.error) {
              console.log(`    - ${error.error}`)
            }
          } else if (error.issues) {
            error.issues.forEach(issue => console.log(`  - ${issue}`))
          }
        })
      }
    })
  }

  if (totalFailed === 0) {
    console.log('\n🎉 SYSTEM AUDIT PASSED!')
    console.log('🔍 No errors found - System is clean and ready for production.')
  } else if (successRate >= 90) {
    console.log('\n⚠️  SYSTEM AUDIT MOSTLY PASSED')
    console.log('🔍 Minor issues found but system is functional.')
  } else {
    console.log('\n❌ SYSTEM AUDIT FAILED')
    console.log('🔍 Significant issues found that need attention.')
  }

  return { totalPassed, totalFailed, successRate }
}

// Main audit function
async function runSystemAudit() {
  console.log('🔍 Starting Comprehensive System Audit...')
  console.log(`📍 Project Root: ${config.projectRoot}`)
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  console.log('')

  try {
    checkSyntaxErrors()
    console.log('')
    
    checkConsoleErrors()
    console.log('')
    
    checkImportExportIssues()
    console.log('')
    
    checkProjectStructure()
    console.log('')
    
    checkPerformanceIssues()
    console.log('')

    const summary = generateSummary()

    // Exit with appropriate code
    if (summary.totalFailed === 0) {
      process.exit(0)
    } else if (summary.successRate >= 90) {
      process.exit(1)
    } else {
      process.exit(2)
    }

  } catch (error) {
    console.error('\n💥 System audit failed:', error)
    process.exit(3)
  }
}

// Run audit
if (require.main === module) {
  runSystemAudit()
}

module.exports = {
  checkSyntaxErrors,
  checkConsoleErrors,
  checkImportExportIssues,
  checkProjectStructure,
  checkPerformanceIssues,
  runSystemAudit
}
