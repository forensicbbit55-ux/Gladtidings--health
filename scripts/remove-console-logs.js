#!/usr/bin/env node

/**
 * Remove Console Logs Script
 * Removes console.log statements while keeping console.error and console.warn
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

function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false
    let removedCount = 0

    // Remove console.log statements (but keep console.error and console.warn)
    const consoleLogRegex = /console\.log\s*\([^)]*\);?\s*\n?/g
    const matches = content.match(consoleLogRegex)
    
    if (matches) {
      removedCount = matches.length
      content = content.replace(consoleLogRegex, '')
      modified = true
    }

    // Also remove empty lines left behind
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n')

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Removed ${removedCount} console.log statements from ${path.relative(config.projectRoot, filePath)}`)
      return true
    }

    return false

  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`)
    return false
  }
}

// Main function
function runRemoval() {
  console.log('🧹 Removing Console Log Statements...')
  console.log(`📍 Project Root: ${config.projectRoot}`)
  console.log('')

  try {
    const files = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    
    let fixedCount = 0
    let totalRemoved = 0
    let errorCount = 0

    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf8')
        const beforeCount = (content.match(/console\.log/g) || []).length
        
        if (removeConsoleLogs(file)) {
          fixedCount++
          totalRemoved += beforeCount
        }
      } catch (error) {
        errorCount++
        console.error(`❌ Error processing ${path.relative(config.projectRoot, file)}: ${error.message}`)
      }
    }

    console.log('')
    console.log('📊 CONSOLE LOG REMOVAL SUMMARY')
    console.log('===============================')
    console.log(`✅ Files modified: ${fixedCount}`)
    console.log(`🧹 Total console.log statements removed: ${totalRemoved}`)
    console.log(`❌ Errors: ${errorCount}`)
    console.log(`📁 Total files: ${files.length}`)

    if (fixedCount > 0) {
      console.log('\n🎉 Console.log statements have been removed!')
      console.log('🔍 console.error and console.warn statements were preserved.')
    } else {
      console.log('\nℹ️  No console.log statements found.')
    }

  } catch (error) {
    console.error('\n💥 Removal process failed:', error)
  }
}

// Run removal
if (require.main === module) {
  runRemoval()
}

module.exports = { removeConsoleLogs, runRemoval }
