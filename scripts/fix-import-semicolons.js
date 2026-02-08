#!/usr/bin/env node

/**
 * Fix Import Semicolons Script
 * Specifically fixes missing semicolons on import statements
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

function fixImportSemicolons(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    // Fix missing semicolons on import statements
    const importRegex = /import\s+(?:[^;]+?)\s+from\s+['"][^'"]+['"]\s*(?![;])/g
    content = content.replace(importRegex, (match) => {
      modified = true
      return match + ';'
    })

    // Fix missing semicolons on export statements
    const exportRegex = /export\s+(?:[^;]+?)\s+from\s+['"][^'"]+['"]\s*(?![;])/g
    content = content.replace(exportRegex, (match) => {
      modified = true
      return match + ';'
    })

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Fixed imports: ${path.relative(config.projectRoot, filePath)}`)
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
  console.log('🔧 Fixing Import Semicolons...')
  console.log(`📍 Project Root: ${config.projectRoot}`)
  console.log('')

  try {
    const files = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    
    let fixedCount = 0
    let errorCount = 0

    for (const file of files) {
      try {
        if (fixImportSemicolons(file)) {
          fixedCount++
        }
      } catch (error) {
        errorCount++
        console.error(`❌ Error processing ${path.relative(config.projectRoot, file)}: ${error.message}`)
      }
    }

    console.log('')
    console.log('📊 IMPORT FIX SUMMARY')
    console.log('=====================')
    console.log(`✅ Files fixed: ${fixedCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    console.log(`📁 Total files: ${files.length}`)

    if (fixedCount > 0) {
      console.log('\n🎉 Import semicolons have been fixed!')
    } else {
      console.log('\nℹ️  No import fixes were needed.')
    }

  } catch (error) {
    console.error('\n💥 Fix process failed:', error)
  }
}

// Run fixes
if (require.main === module) {
  runFix()
}

module.exports = { fixImportSemicolons, runFix }
