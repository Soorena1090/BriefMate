import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service.js';

@Controller()
export class AppController {
  constructor(private readonly databaseService: DatabaseService
  ) {}


  @Get('database-check')
  checkDatabase() {
    return this.databaseService.checkDatabase();
  }


  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'briefpilot-api',
    };
  }

  @Get('health/db')
  async getDatabaseHealth() {
    const result = await this.databaseService.checkConnection();

    return {
      status: 'ok',
      database: 'connected',
      // checkedAt: result.now(),
    };
  }
}
