# Controle de inventário de hardware

Instale o Node aqui: https://nodejs.org/pt-br

Instale o MySql aqui: https://www.mysql.com/downloads/

A aplicação utiliza o ambiente de execução Node.js e o framework Express para a construção de uma API robusta. O sistema adota o padrão MVC (Model-View-Controller), estruturado da seguinte forma:

View: Interface SPA (Single Page Application) construída com tecnologias web padrão (HTML5, CSS3, JS), que consome a API de forma assíncrona via Fetch API.

Controller: Camada lógica responsável por processar as requisições HTTP, gerenciar o fluxo de autenticação e as regras de negócio.

Model: Camada de persistência que utiliza o MySQL para o armazenamento relacional dos dados dos ativos.

# A segurança é baseada em:

LDAP/Active Directory: Utiliza o protocolo LDAP para realizar a validação de usuários diretamente contra o controlador de domínio Windows da organização.

Gestão de Sessão: Implementada através do middleware express-session, que gera identificadores únicos após a autenticação bem-sucedida, mantendo o estado do usuário de forma segura no servidor.

Middleware de Proteção: Filtros de requisição interceptam as rotas da API e o acesso a arquivos sensíveis (como o gerenciador.html), bloqueando acessos não autenticados.

Dependências e Instalação
O ecossistema é mantido via NPM (Node Package Manager). Os pacotes essenciais são:

express: Framework para gerenciamento de rotas e infraestrutura HTTP.

ldapjs: Cliente para comunicação e operações de bind no Active Directory.

express-session: Motor para gerenciamento de sessões persistentes.

cors: Mecanismo para definição de políticas de segurança em requisições de origens cruzadas.

# Para realizar a instalação:

*npm install express ldapjs express-session cors*

O fluxo inicia com a tentativa de conexão (bind) no AD. Uma vez estabelecida a autenticidade, o servidor autoriza a entrega dos recursos estáticos e libera as operações de CRUD no banco de dados. Este modelo elimina redundância de senhas e garante que o acesso ao inventário siga as mesmas políticas de segurança da rede corporativa.
