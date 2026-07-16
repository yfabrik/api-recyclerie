import z from "zod";

export const skillDataSchema = z.object({
  name: z.string().trim().nonempty("nom requis"),
  isActive: z.coerce.boolean().default(true),
  description: z.coerce.string().optional(),
});

export type SkillData = z.infer<typeof skillDataSchema>;
export type SkillDataInput = z.input<typeof skillDataSchema>;