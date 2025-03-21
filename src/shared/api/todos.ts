import { api } from 'shared/lib';
import {
  ICreateTodoRequest,
  IGetTodosRequest,
  ITodoResponse,
  IUpdateTodoRequest,
} from 'shared/types';

const getTodos = async (
  params?: IGetTodosRequest,
  signal?: AbortSignal,
): Promise<ITodoResponse[]> => {
  const response = await api.get('/todos', {
    params,
    signal,
  });

  return response.data;
};

const updateTodo = async (
  todoId: string,
  payload: Partial<IUpdateTodoRequest>,
): Promise<string> => {
  await api.put(`/todos/${todoId}`, payload);

  return 'Todo was updated';
};

const createTodo = async (payload: ICreateTodoRequest): Promise<string> => {
  await api.post('/todos', payload);

  return 'Todo was created';
};

export const todosApi = {
  getTodos,
  createTodo,
  updateTodo,
};
