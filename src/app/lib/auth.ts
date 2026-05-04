import { betterAuth, string } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVars } from "../config/env";
import { UserRoles } from "../middleware/auth.const";
import { Status } from "../../generated/prisma/enums";

export const auth = betterAuth({
    secret: envVars.BETTER_AUTH_SECRET,
    baseURL: envVars.FRONTEND_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [envVars.FRONTEND_URL!],
    user: {
        additionalFields: {
            role: {
                type: ["Customer", "Provider", "Admin"],
                required: false,
                defaultValue: "Customer"
            },
            status: {
                type: ["activate", "suspend"],
                required: false,
                defaultValue: "activate"
            },
            phone: {
                type: "string",
                required: false
            },
            isActive: {
                type: "boolean",
                required: false,
                defaultValue: true
            },
             bgimage: {
                type: "string",
                required: false,
            },
            emailVerified:{
              type:'boolean',
              required:false,
              
            }
        }
    },
    plugins:[
        bearer(),
        emailOTP({
          overrideDefaultEmailVerification: true,
          async sendVerificationOTP({ email, otp, type }) {
            if (type === "email-verification") {
              const user = await prisma.user.findUnique({
                where: {
                  email,
                },
              });
              if (user?.role === "Admin") {
                await prisma.user.update({
                  where: {
                    email,
                  },
                  data: {
                    emailVerified: true,
                  },
                });
              }
    
              if (user && !user.emailVerified) {
                await sendEmail({
                  to: user.email,
                  subject: "Verify your email address",
                  templateName: "otp",
                  templateData: {
                    name: user.name,
                    otp,
                  },
                });
              }
            } else if (type === "forget-password") {
              const user = await prisma.user.findUnique({
                where: {
                  email,
                },
              });
    
              if (user) {
                await sendEmail({
                  to: email,
                  subject: "Password Reset OTP",
                  templateName: "otp",
                  templateData: {
                    name: user.name,
                    otp,
                  },
                });
              }
            }
          },
          expiresIn: 10 * 60,
          otpLength: 6,
          resendStrategy: "rotate",
        }),
      ],
        
    emailVerification:{
        autoSignInAfterVerification:true,
        sendOnSignUp:true,
        sendOnSignIn:true
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn:true,
        // requireEmailVerification: true
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24, 
        strategy: "jwt",
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent",
            redirectURI:`${envVars.FRONTEND_URL}/api/auth/callback/google`,
            mapProfileToUser: () => {
              return {
                role: UserRoles.Customer,
                status: Status.activate,
                emailVerified: true,
                bgimage:""
              };
            },
          },
    },
    advanced: {
        // disableCSRFCheck: true,
        useSecureCookies: false,
        cookies: {
          state: {
            attributes: {
              sameSite: "lax",
              secure: true,
              httpOnly: true,
              path: "/",
            },
          },
          sessionToken: {
            attributes: {
              sameSite: "lax",
              secure: true,
              httpOnly: true,
              path: "/",
            },
          },
        },
      },
    
      redirectURLs: {
        signin: `${process.env.BETTER_AUTH_URL}`,
      },
});




