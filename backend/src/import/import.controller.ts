import {
  Controller,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImportService } from './import.service';
import { ImportResultDto } from './dto/import-result.dto';

@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('transactions')
  @UseInterceptors(FileInterceptor('file'))
  async importTransactions(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: { user: { id: string } },
  ): Promise<ImportResultDto> {
    // Validate CSV file extension
    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new Error('Only CSV files are allowed');
    }

    const userId: string = req.user.id;
    return this.importService.parseAndImportTransactions(file, userId);
  }
}
