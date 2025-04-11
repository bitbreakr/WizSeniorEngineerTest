
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Games', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    publisherId: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    platform: {
      type: Sequelize.STRING,
    },
    storeId: {
      type: Sequelize.STRING,
    },
    bundleId: {
      type: Sequelize.STRING,
    },
    appVersion: {
      type: Sequelize.STRING,
    },
    isPublished: {
      type: Sequelize.BOOLEAN,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Games'),
};
