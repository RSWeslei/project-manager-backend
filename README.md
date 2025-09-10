# Projeta - Sistema de Gestão de Projetos

Projeta é uma aplicação Full-Stack completa para gestão de projetos, tarefas e equipes, construída com as tecnologias mais modernas para performance e escalabilidade.

---

## 🚀 Funcionalidades Implementadas

-   **Autenticação e Segurança:**
    -   [x] Registro e Login de usuários com JWT.
    -   [x] Sistema de autorização baseado em papéis (Roles).
    -   [x] Rotas protegidas que exigem autenticação.
    -   [x] Extração dinâmica de dados do usuário (ID, role) a partir do token.

-   **Gestão de Usuários:**
    -   [x] Upload de foto de perfil para usuários.

-   **Gestão de Projetos:**
    -   [x] CRUD completo de projetos.

-   **Gestão de Tarefas:**
    -   [x] CRUD completo de tarefas vinculadas a projetos.

-   **Dashboard e Análise:**
    -   [x] Endpoint de estatísticas que calcula totais e agrupamentos de dados.
    -   [x] (Frontend) Visualização com gráficos de tarefas por status e por usuário.

-   **API e Backend:**
    -   [x] Respostas de API padronizadas para sucesso e erro (Interceptors e Filters).
    -   [x] Validação de dados de entrada (DTOs).
    -   [x] Documentação da API com Swagger (`/api-docs`).
    -   [x] Scripts de Seed para popular o banco de dados com dados iniciais.

---

## 🛠️ Stack Tecnológica

-   **Backend:** NestJS, Sequelize, PostgreSQL, TypeScript
-   **Frontend:** React 19, Vite, JavaScript, Tailwind CSS, Mantine
-   **Autenticação:** JSON Web Tokens (JWT)
-   **Testes de API:** Postman

---

## 🎯 Decisões Técnicas

-   **Backend com NestJS:** Escolhido por sua arquitetura modular e escalável, que utiliza Injeção de Dependência e TypeScript para um código mais limpo e manutenível, ideal para projetos complexos. A estrutura com Módulos, Serviços e Controllers organiza bem as responsabilidades.

-   **ORM com Sequelize:** Um ORM maduro e robusto para Node.js, facilitando a interação com o PostgreSQL através de modelos fortemente tipados (`sequelize-typescript`), o que reduz a chance de erros e aumenta a produtividade.

-   **Frontend com React + Vite:** A combinação oferece uma experiência de desenvolvimento extremamente rápida (HMR) e um build final otimizado. React foi escolhido por seu ecossistema robusto e paradigma declarativo para a construção de interfaces.

-   **Gerenciamento de Estado com Context API:** Para o escopo deste projeto, a Context API nativa do React é a solução perfeita para gerenciar o estado global de autenticação, evitando a complexidade de bibliotecas externas como Redux, mas mantendo o código limpo e centralizado.

-   **Padronização de Respostas da API:** A implementação de Interceptors (para sucesso) e Exception Filters (para erros) no NestJS garante que o frontend sempre receba uma resposta previsível (`{ type, data, message }`), simplificando o tratamento de dados e erros no lado do cliente.

-   **Autorização Dinâmica:** A criação de um serviço de escopo de requisição (`AuthUserService`) para prover dinamicamente os dados do usuário logado (extraídos do token JWT) para outros serviços desacopla a lógica de negócio da camada de transporte (HTTP), tornando o código mais limpo e seguro.

---

## ⚙️ Instruções de Instalação e Execução

### Pré-requisitos

-   Node.js (v18 ou superior)
-   NPM ou Yarn
-   PostgreSQL
-   Um cliente de API (Postman, Insomnia)

### Backend

1.  Navegue até a pasta do backend:
    ```bash
    cd project-manager-backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Copie o arquivo de ambiente de exemplo e preencha com suas credenciais do PostgreSQL:
    ```bash
    cp .env.example .env || copy .env.example .env
    ```
    
4. Crie o banco de dados no PostgreSQL conforme o nome definido na variável `DB_NAME` do arquivo `.env`.

5.  Compile o projeto (necessário para os seeders):
    ```bash
    npm run build
    ```
6.  (Opcional, mas recomendado) Popule o banco de dados com dados de exemplo:
    ```bash
    npm run db:seed
    ```
7.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run start:dev
    ```
-   A API estará rodando em `http://localhost:3001`.
-   A documentação do Swagger estará em `http://localhost:3001/api-docs`.