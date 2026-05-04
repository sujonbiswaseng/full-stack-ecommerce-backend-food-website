
export interface IRequestUser {
    id: string;
    email: string;
    name: string;
    role: "Admin" | "Provider" | "Customer";
    status: "activate" | "suspend";
    emailVerified: boolean;
    isActive: boolean;
  }