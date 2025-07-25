import { z } from "zod";
const envSchema = z.object({
  VITE_MAPTILER_KEY: z.string().min(1),
});

const env = envSchema.parse(import.meta.env);

export default env;
