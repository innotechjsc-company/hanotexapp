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
import { NegotiatingMessage } from './collections/NegotiatingMessage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://34.142.238.176:3000',
    'https://hanotex.vn',
    // Add production domains here when needed
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
  ],
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
    NegotiatingMessage,
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
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
