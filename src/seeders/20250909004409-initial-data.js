'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;
    const now = new Date();

    const usersToCreate = [
      { name: 'Admin Projeta', email: 'admin@projeta.com', password: 'password123', role: 'admin' },
      { name: 'Gerente Alice', email: 'alice@projeta.com', password: 'password123', role: 'manager' },
      { name: 'Gerente Bruno', email: 'bruno@projeta.com', password: 'password123', role: 'manager' },
      { name: 'Dev Carlos', email: 'carlos@projeta.com', password: 'password123', role: 'developer' },
      { name: 'Dev Diana', email: 'diana@projeta.com', password: 'password123', role: 'developer' },
      { name: 'Dev Eduardo', email: 'eduardo@projeta.com', password: 'password123', role: 'developer' },
      { name: 'Dev Fabiola', email: 'fabiola@projeta.com', password: 'password123', role: 'developer' },
    ];

    for (const user of usersToCreate) {
      user.password = await bcrypt.hash(user.password, saltRounds);
      user.createdAt = now;
      user.updatedAt = now;
    }

    const users = await queryInterface.bulkInsert('users', usersToCreate, { returning: true });

    const adminUser = users.find(u => u.role === 'admin');
    const managerAlice = users.find(u => u.email === 'alice@projeta.com');
    const managerBruno = users.find(u => u.email === 'bruno@projeta.com');
    const devCarlos = users.find(u => u.email === 'carlos@projeta.com');
    const devDiana = users.find(u => u.email === 'diana@projeta.com');
    const devEduardo = users.find(u => u.email === 'eduardo@projeta.com');
    const devFabiola = users.find(u => u.email === 'fabiola@projeta.com');

    const projectsToCreate = [
      { name: 'Projeto Alpha', description: 'Desenvolvimento do novo aplicativo móvel para gestão financeira.', status: 'active', managerId: managerAlice.id, startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1), endDate: new Date(now.getFullYear(), now.getMonth() + 4, 1) },
      { name: 'Projeto Beta', description: 'Migração de toda a infraestrutura para a nuvem.', status: 'planned', managerId: managerBruno.id, startDate: new Date(now.getFullYear(), now.getMonth() + 1, 15), endDate: new Date(now.getFullYear(), now.getMonth() + 7, 15) },
      { name: 'Marketing Q3', description: 'Campanha de marketing digital para o terceiro trimestre.', status: 'completed', managerId: managerAlice.id, startDate: new Date(now.getFullYear(), 5, 1), endDate: new Date(now.getFullYear(), 7, 30) },
      { name: 'Projeto Legado', description: 'Manutenção do sistema legado.', status: 'cancelled', managerId: managerBruno.id, startDate: new Date(now.getFullYear() -1, 0, 1), endDate: new Date(now.getFullYear(), 0, 1) },
    ];

    for(const project of projectsToCreate) {
      project.createdAt = now;
      project.updatedAt = now;
    }

    const projects = await queryInterface.bulkInsert('projects', projectsToCreate, { returning: true });

    const projectAlpha = projects.find(p => p.name === 'Projeto Alpha');
    const projectBeta = projects.find(p => p.name === 'Projeto Beta');
    const projectMarketing = projects.find(p => p.name === 'Marketing Q3');

    const tasksToCreate = [
      // Projeto Alpha
      { title: 'Análise de Requisitos', status: 'done', priority: 'high', projectId: projectAlpha.id, assigneeId: devCarlos.id, dueDate: new Date(now.getTime() - 15 * 86400000) },
      { title: 'Desenvolvimento do Módulo de Auth', status: 'in_progress', priority: 'critical', projectId: projectAlpha.id, assigneeId: devDiana.id, dueDate: new Date(now.getTime() + 5 * 86400000) },
      { title: 'Testes Unitários da API', status: 'todo', priority: 'medium', projectId: projectAlpha.id, assigneeId: devEduardo.id, dueDate: new Date(now.getTime() + 20 * 86400000) },
      { title: 'Criar UI do Dashboard', status: 'review', priority: 'high', projectId: projectAlpha.id, assigneeId: devFabiola.id, dueDate: new Date(now.getTime() + 10 * 86400000) },
      { title: 'Configurar CI/CD', status: 'todo', priority: 'medium', projectId: projectAlpha.id, assigneeId: devCarlos.id, dueDate: new Date(now.getTime() + 30 * 86400000) },
      { title: 'Documentação da API', status: 'todo', priority: 'low', projectId: projectAlpha.id, assigneeId: devDiana.id, dueDate: new Date(now.getTime() + 45 * 86400000) },
      { title: 'Bug #102: Botão de login não funciona no Safari', status: 'in_progress', priority: 'critical', projectId: projectAlpha.id, assigneeId: devEduardo.id, dueDate: new Date(now.getTime() - 2 * 86400000) }, // Atrasada

      // Projeto Beta
      { title: 'Planejamento da Migração', status: 'done', priority: 'high', projectId: projectBeta.id, assigneeId: managerBruno.id, dueDate: new Date(now.getTime() + 10 * 86400000) },
      { title: 'Provisionar recursos na AWS', status: 'todo', priority: 'critical', projectId: projectBeta.id, assigneeId: devCarlos.id, dueDate: new Date(now.getTime() + 25 * 86400000) },
      { title: 'Migrar Banco de Dados', status: 'todo', priority: 'critical', projectId: projectBeta.id, assigneeId: devDiana.id, dueDate: new Date(now.getTime() + 40 * 86400000) },
      { title: 'Configurar auto-scaling', status: 'todo', priority: 'medium', projectId: projectBeta.id, assigneeId: devEduardo.id, dueDate: new Date(now.getTime() + 50 * 86400000) },

      // Marketing Q3
      { title: 'Definir persona do público-alvo', status: 'done', priority: 'high', projectId: projectMarketing.id, assigneeId: managerAlice.id },
      { title: 'Criar conteúdo para redes sociais', status: 'done', priority: 'medium', projectId: projectMarketing.id, assigneeId: devFabiola.id },
      { title: 'Agendar posts do Instagram', status: 'done', priority: 'medium', projectId: projectMarketing.id, assigneeId: devFabiola.id },
      { title: 'Analisar métricas da campanha', status: 'done', priority: 'high', projectId: projectMarketing.id, assigneeId: managerAlice.id },
    ];

    for(const task of tasksToCreate) {
      task.description = task.description || `Descrição para a tarefa "${task.title}".`;
      task.createdAt = now;
      task.updatedAt = now;
    }

    await queryInterface.bulkInsert('tasks', tasksToCreate);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};