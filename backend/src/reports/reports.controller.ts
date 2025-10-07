import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
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

  /**
   * GET /reports/category-trend
   * Get time-series data for category spending (for charts)
   */
  @Get('category-trend')
  async getCategoryTrend(
    @CurrentUser('id') userId: string,
    @Query() query: QueryReportDto,
  ) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    return this.reportsService.getCategoryTrend(
      userId,
      startDate,
      endDate,
      query.categoryId,
      query.granularity || 'daily',
    );
  }

  /**
   * GET /reports/category/:categoryId/details
   * Get detailed information about a specific category
   */
  @Get('category/:categoryId/details')
  async getCategoryDetails(
    @CurrentUser('id') userId: string,
    @Param('categoryId') categoryId: string,
    @Query() query: QueryReportDto,
  ) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    return this.reportsService.getCategoryDetails(
      userId,
      categoryId,
      startDate,
      endDate,
    );
  }

  /**
   * GET /reports/trends-comparison
   * Compare current period with previous period of the same length
   */
  @Get('trends-comparison')
  async getTrendsComparison(
    @CurrentUser('id') userId: string,
    @Query() query: QueryReportDto,
  ) {
    const currentStart = new Date(query.startDate);
    const currentEnd = new Date(query.endDate);

    return this.reportsService.getTrendsComparison(
      userId,
      currentStart,
      currentEnd,
    );
  }

  /**
   * GET /reports/monthly-trend
   * Get monthly income/expense trends for last N months
   */
  @Get('monthly-trend')
  async getMonthlyTrend(
    @CurrentUser('id') userId: string,
    @Query('months') months?: string,
  ) {
    const monthsCount = months ? parseInt(months, 10) : 6;
    return this.reportsService.getMonthlyTrend(userId, monthsCount);
  }
}
