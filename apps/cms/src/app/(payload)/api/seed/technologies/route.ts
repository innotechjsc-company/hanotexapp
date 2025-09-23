import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import path from 'path'
import { promises as fs } from 'fs'

type SeedItem = {
  title: string
  description?: string
  confidential_detail?: string
  trl_level: number
  category?: string
  owners?: {
    owner_type: 'individual' | 'company' | 'research_institution'
    owner_name: string
    ownership_percentage: number
  }[]
  legal_certification?: {
    protection_scope?: { scope: string }[]
    standard_certifications?: { certification: string }[]
  }
  investment_desire?: { investment_option: string }[]
  transfer_type?: { transfer_option: string }[]
  pricing: {
    pricing_type: 'grant_seed' | 'vc_joint_venture' | 'growth_strategic'
    price_from: number
    price_to: number
    currency: 'vnd' | 'usd' | 'eur'
  }
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const dryRun = url.searchParams.get('dryRun') === 'true'
  const keyFromQuery = url.searchParams.get('key')
  const keyFromHeader = req.headers.get('x-seed-key') || req.headers.get('x-seed-secret')
  const seedKey = process.env.SEED_KEY || ''

  if (!seedKey) {
    return Response.json(
      { success: false, error: 'Missing SEED_KEY in environment' },
      { status: 400 },
    )
  }

  if (keyFromHeader !== seedKey && keyFromQuery !== seedKey) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  // Use provided submitter ID
  const submitterId = '68d1766332f95be78613b481'

  // Load seed JSON
  const seedPath = path.resolve(process.cwd(), 'src/seed/technologies.json')
  let items: SeedItem[] = []
  try {
    const raw = await fs.readFile(seedPath, 'utf-8')
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) throw new Error('Invalid JSON format')
    items = parsed
  } catch (e: any) {
    return Response.json(
      { success: false, error: `Failed to read seed JSON: ${e?.message || String(e)}` },
      { status: 500 },
    )
  }

  const results: { created: number; skipped: number; errors: number; details: any[] } = {
    created: 0,
    skipped: 0,
    errors: 0,
    details: [],
  }

  for (const item of items) {
    try {
      // Deduplicate by title
      const dup = await payload.find({
        collection: 'technologies',
        where: { title: { equals: item.title } },
        limit: 1,
        overrideAccess: true,
      })

      if (dup?.docs?.length) {
        results.skipped += 1
        results.details.push({ title: item.title, action: 'skipped', reason: 'duplicate' })
        continue
      }

      if (dryRun) {
        results.created += 1
        results.details.push({ title: item.title, action: 'dry-run' })
        continue
      }

      const created = await payload.create({
        collection: 'technologies',
        data: {
          title: item.title,
          description: item.description || '',
          confidential_detail: item.confidential_detail || '',
          trl_level: item.trl_level,
          category: item.category || '',
          owners: item.owners || [],
          legal_certification: item.legal_certification || {},
          investment_desire: item.investment_desire || [],
          transfer_type: item.transfer_type || [],
          pricing: item.pricing,
          submitter: submitterId || '',
          status: 'approved',
          visibility_mode: 'public',
        },
        // Bypass access and hooks to avoid auth requirement in hooks
        overrideAccess: true,
      })

      results.created += 1
      results.details.push({ title: item.title, action: 'created', id: (created as any).id })
    } catch (e: any) {
      results.errors += 1
      results.details.push({ title: item.title, action: 'error', error: e?.message || String(e) })
    }
  }

  return Response.json({ success: true, ...results })
}
