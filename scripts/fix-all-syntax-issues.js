#!/usr/bin/env node

/**
 * Fix All Syntax Issues Script
 * Comprehensive syntax fix for JavaScript/JSX files
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

    // Fix missing semicolons in async functions
    content = content.replace(/const\s+(\w+)\s*=\s*async\s*\(\s*\)\s*=>\s*{/g, (match) => {
      return `const ${match[1]} = async () => {`
    })

    // Fix missing semicolons in await statements
    content = content.replace(/await\s+(\w+)\([^)]*\)(?!\s*;)/g, 'await $1($2);')

    // Fix missing semicolons in setLoading statements
    content = content.replace(/setLoading\((true|false)\)(?!\s*;)/g, 'setLoading($1);')

    // Fix missing semicolons in function returns
    content = content.replace(/return\s*\(/g, 'return (')

    // Fix missing semicolons in return statements
    content = content.replace(/return\s+([^;{}])\s*$/gm, 'return $1;')

    // Fix JSX style prop syntax
    content = content.replace(/style=\{\s*([^}]+)\s*\}/g, 'style={{ $1 }}')

    // Fix missing semicolons in export statements
    content = content.replace(/export\s+default\s+function\s+(\w+)\s*\([^)]*\)(?!\s*{)/g, 'export default function $1 {')

    // Fix missing semicolons in import statements
    content = content.replace(/import\s+([^;]+?)\s+from\s+['"][^'"]+['"]\s*(?![;])/g, 'import $1 from $2;')

    // Fix missing semicolons after function declarations
    content = content.replace(/const\s+(\w+)\s*=\s*\([^)]*\)(?!\s*;)/g, 'const $1 = ($2);')

    // Fix missing semicolons in variable declarations
    content = content.replace(/const\s+(\w+)\s*=\s*([^;]+)(?!\s*;)/g, 'const $1 = $2;')

    // Fix missing semicolons in JSX expressions
    content = content.replace(/\{([^}]+)\}/g, '{$1};')

    // Fix double semicolons
    content = content.replace(/;;/g, ';')

    // Fix missing semicolons at end of lines
    content = content.replace(/([;{}])\s*\n\s*(?![;{}])/g, '$1;\n')

    // Fix JSX closing tags
    content = content.replace(/<\/(\w+)>\s*\n\s*(?![<])/g, '</$1>\n')

    // Fix missing semicolons in object properties
    content = content.replace(/(\w+):\s*([^,;}])\s*\n/g, '$1: $2;')

    // Fix missing semicolons in array methods
    content = content(/\.map\(([^)]+)\)\s*=>\s*\(/g, '.map(($1) => (')

    // Fix missing semicolons in console statements
    content = content.replace(/console\.(log|error|warn)\([^)]*\)(?!\s*;)/g, 'console.$1($2);')

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

module.exports = { fixSyntaxIssues, runFix }
