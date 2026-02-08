#!/usr/bin/env node

/**
 * Fix Syntax Issues Script
 * Fixes various syntax issues including extra semicolons and formatting
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

function fixSyntaxIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    // Fix extra semicolons at beginning of lines
    content = content.replace(/^;+/gm, '')

    // Fix double semicolons
    content = content.replace(/;;/g, ';')

    // Fix semicolon before export default
    content = content.replace(/;\s*export default/g, 'export default')

    // Fix semicolon before export const
    content = content.replace(/;\s*export const/g, 'export const')

    // Fix semicolon before export function
    content = content.replace(/;\s*export function/g, 'export function')

    // Fix missing semicolons on import statements (but don't add extra)
    content = content.replace(/import\s+([^;]+?)\s+from\s+['"][^'"]+['"]\s*(?![;])/g, 'import $1 from $2;')

    // Fix semicolon after import statement
    content = content.replace(/import\s+([^;]+?)\s+from\s+['"][^'"]+['"];+/g, 'import $1 from $2;')

    // Fix semicolon after export statement
    content = content.replace(/export\s+([^;]+?)\s+from\s+['"][^'"]+['"];+/g, 'export $1 from $2;')

    // Remove empty lines at beginning
    content = content.replace(/^\s*\n/, '')

    // Fix multiple empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n')

    // Fix spacing around braces
    content = content.replace(/\{\s*\n/g, '{\n')
    content = content.replace(/\n\s*\}/g, '\n}')

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
  console.log('🔧 Fixing Syntax Issues...')
  console.log(`📍 Project Root: ${config.projectRoot}`)
  console.log('')

  try {
    const files = getAllFiles(path.join(config.projectRoot, config.srcDir), config.fileExtensions, config.excludeDirs)
    
    let fixedCount = 0
    let errorCount = 0

    for (const file of files) {
      try {
        if (fixSyntaxIssues(file)) {
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
      console.log('\n🎉 Syntax issues have been fixed!')
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

module.exports = { fixSyntaxIssues, runFix }
