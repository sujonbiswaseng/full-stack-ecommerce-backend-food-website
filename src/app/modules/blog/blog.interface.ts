export type ICreateBlogInput = {
  title: string;
  content: string;
  images?: string[];
  eventId?: string | null;
};

export type IUpdateBlogInput = {
  title?: string;
  content?: string;
  images?: string[];
  authorId?: string;
  eventId?: string | null;
};