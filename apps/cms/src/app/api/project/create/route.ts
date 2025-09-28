import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Project as ProjectType, ServiceTicket as ServiceTicketType } from '@/payload-types'

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
    const body = await request.json()

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
    if (business_model) projectData.business_model = business_model
    if (market_data) projectData.market_data = market_data
    if (investment_fund) projectData.investment_fund = investment_fund
    if (revenue) projectData.revenue = revenue
    if (profit) projectData.profit = profit
    if (assets) projectData.assets = assets
    if (documents_finance) projectData.documents_finance = documents_finance
    if (team_profile) projectData.team_profile = team_profile
    if (goal_money) projectData.goal_money = goal_money
    if (share_percentage) projectData.share_percentage = share_percentage
    if (goal_money_purpose) projectData.goal_money_purpose = goal_money_purpose

    const createdProject = (await payload.create({
      collection: 'project',
      data: projectData,
    })) as ProjectType

    const createdServiceTickets: ServiceTicketType[] = []
    const serviceTicketErrors: string[] = []

    // Create service tickets if services are provided
    if (services && Array.isArray(services) && services.length > 0) {
      for (const serviceRequest of services) {
        try {
          const {
            service_id,
            description: service_description,
            responsible_user,
            implementers,
            document,
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

          if (!responsible_user) {
            serviceTicketErrors.push(`Responsible user is required for service ${service_id}`)
            continue
          }

          if (!implementers || !Array.isArray(implementers) || implementers.length === 0) {
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
              id: responsible_user,
            })
          } catch (error) {
            serviceTicketErrors.push(`Responsible user with ID ${responsible_user} not found`)
            continue
          }

          // Validate implementers exist
          for (const implementerId of implementers) {
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
            responsible_user,
            implementers,
            status: 'pending', // Default status
          }

          if (document) {
            serviceTicketData.document = document
          }

          const createdServiceTicket = (await payload.create({
            collection: 'service-ticket',
            data: serviceTicketData,
          })) as ServiceTicketType

          createdServiceTickets.push(createdServiceTicket)
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
