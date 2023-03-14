'use strict';
const chai = require('chai');
const sinon = require('sinon');
const fileSystem = require('../../file_system');

process.env.npm_lifecycle_event = 'file_system';
const app = require('../../app');

const assert = chai.assert;
sinon.assert.expose(assert, { prefix: '' });

chai.use(require('chai-http'));
afterEach(() => sinon.restore());

describe('app', () => {
  describe('GET /api/todos', () => {
    describe('Without completed', () => {
      it('Return ToDo from fetchAll()', async () => {
        const todos = [
          { id: 'a', title: 'Name', completed: false },
          { id: 'b', title: 'Draft', completed: true }
        ];

        sinon.stub(fileSystem, 'fetchAll').resolves(todos);
        const res = await chai.request(app).get('/api/todos');
        
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, todos);
      })

      it('Return error if fetchAll() failed', async () => {
        sinon
          .stub(fileSystem, 'fetchAll')
          .rejects(new Error('fetchAll() failed'));
        
        const res = await chai.request(app).get('/api/todos');

        assert.strictEqual(res.status, 500);
        assert.deepEqual(res.body, { error: 'fetchAll() failed' });
      })
    })

    describe('With completed', () => { 
      it('Return ToDo from fetchByCompleted() with completed', async () => {
        const todos = [
          { id: 'a', title: 'Name', completed: false },
          { id: 'b', title: 'Draft', completed: true }
        ];
      
        sinon
          .stub(fileSystem, 'fetchByCompleted')
          .resolves(todos);
        
        for (const completed of [true, false]) {
          const res = await chai.request(app)
            .get('/api/todos')
            .query({ completed });
      
          assert.strictEqual(res.status, 200);
          assert.deepEqual(res.body, todos);
          assert.calledWith(fileSystem.fetchByCompleted, completed);
        }
      })

      it('Return error if fetchByCompleted() failed', async () => {
        sinon
          .stub(fileSystem, 'fetchByCompleted')
          .rejects(new Error('fetchByCompleted() failed'));
        const res = await chai
          .request(app)
          .get('/api/todos')
          .query({ completed: true });
      
        assert.strictEqual(res.status, 500);
        assert.deepEqual(res.body, { error: 'fetchByCompleted() failed' });
      }) 
    })
  })

  describe('POST /api/todos', () => {
    it('Execute create() with title param, and then return response', async () => {
      sinon.stub(fileSystem, 'create').resolves()
      const res = await chai
        .request(app)
        .post('/api/todos')
        .send({ title: 'Name' });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.title, 'Name');
      assert.strictEqual(res.body.completed, false);  
      assert.calledWith(fileSystem.create, res.body);
    })
    
    it('Return 400 error without param in title', async () => {
      sinon.spy(fileSystem, 'create');
      for (const title of ['', undefined]) { 
        const res = await chai
          .request(app)
          .post('/api/todos')
          .send({ title });
    
        assert.strictEqual(res.status, 400);
        assert.deepEqual(res.body, { error: 'title is required' });
        assert.notCalled(fileSystem.create);
      }
    })
    
    it('Return error if create() failed', async () => {
      sinon.stub(fileSystem, 'create').rejects(new Error('create() failed'));
      const res = await chai
        .request(app)
        .post('/api/todos')
        .send({ title: 'Name' });
      assert.strictEqual(res.status, 500);
      assert.deepEqual(res.body, {error: 'create() failed'});
    })

  })
})

