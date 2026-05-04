export type ICreateHighlightInput = {
  title: string;
  description: string;
  image?: string | null;
};

export type IUpdateHighlightInput = {
  title?: string;
  description?: string;
  image?: string | null;
};