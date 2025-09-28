import {  NextRequest, NextResponse  } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Project as ProjectType, ServiceTicket as ServiceTicketType } from '@/payload-types'

interface ProjectCreatePayload {
  name: string
  description: string
  business_model?: string
  market_data?: string
  user: string
  technologies: string[]
  investment_fund?: string[] // Array since hasMany: true
  revenue?: number
  profit?: number
  assets?: number
  documents_finance?: string[]
  team_profile?: string
  goal_money?: number
  share_percentage?: number
  goal_money_purpose?: string
  open_investment_fund?: boolean
  end_date: string
  image?: string // Project image
  // Service ticket creation
  services?: Array<{
    service_id: string
    description: string
    responsible_user_id: string
    implementer_ids: string[]
    document_id?: string
  }>
}

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
    const body = (await request.json()) as ProjectCreatePayload

    const {
      name,
      description,
      business_model,
      market_data,
      user,
      technologies,
      investment_fund,
      revenue,
      profit,
      assets,
      documents_finance,
      team_profile,
      goal_money,
      share_percentage,
      goal_money_purpose,
      open_investment_fund,
      end_date,
      image,
      services, // Array of service objects with service info and ticket details
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (!description) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (!user) {
      return NextResponse.json({ error: 'User is required' }, { status: 400, headers: corsHeaders })
    }

    if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
      return NextResponse.json(
        { error: 'At least one technology is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (!end_date) {
      return NextResponse.json(
        { error: 'End date is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Validate user exists
    try {
      await payload.findByID({
        collection: 'users',
        id: user,
      })
    } catch (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
    }

    // Validate technologies exist
    for (const techId of technologies) {
      try {
        await payload.findByID({
          collection: 'technologies',
          id: techId,
        })
      } catch (error) {
        return NextResponse.json(
          { error: `Technology with ID ${techId} not found` },
          { status: 404, headers: corsHeaders },
        )
      }
    }

    // Validate investment funds exist if provided
    if (investment_fund && Array.isArray(investment_fund)) {
      for (const fundId of investment_fund) {
        try {
          await payload.findByID({
            collection: 'investment-fund',
            id: fundId,
          })
        } catch (error) {
          return NextResponse.json(
            { error: `Investment fund with ID ${fundId} not found` },
            { status: 404, headers: corsHeaders },
          )
        }
      }
    }

    // Validate end_date is in the future
    if (new Date(end_date) <= new Date()) {
      return NextResponse.json(
        { error: 'End date must be in the future' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Validate financial fields are not negative
    if (revenue !== undefined && revenue < 0) {
      return NextResponse.json(
        { error: 'Revenue cannot be negative' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (assets !== undefined && assets < 0) {
      return NextResponse.json(
        { error: 'Assets cannot be negative' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (goal_money !== undefined && goal_money <= 0) {
      return NextResponse.json(
        { error: 'Goal money must be greater than 0' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (share_percentage !== undefined && (share_percentage < 0 || share_percentage > 100)) {
      return NextResponse.json(
        { error: 'Share percentage must be between 0 and 100' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Create the project
    const projectData: any = {
      name,
      description,
      user,
      technologies,
      end_date,
      status: 'pending', // Default status
      open_investment_fund: open_investment_fund || false,
    }

    // Add optional fields if provided
    if (image) projectData.image = image
    if (business_model) projectData.business_model = business_model
    if (market_data) projectData.market_data = market_data
    if (investment_fund && Array.isArray(investment_fund) && investment_fund.length > 0) {
      projectData.investment_fund = investment_fund
    }
    if (revenue !== undefined) projectData.revenue = revenue
    if (profit !== undefined) projectData.profit = profit
    if (assets !== undefined) projectData.assets = assets
    if (documents_finance && Array.isArray(documents_finance) && documents_finance.length > 0) {
      projectData.documents_finance = documents_finance
    }
    if (team_profile) projectData.team_profile = team_profile
    if (goal_money !== undefined) projectData.goal_money = goal_money
    if (share_percentage !== undefined) projectData.share_percentage = share_percentage
    if (goal_money_purpose) projectData.goal_money_purpose = goal_money_purpose

    const createdProject = (await payload.create({
      collection: 'project',
      data: projectData,
    })) as ProjectType

    // Create notification for successful project creation
    try {
      await payload.create({
        collection: 'notifications',
        data: {
          user: user,
          title: 'Dự án đã được tạo',
          message: `Dự án "${name}" của bạn đã được tạo thành công và đang chờ duyệt.`,
          type: 'info',
          priority: 'normal',
          is_read: false,
          action_url: `projects/${createdProject.id}`,
        },
      })
    } catch (error) {
      console.error('Failed to create notification:', error)
      // Don't fail the whole operation if notification creation fails
    }

    const createdServiceTickets: ServiceTicketType[] = []
    const serviceTicketErrors: string[] = []

    // Create service tickets if services are provided
    if (services && Array.isArray(services) && services.length > 0) {
      for (const serviceRequest of services) {
        try {
          const {
            service_id,
            description: service_description,
            responsible_user_id,
            implementer_ids,
            document_id,
          } = serviceRequest

          // Validate required service ticket fields
          if (!service_id) {
            serviceTicketErrors.push('Service ID is required for service tickets')
            continue
          }

          if (!service_description) {
            serviceTicketErrors.push(`Description is required for service ${service_id}`)
            continue
          }

          if (!responsible_user_id) {
            serviceTicketErrors.push(`Responsible user is required for service ${service_id}`)
            continue
          }

          if (!implementer_ids || !Array.isArray(implementer_ids) || implementer_ids.length === 0) {
            serviceTicketErrors.push(
              `At least one implementer is required for service ${service_id}`,
            )
            continue
          }

          // Validate service exists
          try {
            await payload.findByID({
              collection: 'services',
              id: service_id,
            })
          } catch (error) {
            serviceTicketErrors.push(`Service with ID ${service_id} not found`)
            continue
          }

          // Validate responsible user exists
          try {
            await payload.findByID({
              collection: 'users',
              id: responsible_user_id,
            })
          } catch (error) {
            serviceTicketErrors.push(`Responsible user with ID ${responsible_user_id} not found`)
            continue
          }

          // Validate implementers exist
          for (const implementerId of implementer_ids) {
            try {
              await payload.findByID({
                collection: 'users',
                id: implementerId,
              })
            } catch (error) {
              serviceTicketErrors.push(`Implementer with ID ${implementerId} not found`)
              continue
            }
          }

          // Create service ticket
          const serviceTicketData: any = {
            service: service_id,
            user,
            project: createdProject.id,
            description: service_description,
            responsible_user: responsible_user_id,
            implementers: implementer_ids,
            status: 'pending', // Default status
          }

          if (document_id) {
            serviceTicketData.document = document_id
          }

          const createdServiceTicket = (await payload.create({
            collection: 'service-ticket',
            data: serviceTicketData,
          })) as ServiceTicketType

          createdServiceTickets.push(createdServiceTicket)

          // Create notification for service ticket creation (to responsible user)
          try {
            await payload.create({
              collection: 'notifications',
              data: {
                user: responsible_user_id,
                title: 'Yêu cầu dịch vụ mới',
                message: `Bạn đã được chỉ định làm người chịu trách nhiệm cho một yêu cầu dịch vụ mới trong dự án "${name}".`,
                type: 'info',
                priority: 'high',
                is_read: false,
                action_url: `service-tickets/${createdServiceTicket.id}`,
              },
            })
          } catch (error) {
            console.error('Failed to create notification for responsible user:', error)
          }

          // Create notifications for implementers
          for (const implementerId of implementer_ids) {
            try {
              await payload.create({
                collection: 'notifications',
                data: {
                  user: implementerId,
                  title: 'Yêu cầu dịch vụ mới',
                  message: `Bạn đã được chỉ định làm người thực hiện cho một yêu cầu dịch vụ mới trong dự án "${name}".`,
                  type: 'info',
                  priority: 'normal',
                  is_read: false,
                  action_url: `service-tickets/${createdServiceTicket.id}`,
                },
              })
            } catch (error) {
              console.error(
                `Failed to create notification for implementer ${implementerId}:`,
                error,
              )
            }
          }
        } catch (error) {
          console.error(
            `Error creating service ticket for service ${serviceRequest.service_id}:`,
            error,
          )
          serviceTicketErrors.push(
            `Failed to create service ticket for service ${serviceRequest.service_id}`,
          )
        }
      }
    }

    // Prepare response
    const response: any = {
      success: true,
      project: createdProject,
      message: 'Project created successfully',
    }

    if (createdServiceTickets.length > 0) {
      response.service_tickets = createdServiceTickets
      response.service_tickets_count = createdServiceTickets.length
    }

    if (serviceTicketErrors.length > 0) {
      response.service_ticket_errors = serviceTicketErrors
      response.message =
        'Project created successfully, but some service tickets could not be created'
    }

    return NextResponse.json(response, { headers: corsHeaders })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders },
    )
  }
}
