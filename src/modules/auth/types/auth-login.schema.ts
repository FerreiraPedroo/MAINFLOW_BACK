import z from "zod";

// INPUT
const AuthLogin = z.object({
  email: z.email(),
  password: z.string(),
});
export const AuthLoginInputSchema = z.tuple([AuthLogin]);

// OUTPUT
const activity = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string().optional(),
  icon: z.string().nullable(),
});
const sectorItem = z.object({
  id: z.number(),
  department_id: z.number(),
  title: z.string(),
  icon: z.string().nullable(),
  activities: z.array(activity),
});
const userDepartment = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  icon: z.string().nullable(),
  activities: z.array(z.union([sectorItem, activity])),
});
export const AuthLoginOutputSchema = z.object({
  tokenInfo: z.string(),
  userActivityInfo: z.array(userDepartment),
  userInfo: z.object({
    id: z.number(),
    name: z.string(),
    photo: z.string().nullable(),
    email: z.string(),
  }),
});

// CONTROLLER
export type AuthLoginDto = z.infer<typeof AuthLogin>;

// SERVICE
export type AuthLoginInput = AuthLoginDto;
export type UserActivitiesInfo = z.infer<typeof userDepartment>;
export type AuthLoginOutput = z.infer<typeof AuthLoginOutputSchema>;
