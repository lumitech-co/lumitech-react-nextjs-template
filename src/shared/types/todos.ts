export interface ITodoResponse {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface ICreateTodoRequest {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface IUpdateTodoRequest {
  id: number;
  title: string;
  completed: boolean;
}

export interface IGetTodosRequest {
  _page?: number;
  _limit?: number;
}
