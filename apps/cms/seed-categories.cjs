#!/usr/bin/env node

/**
 * Script to seed categories data
 * Usage: node seed-categories.js [--dry-run]
 */

const https = require('https')
const http = require('http')

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')

// Configuration
const config = {
  host: process.env.CMS_HOST || 'localhost',
  port: process.env.CMS_PORT || 4000,
  protocol: process.env.CMS_PROTOCOL || 'http',
  seedKey: process.env.SEED_KEY || 'your-seed-key-here',
}

if (!config.seedKey || config.seedKey === 'your-seed-key-here') {
  console.error('❌ Error: Please set SEED_KEY environment variable')
  console.error('Example: SEED_KEY=your-secret-key node seed-categories.js')
  process.exit(1)
}

const url = `${config.protocol}://${config.host}:${config.port}/api/seed/categories${isDryRun ? '?dryRun=true' : ''}`

console.log(`🚀 Starting categories seed...`)
console.log(`📍 URL: ${url}`)
console.log(`🔍 Dry run: ${isDryRun ? 'Yes' : 'No'}`)
console.log('')

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-seed-key': config.seedKey,
  },
}

const client = config.protocol === 'https' ? https : http

const req = client.request(url, options, (res) => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    try {
      const result = JSON.parse(data)

      if (result.success) {
        console.log('✅ Seed completed successfully!')
        console.log(`📊 Results:`)
        console.log(`   - Created: ${result.created}`)
        console.log(`   - Skipped: ${result.skipped}`)
        console.log(`   - Errors: ${result.errors}`)

        if (result.details && result.details.length > 0) {
          console.log('\n📋 Details:')
          result.details.forEach((detail, index) => {
            const status =
              detail.action === 'created' ? '✅' : detail.action === 'skipped' ? '⏭️' : '❌'
            console.log(
              `   ${index + 1}. ${status} ${detail.name} (${detail.code_intl}/${detail.code_vn})`,
            )
            if (detail.action === 'error') {
              console.log(`      Error: ${detail.error}`)
            }
          })
        }
      } else {
        console.error('❌ Seed failed:', result.error)
        process.exit(1)
      }
    } catch (e) {
      console.error('❌ Failed to parse response:', e.message)
      console.error('Raw response:', data)
      process.exit(1)
    }
  })
})

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message)
  process.exit(1)
})

req.end()
