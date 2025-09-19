// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Allow web app at localhost:3000 to access the CMS API
  cors: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  // Allow CSRF for cookie-based auth from the web app
  csrf: ['http://localhost:3000', 'http://127.0.0.1:3000'],
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
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
