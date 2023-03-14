'use strict';
const fileSystem = require('../../file_system');
const uuid = require('uuid');
const request = require('supertest');

process.env.npm_lifecycle_event = 'file_system';
const app = require('../../app');

jest.mock('../../file_system');
jest.mock('uuid');

afterAll(() => app.close())
describe('app', () => {
  describe('GET /api/todos', () => {
    describe('Without completed', () => {
      test('Return ToDo from fetchAll()', async () => {
        const todos = [
          {id: 'a', title: 'Name', completed: false},
          {id: 'b', title: 'Draft', completed: true}
        ];
        fileSystem.fetchAll.mockResolvedValue(todos);

        const res = await request(app).get('/api/todos');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(todos);
     })
      test('Return error if fetchAll() failed', async () => {
        fileSystem.fetchAll.mockRejectedValue(new Error('fetchAll() failed'));
        const res = await request(app).get('/api/todos');

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({error: 'fetchAll() failed'});
     })
   })
    describe('With completed', () => {
      test('Return ToDo from fetchByCompleted() with completed', async () => {
        const todos = [
          {id: 'a', title: 'Name', completed: false},
          {id: 'b', title: 'Draft', completed: true}
        ];
        fileSystem.fetchByCompleted.mockResolvedValue(todos);

        for (const completed of [true, false]) {
          const res = await request(app)
            .get('/api/todos')
            .query({completed});

          expect(res.statusCode).toBe(200);
          expect(res.body).toEqual(todos);
          expect(fileSystem.fetchByCompleted)
            .toHaveBeenCalledWith(completed);
       }}
      )
      test('Return error if fetchByCompleted() failed', async () => {
        fileSystem.fetchByCompleted
          .mockRejectedValue(new Error('fetchByCompleted() failed'));

        const res = await request(app)
          .get('/api/todos')
          .query({completed: true});

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({error: 'fetchByCompleted() failed'});
     })
   })
 })

  describe('POST /api/todos', () => {
    test('Execute create() with title param, and then return response', async () => {
      uuid.v4.mockReturnValue('a');
      fileSystem.create.mockResolvedValue();

      const res = await request(app)
        .post('/api/todos')
        .send({title: 'Name'});

      const expectedTodo = {id: 'a', title: 'Name', completed: false};
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(expectedTodo);
      expect(fileSystem.create).toHaveBeenCalledWith(expectedTodo);
   })

    test('Return 400 error without param in title', async () => {
      for (const title of ['', undefined]) {
        const res = await request(app)
          .post('/api/todos')
          .send({title});

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({error: 'title is required'});
        expect(fileSystem.create).not.toHaveBeenCalled();
     }
   })

    test('Return error if create() failed', async () => {
      fileSystem.create.mockRejectedValue(new Error('create() failed'));

      const res = await request(app)
        .post('/api/todos')
        .send({title: 'Name'});

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({error: 'create() failed'});
   })

 })

  describe('PUT /api/todos/:id/completed', () => {
    it(
      'Set completed of the ToDo of the ID specified by the path to true and return the updated ToDo',
      async () => {
        const todo = {id: 'a', title: 'Name', completed: true};
        fileSystem.update.mockResolvedValue(todo);

        const res = await request(app).put('/api/todos/a/completed');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(todo);
        expect(fileSystem.update)
          .toHaveBeenCalledWith('a', {completed: true});
     }
    )

    it('Return 404 error if update() returns null', async () => {
      fileSystem.update.mockResolvedValue(null);

      const res = await request(app).put('/api/todos/a/completed');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({error: 'ToDo not found'});
   })

    it('Return error if update() failed', async () => {
      fileSystem.update.mockRejectedValue(new Error('update() failed'));
      const res = await request(app).put('/api/todos/a/completed');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({error: 'update() failed'});
   })

 })
  describe('DELETE /api/todos/:id/completed', () => {
    it(
      'Set completed of the ToDo of the ID specified by the path to true and return the updated ToDo',
      async () => {
        const todo = {id: 'a', title: 'Name', completed: false}
        fileSystem.update.mockResolvedValue(todo);

        const res = await request(app).delete('/api/todos/a/completed');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(todo);

        expect(fileSystem.update)
          .toHaveBeenCalledWith('a', {completed: false});
     }
    )

    it('Return 404 error if update() failed', async () => {
      fileSystem.update.mockResolvedValue(null);

      const res = await request(app).delete('/api/todos/a/completed');

      // レスポンスのアサーション
      expect(res.status).toBe(404)
      expect(res.body).toEqual({error: 'ToDo not found'})
   })
    it('Return error if update() failed', async () => {
      // モックが返す値の指定
      fileSystem.update.mockRejectedValue(new Error('update() failed'))

      // リクエストの送信
      const res = await request(app).delete('/api/todos/a/completed')

      // レスポンスのアサーション
      expect(res.status).toBe(500)
      expect(res.body).toEqual({error: 'update() failed'})
   })
 })
  describe('DELETE /api/todos/:id', () => {
    it('Delete the ToDo of the ID specified by the path', async () => {
      fileSystem.remove.mockResolvedValue('a');

      const res = await request(app).delete('/api/todos/a');

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
      expect(fileSystem.remove).toHaveBeenCalledWith('a');
   })

    it('Return 404 error if remove() returns null', async () => {
      fileSystem.remove.mockResolvedValue(null);

      const res = await request(app).delete('/api/todos/a');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({error: 'ToDo not found'});
   })

    it('Return error if remove() failed', async () => {
      fileSystem.remove.mockRejectedValue(new Error('remove() failed'));

      const res = await request(app).delete('/api/todos/a');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({error: 'remove() failed'});
   })
 })
})