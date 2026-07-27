import z from "zod";

// INPUT
export const AuthLoginInputSchema = z.object({
  email: z.email(),
  password: z.string(),
});

// OUTPUT
const activity = z.object({
  id: z.number(),
  department_id: z.number(),
  sector_id: z.number().nullable(),
  title: z.string(),
  url: z.string(),
  icon: z.string().nullable(),
});
const sectorItem = z.object({
  id: z.number(),
  department_id: z.number(),
  title: z.string(),
  icon: z.string().nullable(),
  activities: z.array(activity),
});
const userActivityInfo = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  icon: z.string().nullable(),
  activities: z.union([z.array(sectorItem), z.array(activity)]),
});
export const AuthLoginOutputSchema = z.object({
  tokenInfo: z.string(),
  userActivityInfo: userActivityInfo,
  userInfo: {
    id: z.number(),
    name: z.string(),
    photo: z.string().nullable(),
    email: z.string(),
  },
});

// CONTROLLER
export type AuthLoginDto = z.infer<typeof AuthLoginInputSchema>;

// SERVICE
export type AuthLoginInput = AuthLoginDto;
export type AuthLoginOutput = z.infer<typeof AuthLoginOutputSchema>;
