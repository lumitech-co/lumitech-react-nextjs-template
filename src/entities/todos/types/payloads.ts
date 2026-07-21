export interface ICreateTodo {
  userId: number;
  title: string;
  completed: boolean;
}

export interface IUpdateTodo {
  title: string;
  completed: boolean;
}
