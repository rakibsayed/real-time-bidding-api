"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create items
    const itemsData = [
      {
        name: 'Item 1',
        description: 'Description for item 1',
        starting_price: 50.00,
        current_price: 50.00,
        image_url: 'https://example.com/item1.jpg',
        end_time: '2024-05-30T12:00:00Z',
        owner_id: 1, // Assuming user ID 1 exists as owner
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        name: 'Item 2',
        description: 'Description for item 2',
        starting_price: 100.00,
        current_price: 100.00,
        image_url: 'https://example.com/item2.jpg',
        end_time: '2024-05-30T12:00:00Z',
        owner_id: 2, // Assuming user ID 2 exists as owner
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        name: 'Item 3',
        description: 'Description for item 3',
        starting_price: 75.00,
        current_price: 75.00,
        image_url: 'https://example.com/item3.jpg',
        end_time: '2024-05-30T12:00:00Z',
        owner_id: 3, // Assuming user ID 3 exists as owner
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        name: 'Item 4',
        description: 'Description for item 4',
        starting_price: 120.00,
        current_price: 120.00,
        image_url: 'https://example.com/item4.jpg',
        end_time: '2024-05-30T12:00:00Z',
        owner_id: 4, // Assuming user ID 4 exists as owner
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        name: 'Item 5',
        description: 'Description for item 5',
        starting_price: 80.00,
        current_price: 80.00,
        image_url: 'https://example.com/item5.jpg',
        end_time: '2024-05-30T12:00:00Z',
        owner_id: 5, // Assuming user ID 5 exists as owner
        created_at: '2024-05-30T12:00:00Z',
      },
    ];

    await queryInterface.bulkInsert('Items', itemsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all items
    await queryInterface.bulkDelete('Items', null, {});
  },
};

