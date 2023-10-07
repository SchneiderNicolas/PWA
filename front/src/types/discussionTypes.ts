export type User = {
  name?: string;
  email: string;
  id?: number;
};

export type Message = {
  content: string;
  createdAt: string;
  user: User;
  formattedCreatedAt: string;
};

export type Discussion = {
  id: number;
  title: string;
  users: User[];
  messages: Message[];
  isNew: boolean;
};
