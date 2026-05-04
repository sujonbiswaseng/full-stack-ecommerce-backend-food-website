export type ICreateBlogInput = {
  title: string;
  content: string;
  images?: string[];
  mealid?: string | null;
};

export type IUpdateBlogInput = {
  title?: string;
  content?: string;
  images?: string[];
  authorId?: string;
  mealid?: string | null;
};