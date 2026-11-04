import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Initialize the Neon adapter using the DATABASE_URL from your .env
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
    });
    
    // Pass the adapter to the Prisma Client
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Connected to Neon PostgreSQL Database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}