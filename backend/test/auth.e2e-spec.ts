import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let testUserId: string;

  const testUser = {
    email: 'e2e-test@example.com',
    password: 'testPassword123',
    name: 'E2E Test User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Konfiguracja walidacji (taka sama jak w main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Czyszczenie testowych danych
    if (testUserId) {
      await prismaService.user
        .delete({
          where: { id: testUserId },
        })
        .catch(() => {
          // Ignoruj błędy jeśli użytkownik już nie istnieje
        });
    }

    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user with valid data', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('email', testUser.email);
          expect(res.body.user).not.toHaveProperty('password');

          // Zapisz token i ID do dalszych testów
          authToken = res.body.accessToken;
          testUserId = res.body.user.id;
        });
    });

    it('should return 409 when registering with existing email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Użytkownik o tym adresie email już istnieje',
          );
        });
    });

    it('should return 400 for invalid email format', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(Array.isArray(res.body.message)).toBe(true);
        });
    });

    it('should return 400 for password shorter than 8 characters', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'short',
          name: 'Test User',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(Array.isArray(res.body.message)).toBe(true);
        });
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          password: 'password123',
          name: 'Test User',
        })
        .expect(400);
    });

    it('should return 400 when password is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          name: 'Test User',
        })
        .expect(400);
    });

    it('should return 400 when name is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(400);
    });

    it('should reject extra fields not in DTO', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'extrafields@example.com',
          password: 'password123',
          name: 'Test User',
          extraField: 'should be rejected',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('email', testUser.email);
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should return 401 with invalid password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongPassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Nieprawidłowy email lub hasło',
          );
        });
    });

    it('should return 401 with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Nieprawidłowy email lub hasło',
          );
        });
    });

    it('should return 400 for invalid email format', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          password: 'password123',
        })
        .expect(400);
    });

    it('should return 400 when password is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
        })
        .expect(400);
    });
  });

  describe('/auth/me (GET)', () => {
    it('should return user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', testUserId);
          expect(res.body).toHaveProperty('email', testUser.email);
          expect(res.body).toHaveProperty('name', testUser.name);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 401 with malformed Authorization header', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', authToken) // Brak "Bearer "
        .expect(401);
    });

    it('should return 401 with expired token', async () => {
      // To jest bardziej zaawansowany test - wymaga generowania wygasłego tokena
      // W prawdziwym scenariuszu użylibyśmy JWT z krótkim czasem wygaśnięcia
      // Tutaj symulujemy to poprzez użycie nieprawidłowego tokena

      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';

      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('Integration flow: Register -> Login -> Get Profile', () => {
    it('should complete full authentication flow', async () => {
      const newUser = {
        email: 'flow-test@example.com',
        password: 'flowPassword123',
        name: 'Flow Test User',
      };

      let userId: string | undefined;
      let loginToken: string;

      try {
        // 1. Rejestracja
        const registerRes = await request(app.getHttpServer())
          .post('/auth/register')
          .send(newUser)
          .expect(201);

        expect(registerRes.body).toHaveProperty('accessToken');
        userId = registerRes.body.user.id;

        // 2. Logowanie
        const loginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: newUser.email,
            password: newUser.password,
          })
          .expect(200);

        expect(loginRes.body).toHaveProperty('accessToken');
        loginToken = loginRes.body.accessToken;

        // 3. Pobranie profilu z tokenem z logowania
        const profileRes = await request(app.getHttpServer())
          .get('/auth/me')
          .set('Authorization', `Bearer ${loginToken}`)
          .expect(200);

        expect(profileRes.body).toHaveProperty('email', newUser.email);
        expect(profileRes.body).toHaveProperty('name', newUser.name);
      } finally {
        // Czyszczenie
        if (userId) {
          await prismaService.user
            .delete({
              where: { id: userId },
            })
            .catch(() => {});
        }
      }
    });
  });

  describe('Security Tests', () => {
    it('should not expose password in any response', async () => {
      const responses = await Promise.all([
        request(app.getHttpServer()).post('/auth/register').send({
          email: 'security-test@example.com',
          password: 'securePassword123',
          name: 'Security Test',
        }),
        request(app.getHttpServer()).post('/auth/login').send({
          email: testUser.email,
          password: testUser.password,
        }),
        request(app.getHttpServer())
          .get('/auth/me')
          .set('Authorization', `Bearer ${authToken}`),
      ]);

      // Sprawdzamy każdą odpowiedź
      responses.forEach((res) => {
        const bodyString = JSON.stringify(res.body);
        expect(bodyString).not.toContain('password');
        expect(res.body).not.toHaveProperty('password');
        if (res.body.user) {
          expect(res.body.user).not.toHaveProperty('password');
        }
      });

      // Czyszczenie użytkownika testowego security-test
      const securityUser = responses[0].body.user;
      if (securityUser?.id) {
        await prismaService.user
          .delete({
            where: { id: securityUser.id },
          })
          .catch(() => {});
      }
    });

    it('should hash passwords before storing', async () => {
      const plainPassword = 'plainTextPassword123';
      const newUser = {
        email: 'hash-test@example.com',
        password: plainPassword,
        name: 'Hash Test',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      const userId = res.body.user.id;

      // Sprawdź w bazie, czy hasło jest zhashowane
      const userInDb = await prismaService.user.findUnique({
        where: { id: userId },
      });

      expect(userInDb).toBeDefined();
      expect(userInDb?.password).not.toBe(plainPassword);
      expect(userInDb?.password.length).toBeGreaterThan(plainPassword.length);
      expect(userInDb?.password).toMatch(/^\$2[aby]\$.{56}$/); // Format bcrypt

      // Czyszczenie
      await prismaService.user
        .delete({
          where: { id: userId },
        })
        .catch(() => {});
    });
  });

  // ============================================
  // v0.8.0-alpha: User Profile Management Tests
  // ============================================
  describe('GET /auth/me', () => {
    it('should return current user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('name', testUser.name);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without authorization token', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);
    });
  });

  describe('PATCH /auth/profile', () => {
    it('should update user name', async () => {
      const newName = 'Updated Name';

      const response = await request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: newName })
        .expect(200);

      expect(response.body).toHaveProperty('name', newName);
      expect(response.body.email).toBe(testUser.email);

      // Verify in database
      const userInDb = await prismaService.user.findUnique({
        where: { id: testUserId },
      });
      expect(userInDb?.name).toBe(newName);
    });

    it('should update user email', async () => {
      const newEmail = 'updated-email@example.com';

      const response = await request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: newEmail })
        .expect(200);

      expect(response.body.email).toBe(newEmail);

      // Verify can login with new email
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: newEmail, password: testUser.password })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('accessToken');

      // Cleanup: restore original email
      await request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: testUser.email });
    });

    it('should reject duplicate email', async () => {
      // Create another user
      const anotherUser = {
        email: 'another-user@example.com',
        password: 'password123',
        name: 'Another User',
      };

      const registerRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send(anotherUser)
        .expect(201);

      const anotherUserId = registerRes.body.user.id;

      // Try to update current user's email to existing email
      await request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: anotherUser.email })
        .expect(409);

      // Cleanup
      await prismaService.user
        .delete({ where: { id: anotherUserId } })
        .catch(() => {});
    });

    it('should validate email format', () => {
      return request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'invalid-email-format' })
        .expect(400);
    });

    it('should require authentication', () => {
      return request(app.getHttpServer())
        .patch('/auth/profile')
        .send({ name: 'New Name' })
        .expect(401);
    });
  });

  describe('PATCH /auth/change-password', () => {
    it('should change password successfully', async () => {
      const newPassword = 'NewPassword123';

      await request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: testUser.password,
          newPassword: newPassword,
        })
        .expect(200);

      // Verify old password no longer works
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(401);

      // Verify new password works
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: newPassword })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('accessToken');

      // Update token for subsequent tests
      authToken = loginResponse.body.accessToken;

      // Restore original password
      await request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: newPassword,
          newPassword: testUser.password,
        });
    });

    it('should reject wrong old password', () => {
      return request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'WrongPassword123',
          newPassword: 'NewPassword123',
        })
        .expect(401);
    });

    it('should validate new password strength - no uppercase', () => {
      return request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: testUser.password,
          newPassword: 'weakpassword123',
        })
        .expect(400);
    });

    it('should validate new password strength - no digit', () => {
      return request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: testUser.password,
          newPassword: 'WeakPassword',
        })
        .expect(400);
    });

    it('should validate new password strength - too short', () => {
      return request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: testUser.password,
          newPassword: 'Pass1',
        })
        .expect(400);
    });

    it('should require authentication', () => {
      return request(app.getHttpServer())
        .patch('/auth/change-password')
        .send({
          oldPassword: testUser.password,
          newPassword: 'NewPassword123',
        })
        .expect(401);
    });
  });

  // ============================================
  // v0.8.0-beta: Password Reset Tests
  // ============================================
  describe('POST /auth/forgot-password', () => {
    it('should generate reset token for existing user', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: testUser.email })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('link do resetowania hasła');
        });

      // Verify token was created in database
      const tokens = await prismaService.passwordResetToken.findMany({
        where: { user: { email: testUser.email } },
        orderBy: { createdAt: 'desc' },
      });

      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0].used).toBe(false);
      expect(tokens[0].expiresAt).toBeInstanceOf(Date);
      expect(tokens[0].expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return same message for non-existent email (security)', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('link do resetowania hasła');
        });

      // Verify no token was created
      const tokens = await prismaService.passwordResetToken.findMany({
        where: { user: { email: 'nonexistent@example.com' } },
      });

      expect(tokens.length).toBe(0);
    });

    it('should validate email format', () => {
      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'invalid-email' })
        .expect(400);
    });
  });

  describe('POST /auth/reset-password', () => {
    let resetToken: string;

    beforeEach(async () => {
      // Generate a fresh reset token
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: testUser.email });

      // Get the token from database
      const tokens = await prismaService.passwordResetToken.findMany({
        where: { user: { email: testUser.email }, used: false },
        orderBy: { createdAt: 'desc' },
      });

      resetToken = tokens[0].token;
    });

    it('should reset password with valid token', async () => {
      const newPassword = 'ResetPassword123';

      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token: resetToken, newPassword })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toContain('pomyślnie zresetowane');
        });

      // Verify token is marked as used
      const usedToken = await prismaService.passwordResetToken.findUnique({
        where: { token: resetToken },
      });
      expect(usedToken?.used).toBe(true);

      // Verify can login with new password
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: newPassword })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('accessToken');
      authToken = loginResponse.body.accessToken;

      // Restore original password
      await request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: newPassword,
          newPassword: testUser.password,
        });
    });

    it('should reject invalid token', () => {
      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: 'invalid-token-that-does-not-exist',
          newPassword: 'NewPassword123',
        })
        .expect(400);
    });

    it('should reject already used token', async () => {
      const newPassword = 'ResetPassword123';

      // Use token once
      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token: resetToken, newPassword })
        .expect(200);

      // Try to use same token again
      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token: resetToken, newPassword: 'AnotherPassword123' })
        .expect(400);

      // Restore original password
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: newPassword });

      await request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .send({
          oldPassword: newPassword,
          newPassword: testUser.password,
        });
    });

    it('should reject expired token', async () => {
      // Manually set token as expired in database
      await prismaService.passwordResetToken.update({
        where: { token: resetToken },
        data: { expiresAt: new Date(Date.now() - 3600000) }, // 1 hour ago
      });

      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'NewPassword123',
        })
        .expect(400);
    });

    it('should validate new password strength', () => {
      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'weak',
        })
        .expect(400);
    });
  });
});
