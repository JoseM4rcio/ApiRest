import { config } from "dotenv";
import { z } from "zod";

// Carregar variáveis de ambiente
if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

// Validação das variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().optional(), // A porta pode ser opcional
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Variáveis de ambiente inválidas!", _env.error.format());
  throw new Error("Variáveis de ambiente inválidas.");
}

export const env = {
  ..._env.data,
  PORT: _env.data.PORT || 4000, // Garante que use 4000 se a porta não for definida
};

// Exemplo de servidor
import Fastify from "fastify";

const fastify = Fastify();

fastify.get("/", async (request, reply) => {
  return { message: "Servidor funcionando!" };
});

// Usar a porta definida pelo Render ou a padrão
const PORT = env.PORT;

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em: ${address}`);
});
