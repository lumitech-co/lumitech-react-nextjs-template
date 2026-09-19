import { createServer } from 'node:http';

const PORT = Number(process.env.STUB_API_PORT ?? 4010);

const initialTodos = [
  { userId: 1, id: 1, title: 'buy milk', completed: false },
  { userId: 1, id: 2, title: 'walk the dog', completed: true },
];

let todos = [...initialTodos];

const readJson = async request => {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const send = (response, status, body) => {
  response.writeHead(status, {
    ...CORS_HEADERS,
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
};

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, `http://localhost:${PORT}`);
  const todoId = Number(pathname.split('/')[2]);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, CORS_HEADERS);

    return response.end();
  }

  if (pathname === '/__reset') {
    todos = [...initialTodos];

    return send(response, 200, { ok: true });
  }

  if (pathname === '/todos' && request.method === 'GET') {
    return send(response, 200, todos);
  }

  if (pathname === '/todos' && request.method === 'POST') {
    const created = { ...(await readJson(request)), id: todos.length + 1 };

    todos = [...todos, created];

    return send(response, 201, created);
  }

  if (todoId && request.method === 'PUT') {
    const payload = await readJson(request);

    todos = todos.map(todo =>
      todo.id === todoId ? { ...todo, ...payload } : todo,
    );

    return send(response, 200, todos.find(todo => todo.id === todoId));
  }

  return send(response, 404, { message: 'Not found' });
}).listen(PORT, () => {
  process.stdout.write(`stub api listening on http://localhost:${PORT}\n`);
});
