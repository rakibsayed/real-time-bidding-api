"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create notifications
    const notificationsData = [
      {
        message: 'You have a new message.',
        is_read: false,
        user_id: 1, // Notification for first user
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        message: 'Bid accepted.',
        is_read: false,
        user_id: 2, // Notification for second user
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        message: 'You won the auction.',
        is_read: false,
        user_id: 3, // Notification for third user
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        message: 'Auction ended.',
        is_read: false,
        user_id: 5, // Notification for fourth user
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        message: 'Item sold.',
        is_read: false,
        user_id: 5, // Notification for fifth user
        created_at: '2024-05-30T12:00:00Z',
      },
    ];

    await queryInterface.bulkInsert('Notifications', notificationsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all notifications
    await queryInterface.bulkDelete('Notifications', null, {});
  },
};
