#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔒 Running Security Audit...\n');

// Security checks
const securityChecks = {
  exposedSecrets: {
    patterns: [
      /sk-[a-zA-Z0-9]{48}/, // Stripe keys
      /pk_[a-zA-Z0-9]{48}/, // Stripe publishable keys
      /ghp_[a-zA-Z0-9]{36}/, // GitHub personal access tokens
      /gho_[a-zA-Z0-9]{36}/, // GitHub OAuth tokens
      /ghu_[a-zA-Z0-9]{36}/, // GitHub user tokens
      /ghs_[a-zA-Z0-9]{36}/, // GitHub server tokens
      /ghr_[a-zA-Z0-9]{36}/, // GitHub refresh tokens
      /xoxb-[0-9]{13}-[0-9]{13}-[a-zA-Z0-9]{24}/, // Slack bot tokens
      /AIza[0-9A-Za-z_-]{35}/, // Google API keys
      /AKIA[0-9A-Z]{16}/, // AWS access keys
      /postgresql:\/\/[^\s]+:[^\s]+@[^\s]+:[0-9]+\/[^\s]+/, // Database URLs with passwords
      /mongodb:\/\/[^\s]+:[^\s]+@[^\s]+:[0-9]+\/[^\s]+/, // MongoDB URLs with passwords
      /redis:\/\/[^\s]+:[^\s]+@[^\s]+:[0-9]+/, // Redis URLs with passwords
    ],
    description: 'Check for exposed API keys and secrets'
  },
  
  hardcodedCredentials: {
    patterns: [
      /password\s*=\s*["'][^"']+["']/i,
      /secret\s*=\s*["'][^"']+["']/i,
      /key\s*=\s*["'][^"']+["']/i,
      /token\s*=\s*["'][^"']+["']/i,
    ],
    description: 'Check for hardcoded credentials'
  },
  
  insecurePractices: {
    patterns: [
      /console\.log\(process\.env\./, // Logging environment variables
      /eval\(/, // Use of eval()
      /innerHTML\s*=/, // Use of innerHTML
      /dangerouslySetInnerHTML/, // React dangerouslySetInnerHTML
    ],
    description: 'Check for insecure coding practices'
  }
};

// Function to scan directory for files
function scanDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          traverse(fullPath);
        } else if (extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  traverse(dir);
  return files;
}

// Function to check file for security issues
function checkFile(filePath, patterns) {
  const issues = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    patterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Find line number
          const lines = content.split('\n');
          let lineNumber = -1;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(match)) {
              lineNumber = i + 1;
              break;
            }
          }
          
          issues.push({
            pattern: pattern.toString(),
            match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
            line: lineNumber,
            severity: 'high'
          });
        });
      }
    });
  } catch (error) {
    // Skip files we can't read
  }
  
  return issues;
}

// Function to check .gitignore
function checkGitIgnore() {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    return {
      status: 'error',
      message: '.gitignore file not found'
    };
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf8');
  const requiredEntries = [
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    'node_modules',
    '.next',
    'dist',
    'build'
  ];
  
  const missingEntries = requiredEntries.filter(entry => !content.includes(entry));
  
  return {
    status: missingEntries.length === 0 ? 'pass' : 'warning',
    message: missingEntries.length === 0 ? 'All required .gitignore entries present' : `Missing .gitignore entries: ${missingEntries.join(', ')}`,
    missing: missingEntries
  };
}

// Function to check environment files
function checkEnvironmentFiles() {
  const envFiles = ['.env', '.env.local', '.env.development.local', '.env.test.local', '.env.production.local'];
  const issues = [];
  
  envFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for secrets in env files
        const secretPatterns = [
          /sk-[a-zA-Z0-9]{48}/,
          /pk_[a-zA-Z0-9]{48}/,
          /ghp_[a-zA-Z0-9]{36}/,
          /AIza[0-9A-Za-z_-]{35}/,
          /AKIA[0-9A-Z]{16}/
        ];
        
        secretPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            issues.push({
              file: file,
              issue: 'Potential secret found in environment file',
              severity: 'high'
            });
          }
        });
      } catch (error) {
        // Skip files we can't read
      }
    }
  });
  
  return issues;
}

// Main audit function
function runSecurityAudit() {
  const srcDir = path.join(__dirname, '../src');
  const files = scanDirectory(srcDir);
  
  console.log(`📁 Scanning ${files.length} files...\n`);
  
  let totalIssues = 0;
  let highSeverityIssues = 0;
  
  // Run all security checks
  Object.entries(securityChecks).forEach(([checkName, config]) => {
    console.log(`🔍 Checking ${config.description}...`);
    
    let issues = [];
    files.forEach(file => {
      const fileIssues = checkFile(file, config.patterns);
      fileIssues.forEach(issue => {
        issues.push({
          ...issue,
          file: path.relative(srcDir, file)
        });
      });
    });
    
    if (issues.length > 0) {
      console.log(`❌ Found ${issues.length} issues:`);
      issues.forEach(issue => {
        console.log(`   ${issue.file}:${issue.line} - ${issue.match}`);
        if (issue.severity === 'high') highSeverityIssues++;
      });
      totalIssues += issues.length;
    } else {
      console.log(`✅ No issues found`);
    }
    console.log('');
  });
  
  // Check .gitignore
  console.log('🔍 Checking .gitignore configuration...');
  const gitignoreCheck = checkGitIgnore();
  if (gitignoreCheck.status === 'error') {
    console.log(`❌ ${gitignoreCheck.message}`);
    totalIssues++;
  } else if (gitignoreCheck.status === 'warning') {
    console.log(`⚠️  ${gitignoreCheck.message}`);
    totalIssues++;
  } else {
    console.log(`✅ ${gitignoreCheck.message}`);
  }
  console.log('');
  
  // Check environment files
  console.log('🔍 Checking environment files...');
  const envIssues = checkEnvironmentFiles();
  if (envIssues.length > 0) {
    console.log(`❌ Found ${envIssues.length} environment file issues:`);
    envIssues.forEach(issue => {
      console.log(`   ${issue.file} - ${issue.issue}`);
      highSeverityIssues++;
    });
    totalIssues += envIssues.length;
  } else {
    console.log(`✅ No issues found in environment files`);
  }
  console.log('');
  
  // Summary
  console.log('📊 Security Audit Summary:');
  console.log(`   Total issues: ${totalIssues}`);
  console.log(`   High severity: ${highSeverityIssues}`);
  
  if (highSeverityIssues > 0) {
    console.log('\n🚨 SECURITY ALERT: High severity issues found!');
    console.log('Please address these issues before deploying to production.');
    process.exit(1);
  } else if (totalIssues > 0) {
    console.log('\n⚠️  Security issues found. Review and fix if necessary.');
  } else {
    console.log('\n✅ Security audit passed! No critical issues found.');
  }
}

// Run the audit
if (require.main === module) {
  runSecurityAudit();
}

module.exports = { runSecurityAudit };
