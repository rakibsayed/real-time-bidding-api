"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create bids
    const bidsData = [
      {
        bid_amount: 60.00,
        bidder_id: 2, // Second user placing bid
        item_id: 2, // Bid on first item
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        bid_amount: 110.00,
        bidder_id: 1, // First user placing bid
        item_id: 2, // Bid on second item
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        bid_amount: 70.00,
        bidder_id: 3, // Third user placing bid
        item_id: 3, // Bid on third item
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        bid_amount: 130.00,
        bidder_id: 4, // Fourth user placing bid
        item_id: 4, // Bid on fourth item
        created_at: '2024-05-30T12:00:00Z',
      },
      {
        bid_amount: 90.00,
        bidder_id: 5, // Fifth user placing bid
        item_id: 5, // Bid on fifth item
        created_at: '2024-05-30T12:00:00Z',
      },
    ];

    await queryInterface.bulkInsert('Bids', bidsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all bids
    await queryInterface.bulkDelete('Bids', null, {});
  },
};
