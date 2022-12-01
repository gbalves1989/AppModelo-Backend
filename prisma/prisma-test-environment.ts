import { Config } from '@jest/types'
import { exec } from 'child_process'
import dotenv from 'dotenv'
import NodeEnvironment from 'jest-environment-node'
import { Client } from 'pg'
import util from 'util'
import crypto from 'crypto'

dotenv.config({ path: '.env' })

const execSync = util.promisify(exec)

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string
  private connectionString: string

  constructor(config: Config.ProjectConfig) {
    super(config)

    const dbUser = process.env.DATABASE_USER_TEST
    const dbPass = process.env.DATABASE_PASS_TEST
    const dbHost = process.env.DATABASE_HOST_TEST
    const dbPort = process.env.DATABASE_PORT_TEST
    const dbName = process.env.DATABASE_NAME_TEST

    this.schema = `test_${crypto.randomUUID()}`
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    await execSync(`prisma migrate deploy`)
    return super.setup()
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    })

    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()
  }
}
