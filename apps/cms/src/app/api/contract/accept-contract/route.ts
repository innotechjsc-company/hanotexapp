import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { User, Contract } from '@/payload-types'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    // Accept both raw body and nested { body: {...} }
    const raw = await request.json()
    const hasBodyField = (v: unknown): v is { body: unknown } => typeof v === 'object' && v !== null && 'body' in v
    const bodyRaw = hasBodyField(raw) ? raw.body : raw
    const body = (typeof bodyRaw === 'object' && bodyRaw !== null ? bodyRaw : {}) as { contractId?: string; userId?: string }

    const { contractId, userId } = body || {}
    console.log('body', body)
    console.log('contractId', contractId)
    console.log('userId', userId)

    // Validate required fields
    if (!contractId || !userId) {
      return NextResponse.json(
        { error: 'Contract ID and User ID are required' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Get the contract with full details
    let contract: Contract
    try {
      contract = await payload.findByID({
        collection: 'contract',
        id: contractId,
        depth: 2,
      }) as Contract
    } catch (err: unknown) {
      // Return a proper 404 if the contract does not exist
      if (
        (typeof err === 'object' && err !== null && 'status' in err && (err as { status?: number }).status === 404) ||
        (err instanceof Error && /not found/i.test(err.message))
      ) {
        return NextResponse.json(
          { error: 'Contract not found' },
          { status: 404, headers: corsHeaders },
        )
      }
      throw err
    }

    // Determine which party the user is
    const userAId = typeof contract.user_a === 'object' ? contract.user_a.id : contract.user_a
    const userBId = typeof contract.user_b === 'object' ? contract.user_b.id : contract.user_b

    if (String(userAId) !== String(userId) && String(userBId) !== String(userId)) {
      return NextResponse.json(
        { error: 'User is not a party to this contract' },
        { status: 403, headers: corsHeaders },
      )
    }

    // Get current confirmed users (handle both array and string/object formats)
    let confirmedUsers: string[] = []
    if (contract.users_confirm) {
      if (Array.isArray(contract.users_confirm)) {
        confirmedUsers = contract.users_confirm.map((user) =>
          typeof user === 'object' ? user.id : user,
        )
      }
    }

    // Check if user has already accepted
    if (confirmedUsers.includes(String(userId))) {
      return NextResponse.json(
        { error: 'User has already accepted this contract' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Add user to confirmed users list
    const updatedConfirmedUsers = [...confirmedUsers, String(userId)]

    // Check if both parties will have accepted after this update
    const bothAccepted =
      updatedConfirmedUsers.includes(String(userAId)) &&
      updatedConfirmedUsers.includes(String(userBId))

    // Prepare update data
    const updateData: Partial<Pick<Contract, 'users_confirm' | 'status'>> = {
      users_confirm: updatedConfirmedUsers,
    }

    // If both parties have accepted, update contract status to 'signed'
    if (bothAccepted) {
      updateData.status = 'signed'
    }

    // Update the contract
    const updatedContract = await payload.update({
      collection: 'contract',
      id: contractId,
      data: updateData,
    }) as Contract

    // If both parties have accepted, also update the related proposal status
    if (bothAccepted) {
      try {
        const contractTechProp = contract.technology_propose
        const techPropId = typeof contractTechProp === 'object' && contractTechProp !== null ? contractTechProp.id : contractTechProp ?? undefined
        const contractProjProp = contract.project_propose
        const projPropId = typeof contractProjProp === 'object' && contractProjProp !== null ? contractProjProp.id : contractProjProp ?? undefined
        const contractProp = contract.propose
        const propId = typeof contractProp === 'object' && contractProp !== null ? contractProp.id : contractProp ?? undefined

        if (techPropId) {
          await payload.update({
            collection: 'technology-propose',
            id: String(techPropId),
            data: { status: 'contract_signed' },
          })
        } else if (projPropId) {
          await payload.update({
            collection: 'project-propose',
            id: String(projPropId),
            data: { status: 'contract_signed' },
          })
        } else if (propId) {
          await payload.update({
            collection: 'propose',
            id: String(propId),
            data: { status: 'contract_signed' },
          })
        }
      } catch (error) {
        console.error('Failed to update related proposal status:', error)
        // Don't fail the contract acceptance if proposal update fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        contract: updatedContract,
        bothAccepted,
        message: bothAccepted
          ? 'Contract completed! Both parties have accepted.'
          : 'Contract acceptance recorded. Waiting for other party.',
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error('Contract acceptance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders },
    )
  }
}
