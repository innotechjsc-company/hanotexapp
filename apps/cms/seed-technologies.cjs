#!/usr/bin/env node

/**
 * Script to trigger Technologies seed via HTTP endpoint
 * Usage: node seed-technologies.cjs [--dry-run]
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
  seedKey: process.env.SEED_KEY,
}

if (!config.seedKey) {
  console.error('❌ Error: Please set SEED_KEY environment variable')
  console.error('Example: SEED_KEY=your-secret-key node seed-technologies.cjs')
  process.exit(1)
}

const url = `${config.protocol}://${config.host}:${config.port}/api/seed/technologies${
  isDryRun ? '?dryRun=true' : ''
}`

console.log(`🚀 Starting technologies seed...`)
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
          const preview = result.details.slice(0, 10)
          console.log('\n📋 Details (first 10):')
          preview.forEach((detail, index) => {
            const status =
              detail.action === 'created' ? '✅' : detail.action === 'skipped' ? '⏭️' : '❌'
            console.log(`   ${index + 1}. ${status} ${detail.title} (${detail.action})`)
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

