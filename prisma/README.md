
### Códigos de erro mais comuns do Prisma
##  Código: Significado	Exceção HTTP sugerida
P2002	Violação de chave única (@unique)   ConflictException (409)
P2003	Violação de chave estrangeira	BadRequestException (400)
P2025	Registro não encontrado	NotFoundException (404)
P2014	Relação inválida	BadRequestException (400)
P1001	Não conseguiu conectar ao banco	ServiceUnavailableException (503)
P1008	Timeout na operação	RequestTimeoutException (408)
P1017	Conexão encerrada pelo banco	ServiceUnavailableException (503)