#!/usr/bin/env node

/**
 * Fix All Syntax Issues Script
 * Fixes semicolon issues throughout the codebase
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

function fixAllSyntaxIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    // Fix semicolons at beginning of lines
    content = content.replace(/^;+/gm, '')

    // Fix semicolons after import statements
    content = content.replace(/import\s+([^;]+?)\s+from\s+['"][^'"]+['"];+/g, 'import $1 from $2;')

    // Fix missing semicolons after import statements
    content = content.replace(/import\s+([^;]+?)\s+from\s+['"][^'"]+['"]\s*(?![;])/g, 'import $1 from $2;')

    // Fix semicolons after CSS imports
    content = content.replace(/import\s+['"][^'"]+['"];+/g, "import '$2';")

    // Fix missing semicolons after CSS imports
    content = content.replace(/import\s+['"][^'"]+['"]\s*(?![;])/g, (match) => {
      if (!match.endsWith(';')) {
        return match + ';'
      }
      return match
    })

    // Fix semicolons after export statements
    content = content.replace(/export\s+(const|let|var|function|class|default)\s+([^;]+);+/g, 'export $1 $2;')

    // Fix missing semicolons after export statements
    content = content.replace(/export\s+(const|let|var|function|class|default)\s+([^;]+)\s*(?![;{])/g, 'export $1 $2;')

    // Fix double semicolons
    content = content.replace(/;;/g, ';')

    // Fix semicolon before comments
    content = content.replace(/;\s*\/\//g, '//')
    content = content.replace(/;\s*\/\*/g, '/*')

    // Clean up extra whitespace
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n')

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Fixed syntax: ${path.relative(config.projectRoot, filePath)}`)
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
  console.log('🔧 Fixing All Syntax Issues...')
  console.log(`📍 Project Root: ${config.projectRoot}`)
  console.log('')

  try {
    const files = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    
    let fixedCount = 0
    let errorCount = 0

    for (const file of files) {
      try {
        if (fixAllSyntaxIssues(file)) {
          fixedCount++
        }
      } catch (error) {
        errorCount++
        console.error(`❌ Error processing ${path.relative(config.projectRoot, file)}: ${error.message}`)
      }
    }

    console.log('')
    console.log('📊 SYNTAX FIX SUMMARY')
    console.log('=====================')
    console.log(`✅ Files fixed: ${fixedCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    console.log(`📁 Total files: ${files.length}`)

    if (fixedCount > 0) {
      console.log('\n🎉 All syntax issues have been fixed!')
    } else {
      console.log('\nℹ️  No syntax fixes were needed.')
    }

  } catch (error) {
    console.error('\n💥 Fix process failed:', error)
  }
}

// Run fixes
if (require.main === module) {
  runFix()
}

module.exports = { fixAllSyntaxIssues, runFix }
