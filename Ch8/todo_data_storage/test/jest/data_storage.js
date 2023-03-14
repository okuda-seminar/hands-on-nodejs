'use strict';
function sortTodoById(todos) {
  return todos.sort((a, b) => a.id > b.id ? 1 : -1);
}

for (const dataStorageName of ['file_system', 'sqlite']) {
  const { fetchAll, fetchByCompleted, create, update, remove } = require(`../../${dataStorageName}`);

  describe(dataStorageName, () => {
    beforeEach(async () => {
      const allTodos = await fetchAll();
      await Promise.all(allTodos.map(({ id }) => remove(id)));
    })

    describe('create()、fetchAll()', () => {
      test('Able to get ToDo made by create() using fetchAll()', async () => {
        expect(await fetchAll()).toEqual([]);

        const todo1 = { id: 'a', title: 'Name', completed: false };
        await create(todo1);
        expect(await fetchAll()).toEqual([todo1]);

        const todo2 = { id: 'b', title: 'Draft', completed: true };
        await create(todo2);
        const todo3 = { id: 'c', title: 'Filling', completed: false };
        await create(todo3);
        expect(sortTodoById(await fetchAll())).toEqual([todo1, todo2, todo3]);
      })
    })

    describe('fetchByCompleted()', () => {
      test('Able to get ToDos whose completed values are same with the specified one', async() => {
        expect(await fetchByCompleted(true)).toEqual([]);
        expect(await fetchByCompleted(false)).toEqual([]); 

        const todo1 = { id: 'a', title: 'Name', completed: false };
        await create(todo1);
        const todo2 = { id: 'b', title: 'Draft', completed: true };
        await create(todo2);
        const todo3 = { id: 'c', title: 'Filling', completed: false };
        await create(todo3);

        expect(await fetchByCompleted(true)).toEqual([todo2]);
        expect(sortTodoById(await fetchByCompleted(false))).toEqual([todo1, todo3]);
      })
    })

    describe('update()', () => {
      const todo1 = { id: 'a', title: 'Name', completed: false };
      const todo2 = { id: 'b', title: 'Draft', completed: false };

      beforeEach(async () => {
        await create(todo1);
        await create(todo2);
      })

      test('Able to update', async () => {
        // todo1のcompletedを更新
        expect(await update('a', { completed: true }))
          .toEqual({ id: 'a', title: 'Name', completed: true });
        expect(await fetchByCompleted(true))
          .toEqual([{ id: 'a', title: 'Name', completed: true }]);
        expect(await fetchByCompleted(false)).toEqual([todo2]);

        // todo2のtitleを更新
        expect(await update('b', { title: 'Filling' }))
          .toEqual({ id: 'b', title: 'Filling', completed: false });
        expect(await fetchByCompleted(true)).toEqual([
          { id: 'a', title: 'Name', completed: true }
        ]);
        expect(await fetchByCompleted(false)).toEqual([
          { id: 'b', title: 'Filling', completed: false }
        ]);
      })

      test('Able to return NULL when absent ID is specified', async () => {
        expect(await update('c', { completed: true })).toBeNull;
        expect(await fetchByCompleted(true)).toEqual([]);
        expect(sortTodoById(await fetchByCompleted(false))).toEqual([todo1, todo2]);
      })
    })
    describe('remove()', () => {
      const todo1 = { id: 'a', title: 'Name', completed: false };
      const todo2 = { id: 'b', title: 'Draft', completed: false };

      beforeEach(async () => {
        await create(todo1);
        await create(todo2);
      })

      test('Able to remove specified one', async () => {
        expect(await remove('b')).toBe('b');
        expect(await fetchAll()).toEqual([todo1]);
      })

      test('Able to return NULL when absent ID is specified', async () => {
        expect(await remove('c')).toBeNull();
        expect(sortTodoById(await fetchAll())).toEqual([todo1, todo2]);
      })
    })
  })
}