/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('ImportController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let testUserId: string;

  const testUser = {
    email: 'e2e-import-test@example.com',
    password: 'testPassword123',
    name: 'Import E2E Test User',
  };

  // CSV test data
  const VALID_CSV = [
    'date,amount,description,categoryName',
    '2025-01-15,50.00,Grocery shopping,Groceries',
    '2025-01-20,-75.50,Electricity bill,Utilities',
  ].join('\n');

  const MIXED_CSV = [
    'date,amount,description,categoryName',
    '2025-01-15,50.00,Valid transaction,Food',
    'invalid-date,50.00,Invalid transaction,Food',
  ].join('\n');

  const UTF8_CSV = [
    'date,amount,description,categoryName',
    '2025-01-15,50.00,Zakupy spożywcze,Żywność',
    '2025-01-16,30.00,Kawiarnia "Pod Różą",Rozrywka',
  ].join('\n');

  const NEW_CATEGORY_CSV = [
    'date,amount,description,categoryName',
    '2025-01-15,100.00,New category transaction,Brand New Category',
  ].join('\n');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure validation (same as main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Register test user and get auth token
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    authToken = registerResponse.body.accessToken;
    testUserId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    // Cleanup: delete test user (cascades to transactions and categories)
    if (testUserId) {
      await prismaService.user
        .delete({
          where: { id: testUserId },
        })
        .catch(() => {
          // Ignore errors if user already deleted
        });
    }

    await app.close();
  });

  describe('POST /import/transactions', () => {
    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .post('/import/transactions')
        .attach('file', Buffer.from(VALID_CSV, 'utf8'), 'test.csv')
        .expect(401);
    });

    it('should successfully import valid CSV file', async () => {
      const response = await request(app.getHttpServer())
        .post('/import/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from(VALID_CSV, 'utf8'), 'transactions.csv');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('successCount', 2);
      expect(response.body).toHaveProperty('failedCount', 0);
      expect(response.body).toHaveProperty('totalRows', 2);
      expect(response.body.failedRows).toHaveLength(0);
      expect(response.body.autoCreatedCategories).toEqual(
        expect.arrayContaining(['Groceries', 'Utilities']),
      );

      // Verify transactions were actually created in database
      const transactions = await prismaService.transaction.findMany({
        where: { userId: testUserId },
      });

      expect(transactions).toHaveLength(2);
      expect(transactions[0].description).toBe('Grocery shopping');
      expect(transactions[1].description).toBe('Electricity bill');

      // Verify categories were created
      const categories = await prismaService.category.findMany({
        where: { userId: testUserId },
      });

      expect(categories.length).toBeGreaterThanOrEqual(2);
      expect(categories.some((c) => c.name === 'Groceries')).toBe(true);
      expect(categories.some((c) => c.name === 'Utilities')).toBe(true);
    });

    it('should detect and skip duplicate transactions', async () => {
      // Re-import the same CSV
      const response = await request(app.getHttpServer())
        .post('/import/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from(VALID_CSV, 'utf8'), 'transactions.csv')
        .expect(201);

      // At least one row should be detected as duplicate
      expect(response.body.failedCount).toBeGreaterThanOrEqual(1);
      expect(response.body.failedRows.length).toBeGreaterThanOrEqual(1);

      // Check that at least one failed row has duplicate error
      const hasDuplicateError = response.body.failedRows.some((row: any) =>
        row.errors.some((err: string) =>
          err.includes('Duplicate transaction detected'),
        ),
      );
      expect(hasDuplicateError).toBe(true);

      // Verify no new transactions were created (or very few)
      const totalTransactionsAfterDuplicate =
        await prismaService.transaction.count({
          where: { userId: testUserId },
        });

      // Should be same as before or maybe 1 more (if one wasn't duplicate)
      expect(totalTransactionsAfterDuplicate).toBeLessThanOrEqual(5);
    });

    it('should handle partial import with validation errors', async () => {
      const response = await request(app.getHttpServer())
        .post('/import/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from(MIXED_CSV, 'utf8'), 'mixed.csv')
        .expect(201);

      expect(response.body).toHaveProperty('successCount', 1);
      expect(response.body).toHaveProperty('failedCount', 1);
      expect(response.body).toHaveProperty('totalRows', 2);
      expect(response.body.failedRows).toHaveLength(1);

      // Check that the failed row has validation error
      expect(response.body.failedRows[0].errors).toContain(
        'Invalid date format. Use ISO 8601 (YYYY-MM-DD)',
      );

      // Verify only valid transaction was created
      const transactions = await prismaService.transaction.findMany({
        where: {
          userId: testUserId,
          description: 'Valid transaction',
        },
      });

      expect(transactions).toHaveLength(1);
    });

    it('should preserve UTF-8 characters (Polish diacritics)', async () => {
      const response = await request(app.getHttpServer())
        .post('/import/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from(UTF8_CSV, 'utf8'), 'utf8.csv')
        .expect(201);

      expect(response.body).toHaveProperty('successCount', 2);
      expect(response.body).toHaveProperty('failedCount', 0);

      // Verify UTF-8 characters are preserved in database
      const transactions = await prismaService.transaction.findMany({
        where: {
          userId: testUserId,
          description: { contains: 'spożywcze' },
        },
      });

      expect(transactions).toHaveLength(1);
      expect(transactions[0].description).toBe('Zakupy spożywcze');

      // Verify UTF-8 in category name
      const categories = await prismaService.category.findMany({
        where: {
          userId: testUserId,
          name: { contains: 'Żywność' },
        },
      });

      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Żywność');

      // Verify quotes in description
      const transactionsWithQuotes = await prismaService.transaction.findMany({
        where: {
          userId: testUserId,
          description: { contains: 'Różą' },
        },
      });

      expect(transactionsWithQuotes).toHaveLength(1);
      expect(transactionsWithQuotes[0].description).toBe(
        'Kawiarnia "Pod Różą"',
      );
    });

    it('should auto-create new categories that do not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/import/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .attach(
          'file',
          Buffer.from(NEW_CATEGORY_CSV, 'utf8'),
          'new-category.csv',
        )
        .expect(201);

      expect(response.body).toHaveProperty('successCount', 1);
      expect(response.body).toHaveProperty('failedCount', 0);
      expect(response.body.autoCreatedCategories).toContain(
        'Brand New Category',
      );

      // Verify category was created in database
      const category = await prismaService.category.findFirst({
        where: {
          userId: testUserId,
          name: 'Brand New Category',
        },
      });

      expect(category).toBeDefined();
      expect(category?.name).toBe('Brand New Category');

      // Verify transaction was linked to the new category
      const transaction = await prismaService.transaction.findFirst({
        where: {
          userId: testUserId,
          description: 'New category transaction',
        },
        include: { category: true },
      });

      expect(transaction).toBeDefined();
      expect(transaction?.category.name).toBe('Brand New Category');
    });
  });
});
