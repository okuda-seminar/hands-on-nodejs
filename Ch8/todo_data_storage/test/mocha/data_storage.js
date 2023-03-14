'use strict';
const { assert } = require('chai');

for (const dataStorageName of ['file_system', 'sqlite']) {
  const { fetchAll, fetchByCompleted, create, update, remove } = require(`../../${dataStorageName}`);
  describe(dataStorageName, () => {
    beforeEach(async () => {
      const allTodos = await fetchAll();
      await Promise.all(allTodos.map(({ id }) => remove(id)));
    })

    describe('create()、fetchAll()', () => {
      it('Able to get ToDo made by create() with fetchAll()', async() => {
        assert.deepEqual(await fetchAll(), []);

        const todo1 = { id: 'a', title: 'Name', completed: false };
        await create(todo1);

        assert.deepEqual(await fetchAll(), [todo1]);

        const todo2 = { id: 'b', title: 'Draft', completed: true };
        await create(todo2);
        const todo3 = { id: 'c', title: 'Filling', completed: false };
        await create(todo3);

        assert.sameDeepMembers(await fetchAll(), [todo1, todo2, todo3]);
      })
    })

    describe('fetchByCompleted()', () => {
      it('Able to get ToDos whose completed values are same with the specified one', async() => {
        assert.deepEqual(await fetchByCompleted(true), []);
        assert.deepEqual(await fetchByCompleted(false), []);

        const todo1 = { id: 'a', title: 'Name', completed: false };
        await create(todo1);

        assert.deepEqual(await fetchAll(), [todo1]);

        const todo2 = { id: 'b', title: 'Draft', completed: true };
        await create(todo2);
        const todo3 = { id: 'c', title: 'Filling', completed: false };
        await create(todo3);

        assert.deepEqual(await fetchByCompleted(true), [todo2]);
        assert.sameDeepMembers(await fetchByCompleted(false), [todo1, todo3]);
      })
    })

    describe('update()', () => {
      const todo1 = { id: 'a', title: 'Name', completed: false };
      const todo2 = { id: 'b', title: 'Draft', completed: false };
      beforeEach(async () => {
        await create(todo1);
        await create(todo2);
      })

      it('Able to update', async () => {
        assert.deepEqual(await update('a', { completed: true }), { id: 'a', title: 'Name', completed: true });
        assert.deepEqual(await fetchByCompleted(true), [{ id: 'a', title: 'Name', completed: true }]);
        assert.deepEqual(await fetchByCompleted(false), [todo2]);
        assert.deepEqual(await update('b', { title: 'Filling' }), { id: 'b', title: 'Filling', completed: false });
        assert.deepEqual(await fetchByCompleted(true), [{ id: 'a', title: 'Name', completed: true }]); 
        assert.deepEqual(await fetchByCompleted(false), [{ id: 'b', title: 'Filling', completed: false }]);
      })
    
      it('Able to return NULL when absent ID is specified', async () => {
        assert.isNull(await update('c', { completed: true }));
        assert.deepEqual(await fetchByCompleted(true), []);
        assert.sameDeepMembers(await fetchByCompleted(false), [todo1, todo2]);
      })
    })

    describe('remove()', () => {
      const todo1 = { id: 'a', title: 'Name', completed: false };
      const todo2 = { id: 'b', title: 'Draft', completed: false };
      beforeEach(async () => {
        await create(todo1);
        await create(todo2);
      })

      it('Able to remove specified one', async () => {
        assert.strictEqual(await remove('b'), 'b');
        assert.deepEqual(await fetchAll(), [todo1]);
      })

      it('Able to return NULL when absent ID is specified', async () => {
        assert.strictEqual(await remove('c'), null);
        assert.sameDeepMembers(await fetchAll(), [todo1, todo2]);
      })
    })

  })
}