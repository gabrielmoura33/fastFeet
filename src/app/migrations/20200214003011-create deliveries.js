module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliveries', {
      id: {
        type: Sequelize.INTEGER,
        allownull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        references: { model: 'recipients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allownull: false,
      },
      deliveryMan_id: {
        type: Sequelize.INTEGER,
        references: { model: 'delivery_mans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allownull: false,
      },
      signature_id: {
        type: Sequelize.INTEGER,
        references: { model: 'signatures', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allownull: true,
      },
      product: {
        type: Sequelize.STRING,
        allownull: false,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
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
    return queryInterface.dropTable('deliveries');
  },
};
