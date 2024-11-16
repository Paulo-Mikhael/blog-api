import Fastify from "fastify";

const fastify = Fastify({
  logger: true
});

fastify.get("/teste", (request, reply) => {
  reply.send({ hello: "world" });
});

fastify.listen({ port: 3333 }, (err, address) => {
  if (err){
    fastify.log.error(err);
    process.exit(1);
  } else {
    console.log(`Servidor rodando na porta ${address}`);
  };
});