export type ButtonType = "Text" | "Video";

export type PathType = "/text" | "/video";

export interface Message {
  userId?: string;
  message?: string;
}

export interface User {
  userId: string;
  isQueueing: boolean;
}
