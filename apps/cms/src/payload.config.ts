// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Companies } from './collections/Companies'
import { ResearchInstitutions } from './collections/ResearchInstitutions'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Technologies } from './collections/Technologies'
import { IntellectualProperty } from './collections/IntellectualProperty'
import { Auctions } from './collections/Auctions'
import { Bids } from './collections/Bids'
import { Transactions } from './collections/Transactions'
import { Notifications } from './collections/Notifications'
import { Services } from './collections/Services'
import { ServiceTicket } from './collections/ServiceTicket'
import { TRL } from './collections/TRL'
import { Demand } from './collections/Demand'
import { InvestmentFund } from './collections/InvestmentFund'
import { Project } from './collections/Project'
import { Propose } from './collections/Propose'
import { TechnologyPropose } from './collections/TechnologyPropose'
import { News } from './collections/News'
import { Events } from './collections/Events'
import { ServiceTicketLog } from './collections/ServiceTicketLog'
import { EventUser } from './collections/EventUser'
import { EventComment } from './collections/EventComment'
import { NewsLike } from './collections/NewsLike'
import { NewsComment } from './collections/NewsComment'
import { NegotiatingMessage } from './collections/NegotiatingMessage'
import { RoomChat } from './collections/RoomChat'
import { RoomMessage } from './collections/RoomMessage'
import { RoomUser } from './collections/RoomUser'
import { Offer } from './collections/Offer'
import { Contract } from './collections/Contract'
import { ContractLogs } from './collections/ContractLogs'
import { ProjectPropose } from './collections/ProjectPropose'
import { Organizations } from './collections/Organizations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Companies,
    ResearchInstitutions,
    Media,
    Categories,
    Technologies,
    IntellectualProperty,
    Auctions,
    Bids,
    Transactions,
    Notifications,
    Services,
    ServiceTicket,
    TRL,
    Demand,
    InvestmentFund,
    Project,
    Propose,
    TechnologyPropose,
    News,
    Events,
    ServiceTicketLog,
    EventUser,
    EventComment,
    NewsLike,
    NewsComment,
    NegotiatingMessage,
    RoomChat,
    RoomMessage,
    RoomUser,
    Offer,
    Contract,
    ContractLogs,
    ProjectPropose,
    Organizations,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url:
      process.env.DATABASE_URI ||
      'mongodb+srv://office:ZtXXocAefgiuvUcP@chainivodev.rpy80md.mongodb.net/hanotex-test',
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
