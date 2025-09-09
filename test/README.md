# Desafio Full-Stack: Sistema de Gestão de Projetos

## 📋 Visão Geral

Desafio técnico para avaliação de habilidades em NestJS, React, TypeScript/JavaScript e PostgreSQL. Você deverá construir um sistema de gestão de projetos com funcionalidades avançadas em até 5 dias.

## 🎯 Objetivo

Criar uma aplicação completa com backend em NestJS + Sequelize e frontend em React 19 + Vite que permita gerenciar projetos, tarefas e colaboradores.

## 🏗️ Requisitos Técnicos

### Backend (NestJS + Sequelize)

- API RESTful com TypeScript
- Modelagem de dados com Sequelize ORM
- Autenticação JWT
- Validação de dados
- Tratamento de erros
- Documentação da API (Swagger/OpenAPI)

### Frontend (React 19 + Vite)

- Interface responsiva com React 19
- Gerenciamento de estado (Context API)
- Roteamento com React Router
- Formulários com validação
- Consumo da API com tratamento de erros
- UI consistente e profissional

### Banco de Dados (PostgreSQL)

- Modelagem com relações apropriadas
- Migrações com Sequelize
- Seeds para dados iniciais

## 📊 Esquema do Banco de Dados

```typescript
// Modelos principais
User {
  id: number
  name: string
  email: string
  password: string
  role: 'admin' | 'manager' | 'developer'
}

Project {
  id: number
  name: string
  description: string
  status: 'planned' | 'active' | 'completed' | 'cancelled'
  startDate: Date
  endDate: Date
  managerId: number // FK to User
}

Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  dueDate: Date
  projectId: number // FK to Project
  assigneeId: number // FK to User
}

ProjectMember {
  id: number
  projectId: number // FK to Project
  userId: number // FK to User
  role: 'viewer' | 'contributor' | 'maintainer'
}
```
```PS: Seguir esse esquema do database é opcional, você pode montar o seu.```

## 🚀 Funcionalidades Requeridas

### Autenticação e Autorização

- Registro e login de usuários
- Proteção de rotas baseada em roles
- Refresh tokens

### Gestão de Projetos

- CRUD completo de projetos
- Atribuição de gerentes a projetos
- Filtros por status e datas
- Dashboard com estatísticas, podendo filtrar por projeto, onde deve exibir o total de tarefas e tarefas por usuário, de preferência com gráficos.

### Gestão de Tarefas

- CRUD de tarefas dentro de projetos
- Atribuição de tarefas a membros
- Atualização de status e prioridade
- Busca e filtros avançados

### Equipes e Colaboradores

- Adicionar/remover membros de projetos
- Definir permissões por projeto
- Listar membros e suas atribuições

## 🧪 Requisitos de Qualidade

- Código limpo e bem estruturado
- Tipagem TypeScript adequada
- Tratamento de erros apropriado
- Documentação básica da API
- Responsividade da interface
- Build sem erros

## 📦 Entregáveis Esperados

- Código fonte completo no GitHub [pode ficar público]
- README com:
    - Instruções de instalação e execução
    - Explicação das decisões técnicas
    - Lista de funcionalidades implementadas
- Coleção Postman/Insomnia para testar a API
- Diagrama do banco de dados

## ⏰ Dicas de Gestão de Tempo

- Dias 1-2: Configuração inicial, modelagem de dados e autenticação
- Dias 3-4: Implementação das funcionalidades principais do backend
- Dias 5-6: Frontend e integração final

## 🎁 Diferenciais (Opcionais)

- Testes unitários
- Notificações em tempo real (WebSockets)
- Upload de arquivos
- API GraphQL alternativa

## 📚 Stack Obrigatória

- Backend: NestJS + Express + Sequelize + TypeScript
- Frontend: React 19 + Vite + JavaScript + Tailwind
- Banco de Dados: PostgreSQL

Este desafio avalia habilidades técnicas em desenvolvimento full-stack, arquitetura de software, modelagem de dados e capacidade de entregar uma aplicação completa dentro do prazo estabelecido.

Boa sorte! 🚀
