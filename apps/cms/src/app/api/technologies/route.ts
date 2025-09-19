import configPromise from '@payload-config'
import { getPayload } from 'payload'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export const POST = async (req: Request) => {
  const payload = await getPayload({ config: configPromise })

  let data: any
  try {
    data = await req.json()
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  try {
    const created = await payload.create({
      collection: 'technologies',
      data,
    })

    // Log để verify UUID được tạo tự động
    console.log('Technology created with UUID:', created.id, typeof created.id)
    // Optionally create related Intellectual Property records
    const ipInput = data?.intellectual_property ?? data?.intellectualProperty
    let createdIPs: any[] | undefined
    let ipErrors: string[] | undefined
    if (Array.isArray(ipInput) && ipInput.length > 0) {
      createdIPs = []
      ipErrors = []
      for (const item of ipInput) {
        try {
          const createdIP = await (payload as any).create({
            collection: 'intellectual_property',
            data: {
              technology: created.id,
              code: item?.code,
              type: item?.type,
              status: item?.status,
            },
          })
          createdIPs.push(createdIP)
        } catch (err: any) {
          ipErrors.push(err?.message ?? String(err))
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        technology: created,
        intellectual_property: createdIPs,
        ipErrors,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    )
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e?.message ?? 'Create failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
}

// Handle preflight requests for CORS
export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}
