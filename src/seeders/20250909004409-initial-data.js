'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('password123', saltRounds);
    const managerPassword = await bcrypt.hash('password123', saltRounds);

    const users = await queryInterface.bulkInsert('users', [
      { name: 'Admin User', email: 'admin@projeta.com', password: adminPassword, role: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Manager User', email: 'manager@projeta.com', password: managerPassword, role: 'manager', createdAt: new Date(), updatedAt: new Date() },
    ], { returning: true });

    const projects = await queryInterface.bulkInsert('projects', [
      { name: 'Projeto Alpha', description: 'Descrição do Projeto Alpha.', status: 'active', managerId: users[1].id, createdAt: new Date(), updatedAt: new Date() },
    ], { returning: true });

    await queryInterface.bulkInsert('tasks', [
      { title: 'Análise de Requisitos', description: 'Levantar todos os requisitos com o cliente.', status: 'done', priority: 'high', projectId: projects[0].id, assigneeId: users[1].id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Desenvolvimento do Módulo de Auth', description: 'Criar toda a estrutura de autenticação.', status: 'in_progress', priority: 'high', projectId: projects[0].id, assigneeId: users[1].id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Testes Unitários', description: 'Escrever testes para os serviços.', status: 'todo', priority: 'medium', projectId: projects[0].id, assigneeId: users[1].id, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};