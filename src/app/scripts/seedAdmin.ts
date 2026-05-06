import "dotenv/config";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { envVars } from "../config/env";

export const seedAdmin = async () => {

  await prisma.$connect();

  await auth.api.signUpEmail({
    body: {
      name: "admin12",
      email: envVars.EMAIL,
      password: envVars.PASSWORD,
      emailVerified:true,
      image: "https://images.pexels.com/users/avatars/2159489466/sujon-biswas-288.jpg?auto=compress&fit=crop&h=140&w=140&dpr=1",
      phone: "01804935939",
      bgimage: "https://res.cloudinary.com/drmeagmkl/image/upload/v1765536346/sujonbiswas_exfo5o.jpg",
      role:"Admin",
    },
  });
};

seedAdmin();
