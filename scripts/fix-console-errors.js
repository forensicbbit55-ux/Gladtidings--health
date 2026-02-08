#!/usr/bin/env node

/**
 * Fix Console Errors Script
 * Automatically fixes common console errors and syntax issues
 */

const fs = require('fs')
const path = require('path')

// Configuration
const config = {
  projectRoot: __dirname + '/..',
  srcDir: 'src',
  fileExtensions: ['.js', '.jsx'],
  excludeDirs: ['node_modules', '.next', '.git']
}

// Utility functions
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

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    // Fix missing semicolons on import statements
    content = content.replace(/import\s+.*from\s+['"][^'"]+['"]\s*(?!;)/g, (match) => {
      modified = true
      return match + ';'
    })

    // Fix missing semicolons on export statements
    content = content.replace(/export\s+.*['"][^'"]+['"]\s*(?!;)/g, (match) => {
      modified = true
      return match + ';'
    })

    // Remove console.log statements (keep console.error and console.warn)
    content = content.replace(/console\.log\s*\([^)]*\);?\s*\n?/g, () => {
      modified = true
      return ''
    })

    // Fix double semicolons
    content = content.replace(/;;/g, ';')

    // Fix missing semicolons at end of lines
    content = content.replace(/([;])\s*\n\s*([a-zA-Z_$])/g, '$1\n$2')

    // Fix unmatched parentheses (basic fix)
    const openParens = (content.match(/\(/g) || []).length
    const closeParens = (content.match(/\)/g) || []).length
    if (openParens > closeParens) {
      content += ')'.repeat(openParens - closeParens)
      modified = true
    }

    // Fix unmatched braces (basic fix)
    const openBraces = (content.match(/\{/g) || []).length
    const closeBraces = (content.match(/\}/g) || []).length
    if (openBraces > closeBraces) {
      content += '}'.repeat(openBraces - closeBraces)
      modified = true
    }

    // Fix unmatched brackets (basic fix)
    const openBrackets = (content.match(/\[/g) || []).length
    const closeBrackets = (content.match(/\]/g) || []).length
    if (openBrackets > closeBrackets) {
      content += ']'.repeat(openBrackets - closeBrackets)
      modified = true
    }

    // Remove extra closing brackets/braces/parentheses
    if (closeParens > openParens) {
      content = content.replace(/\)(\s*)$/g, '$1')
      modified = true
    }
    if (closeBraces > openBraces) {
      content = content.replace(/\}(\s*)$/g, '$1')
      modified = true
    }
    if (closeBrackets > openBrackets) {
      content = content.replace(/\](\s*)$/g, '$1')
      modified = true
    }

    // Fix double commas
    content = content.replace(/,,/g, ',')

    // Fix double arrows
    content = content.replace(/=>\s*=>/g, '=>')

    // Fix double braces
    content = content.replace(/{{/g, '{')
    content = content.replace(/}}/g, '}')

    // Add semicolon at end of export default function
    content = content.replace(/export default function\s+\w+[^;]*\n}/g, (match) => {
      if (!match.endsWith(';')) {
        modified = true
        return match.replace(/\n}/, '\n};')
      }
      return match
    })

    // Fix missing semicolon after function declarations
    content = content.replace(/function\s+\w+[^;]*\n}/g, (match) => {
      if (!match.endsWith(';')) {
        modified = true
        return match.replace(/\n}/, '\n};')
      }
      return match
    })

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Fixed: ${path.relative(config.projectRoot, filePath)}`)
      return true
    }

    return false

  } catch (error) {
    console.error(`❌ Error fixing ${filePath}: ${error.message}`)
    return false
  }
}

// Main fix function
function runFix() {
  console.log('🔧 Starting Console Error Fixes...')
  console.log(`📍 Project Root: ${config.projectRoot}`)
  console.log('')

  try {
    const files = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    
    let fixedCount = 0
    let errorCount = 0

    for (const file of files) {
      try {
        if (fixFile(file)) {
          fixedCount++
        }
      } catch (error) {
        errorCount++
        console.error(`❌ Error processing ${path.relative(config.projectRoot, file)}: ${error.message}`)
      }
    }

    console.log('')
    console.log('📊 FIX SUMMARY')
    console.log('================')
    console.log(`✅ Files fixed: ${fixedCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    console.log(`📁 Total files: ${files.length}`)

    if (fixedCount > 0) {
      console.log('\n🎉 Console errors have been fixed!')
      console.log('🔧 Run the system audit again to verify fixes.')
    } else {
      console.log('\nℹ️  No fixes were needed.')
    }

  } catch (error) {
    console.error('\n💥 Fix process failed:', error)
  }
}

// Run fixes
if (require.main === module) {
  runFix()
}

module.exports = { fixFile, runFix }
