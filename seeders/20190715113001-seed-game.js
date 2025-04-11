

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Games', [{
    publisherId: 'fda4848f-9fe6-4703-8f66-544cc146f1ae',
    name: 'Helix Jump',
    platform: 'ios',
    storeId: '1345968745',
    bundleId: 'com.h8games.falldown',
    appVersion: '2.4.2',
    isPublished: true,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  }, {
    publisherId: 'fda4848f-9fe6-4703-8f66-544cc146f1ae',
    name: 'Helix Jump',
    platform: 'android',
    storeId: 'com.h8games.helixjump',
    bundleId: 'com.h8games.helixjump',
    appVersion: '2.4.4',
    isPublished: true,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  }, {
    publisherId: 'fda4848f-9fe6-4703-8f66-544cc146f1ae',
    name: 'Swing Rider',
    platform: 'ios',
    storeId: '1441881688',
    bundleId: 'com.semeevs.swingrider',
    appVersion: '1.3',
    isPublished: true,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  }, {
    publisherId: 'fda4848f-9fe6-4703-8f66-544cc146f1ae',
    name: 'Swing Rider',
    platform: 'android',
    storeId: 'com.swing.rope',
    bundleId: 'com.swing.rope',
    appVersion: '1.0.3',
    isPublished: true,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  }, {
    publisherId: 'c92d2e46-4f85-485c-b2a2-591d7857c93e',
    name: 'Car Crash!',
    platform: 'ios',
    storeId: '1450509345',
    bundleId: 'com.andrew.stunts',
    appVersion: '1.3.1',
    isPublished: true,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  }], {}),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
