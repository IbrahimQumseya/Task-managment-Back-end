import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TaskStatus } from './../src/tasks/task-status.enum';
import { UserRole } from './../src/auth/enum/user-role.enum';
const mockTask = {
  id: 'b2ec34ea-9de8-4b5c-a7b2-d1402da9c0f7',
  title: 'randooom',
  description: 'randdom 123',
  status: 'OPEN',
  user: {
    id: '714a7c95-2862-4fe6-a440-59445c276b72',
    username: 'user12',
    firstName: 'asd2asd',
    lastName: '1235123',
    email: 'ibrag@gmail.com',
    isDeactivated: false,
    role: 'USER',
  },
  taskMetadata: {
    id: 'd61b44f7-72d8-4d81-8dec-e9012dda99b5',
    details: 'hello there213',
    isDeactivated: true,
  },
};
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    await Promise.all([app.close()]);
  });
  describe('TasksController', () => {
    it('/ (GET) tasks', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: 'user12', password: 'hanna121212!S' })
        .expect(201);
      jwtToken = loginResponse.body.accessToken;
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
      const data = response.body;
      const task = data.find(
        (e) => e.id === 'b2ec34ea-9de8-4b5c-a7b2-d1402da9c0f7',
      );
      expect(task).toMatchObject(mockTask);
    });
    it('/ (GET) skip bring tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks/5/5')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
    // it('/ (GET) task details by ID', async () => {
    //   const response = await request(app.getHttpServer())
    //     .get(`/tasks/${mockTask.user.id}/details`)
    //     // .get(`/tasks/ef284854-d4a3-4346-83fe-16469ee6b359/details`)
    //     .set('Authorization', `Bearer ${jwtToken}`)
    //     .expect(200);
    // });
    it('/ (GET) getTaskById', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks/${mockTask.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
      const { description, id, status, title } = mockTask;
      expect(response.body).toMatchObject({ description, id, status, title });
    });
    // it('/ (delete) deleteTaskById', async () => {
    //   const response = await request(app.getHttpServer())
    //     .delete(`/tasks/${mockTask.id}`)
    //     .set('Authorization', `Bearer ${jwtToken}`)
    //     .expect(200);
    // });
    it('/ (Post) createTask', async () => {
      const response = await request(app.getHttpServer())
        .post(`/tasks`)
        .send({ title: 'test', description: 'test' })
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(201);
    });
    it('/ (Patch) UpdateTask Status', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/tasks/${mockTask.id}/status`)
        .send({ status: TaskStatus.DONE })
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
      const { description, id, title } = mockTask;
      expect(response.body).toMatchObject({
        description,
        id,
        status: 'DONE',
        title,
      });
      await request(app.getHttpServer())
        .patch(`/tasks/${mockTask.id}/status`)
        .send({ status: TaskStatus.OPEN })
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });
});
