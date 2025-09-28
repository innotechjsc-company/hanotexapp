import {  NextRequest, NextResponse  } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Technology as TechnologyType, User as UserType, ServiceTicket } from '@/payload-types'

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

interface TechnologyCreatePayload {
  title: string
  category: string // ID string
  trl_level: number
  description: string
  confidential_detail: string
  image?: string // Main image Media
  documents?: string[] // Media IDs
  owners?: Array<{
    owner_type: 'individual' | 'company' | 'research_institution'
    owner_name: string
    ownership_percentage: number
  }>
  legal_certification?: {
    protection_scope?: Array<{ scope: string }>
    standard_certifications?: Array<{ certification: string }>
    files?: string[] // Media IDs
  }
  investment_desire?: Array<{ investment_option: string }>
  transfer_type?: Array<{ transfer_option: string }>
  pricing?: {
    pricing_type: 'grant_seed' | 'vc_joint_venture' | 'growth_strategic'
    price_from: number
    price_to: number
    price_type: 'indicative' | 'floor' | 'firm'
  }
  intellectual_property?: Array<{
    code: string
    type:
      | 'patent'
      | 'utility_solution'
      | 'industrial_design'
      | 'trademark'
      | 'copyright'
      | 'trade_secret'
    status: 'pending' | 'granted' | 'expired' | 'rejected'
  }>
  visibility_mode?: 'public' | 'private' | 'restricted'
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'
  // Service ticket creation
  services?: Array<{
    service_id: string
    description: string
    responsible_user_id: string
    implementer_ids: string[]
    document_id?: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = (await request.json()) as TechnologyCreatePayload

    // Validate required fields
    if (
      !body.title ||
      !body.category ||
      !body.trl_level ||
      !body.description ||
      !body.confidential_detail
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: title, category, trl_level, description, confidential_detail are required',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Validate TRL level range
    if (body.trl_level < 1 || body.trl_level > 9) {
      return NextResponse.json(
        { error: 'TRL level must be between 1 and 9' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Validate required array/object fields and provide defaults
    if (!body.owners || !Array.isArray(body.owners) || body.owners.length === 0) {
      return NextResponse.json(
        { error: 'At least one technology owner is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (
      !body.investment_desire ||
      !Array.isArray(body.investment_desire) ||
      body.investment_desire.length === 0
    ) {
      return NextResponse.json(
        { error: 'Investment desire information is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (
      !body.transfer_type ||
      !Array.isArray(body.transfer_type) ||
      body.transfer_type.length === 0
    ) {
      return NextResponse.json(
        { error: 'Transfer type information is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (
      !body.pricing ||
      !body.pricing.pricing_type ||
      typeof body.pricing.price_from !== 'number' ||
      typeof body.pricing.price_to !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Complete pricing information is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Get authenticated user from PayloadCMS context
    let user: UserType | undefined
    try {
      const authResult = await payload.auth({ headers: request.headers })
      user = authResult.user as UserType | undefined
    } catch (_error) {
      // Authentication failed
    }

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: corsHeaders },
      )
    }

    // Prepare technology data
    const technologyData: Partial<TechnologyType> = {
      title: body.title,
      category: body.category,
      trl_level: body.trl_level,
      description: body.description,
      confidential_detail: body.confidential_detail,
      submitter: user.id,
      status: body.status || 'pending',
      visibility_mode: body.visibility_mode || 'public',
    }

    // Add optional fields if provided
    if (body.documents && body.documents.length > 0) {
      technologyData.documents = body.documents
    }

    if (body.image) {
      technologyData.image = body.image
    }

    // Required fields (already validated above)
    technologyData.owners = body.owners
    technologyData.investment_desire = body.investment_desire
    technologyData.transfer_type = body.transfer_type
    technologyData.pricing = body.pricing

    // Handle legal_certification - required field, provide minimal structure if not provided
    if (body.legal_certification) {
      technologyData.legal_certification = body.legal_certification
    } else {
      // Provide minimal required structure
      technologyData.legal_certification = {
        protection_scope: [],
        standard_certifications: [],
        files: [],
      }
    }

    // Store intellectual property data for later processing
    let intellectualPropertyData: typeof body.intellectual_property | undefined
    if (body.intellectual_property && body.intellectual_property.length > 0) {
      intellectualPropertyData = body.intellectual_property
    }

    // Create the technology
    const createdTechnology = (await payload.create({
      collection: 'technologies',
      data: technologyData as any,
    })) as TechnologyType

    // Create intellectual property records if provided
    const createdIPRecords = []
    if (intellectualPropertyData && intellectualPropertyData.length > 0) {
      for (const ipItem of intellectualPropertyData) {
        try {
          if (typeof ipItem.code === 'string' && ipItem.code.trim() !== '') {
            const ipRecord = await payload.create({
              collection: 'intellectual_property',
              data: {
                technology: createdTechnology.id,
                code: ipItem.code,
                type: ipItem.type || null,
                status: ipItem.status || null,
              },
            })
            createdIPRecords.push(ipRecord)
          }
        } catch (err: unknown) {
          console.error(
            `Failed to create IP record: ${err instanceof Error ? err.message : String(err)}`,
          )
          // Continue with other IP records even if one fails
        }
      }
    }

    // Create service tickets if services are provided
    const createdServiceTickets = []
    if (body.services && body.services.length > 0) {
      for (const serviceData of body.services) {
        try {
          // Validate service data
          if (
            !serviceData.service_id ||
            !serviceData.responsible_user_id ||
            !serviceData.implementer_ids ||
            serviceData.implementer_ids.length === 0
          ) {
            console.error('Skipping service ticket due to missing required fields:', serviceData)
            continue
          }

          const serviceTicketData: Partial<ServiceTicket> = {
            service: serviceData.service_id,
            user: user.id,
            status: 'pending',
            responsible_user: serviceData.responsible_user_id,
            implementers: serviceData.implementer_ids,
            technologies: [createdTechnology.id], // Link to the created technology
            description:
              serviceData.description ||
              `Service ticket for technology: ${createdTechnology.title}`,
          }

          // Add document if provided
          if (serviceData.document_id) {
            serviceTicketData.document = serviceData.document_id
          }

          const serviceTicket = await payload.create({
            collection: 'service-ticket',
            data: serviceTicketData as any,
          })

          createdServiceTickets.push(serviceTicket)
        } catch (err: unknown) {
          console.error(
            `Failed to create service ticket: ${err instanceof Error ? err.message : String(err)}`,
          )
          // Continue with other service tickets even if one fails
        }
      }
    }

    // Create notification for the user
    try {
      await payload.create({
        collection: 'notifications',
        data: {
          user: user.id,
          title: 'Công nghệ đã được đăng ký',
          message: `Công nghệ "${createdTechnology.title}" của bạn đã được đăng ký thành công và đang chờ duyệt.`,
          type: 'technology',
          action_url: `technologies/${createdTechnology.id}`,
        },
      })
    } catch (error) {
      console.error('Failed to create notification:', error)
      // Don't fail the entire request if notification creation fails
    }

    return corsResponse({
        success: true,
        data: createdTechnology,
        doc: createdTechnology, // For compatibility with existing frontend code
        intellectual_property_records: createdIPRecords,
        service_tickets: createdServiceTickets,
        message: 'Technology created successfully',
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error('Create technology error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Validation error: ' + error.message },
          { status: 400, headers: corsHeaders },
        )
      }
      if (error.message.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Duplicate entry: ' + error.message },
          { status: 409, headers: corsHeaders },
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders },
    )
  }
}
