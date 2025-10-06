import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { QueryReportDto } from './dto/query-report.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /reports/summary
   * Get income vs expenses summary for a period
   */
  @Get('summary')
  async getSummary(
    @CurrentUser('id') userId: string,
    @Query() query: QueryReportDto,
  ) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    return this.reportsService.getSummary(userId, startDate, endDate);
  }

  /**
   * GET /reports/by-category
   * Get breakdown by category (with optional type filter)
   */
  @Get('by-category')
  async getByCategoryReport(
    @CurrentUser('id') userId: string,
    @Query() query: QueryReportDto,
  ) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    return this.reportsService.getByCategoryReport(
      userId,
      startDate,
      endDate,
      query.type,
    );
  }
}
