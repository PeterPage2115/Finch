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
      await prismaService.user.delete({
        where: { id: testUserId },
      }).catch(() => {
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
          expect(res.body).toHaveProperty('message', 'Użytkownik o tym adresie email już istnieje');
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
          expect(res.body).toHaveProperty('message', 'Nieprawidłowy email lub hasło');
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
          expect(res.body).toHaveProperty('message', 'Nieprawidłowy email lub hasło');
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
      return request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
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
      
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
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
          await prismaService.user.delete({
            where: { id: userId },
          }).catch(() => {});
        }
      }
    });
  });

  describe('Security Tests', () => {
    it('should not expose password in any response', async () => {
      const responses = await Promise.all([
        request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'security-test@example.com',
            password: 'securePassword123',
            name: 'Security Test',
          }),
        request(app.getHttpServer())
          .post('/auth/login')
          .send({
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
        await prismaService.user.delete({
          where: { id: securityUser.id },
        }).catch(() => {});
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
      await prismaService.user.delete({
        where: { id: userId },
      }).catch(() => {});
    });
  });
});
