import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import 'isomorphic-fetch';

const pages = {
  index: { title: 'All ToDo', fetchQuery: '' },
  active: { title: 'Uncompleted ToDo', fetchQuery: '?completed=false' },
  completed: { title: 'Completed ToDo', fetchQuery: '?completed=true' }
};

const pageLinks = Object.keys(pages).map((page, index) =>
  <Link href={`/${page === 'index' ? '' : page}`} key={index} style={{ marginRight: 10 }}>
      {pages[page].title}
  </Link>
);

export default function Todos(props) {
  const { title, completed } = pages[props.page];
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/todos/events');
    
    eventSource.addEventListener('message', e => {
      const todos = JSON.parse(e.data);
      setTodos(
        typeof completed === 'undefined' ? todos : todos.filter(todo => todo.completed === completed)
      );
    });
    
    eventSource.addEventListener('error', e => console.log('SSE error', e));

    return () => eventSource.close();
  }, [props.page]);
  
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      {/* Show ToDo list */}
      <ul>
        {todos.map(({ id, title, completed }) =>
          <li key={id}>
            <span style={completed ? { textDecoration: 'line-through' } : {}}>
              {title}
            </span>
          </li>
        )}
      </ul>
      <div>{pageLinks}</div>
    </>
  )
}