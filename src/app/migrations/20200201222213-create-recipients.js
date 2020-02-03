module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recipients', {
      id: {
        type: Sequelize.INTEGER,
        allownull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allownull: false,
      },
      rua: {
        type: Sequelize.STRING,
        allownull: false,
      },
      numero: {
        type: Sequelize.STRING,
        allownull: false,
      },
      complemento: {
        type: Sequelize.STRING,
        allownull: true,
      },
      estado: {
        type: Sequelize.STRING,
        allownull: false,
      },
      cidade: {
        type: Sequelize.STRING,
        allownull: false,
      },
      cep: {
        type: Sequelize.STRING,
        allownull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('recipients');
  },
};
