const express = require('express');
const router = express.Router();
const dataRefreshService = require('../services/dataRefreshService');
const Order = require('../models/order');
const Product = require('../models/product');
const Customer = require('../models/customer');

// API endpoint to trigger data refresh
router.post('/refresh-data', async (req, res) => {
  const result = await dataRefreshService.refreshData();
  res.status(result.success ? 200 : 500).json(result);
});

// Helper function to build match query for date range
function getDateRangeMatch(startDate, endDate) {
  const match = {};
  if (startDate) {
    match.dateOfSale = { $gte: new Date(startDate) };
  }
  if (endDate) {
    match.dateOfSale = { ...match.dateOfSale, $lte: new Date(endDate) };
  }
  return match;
}

// --- Core Calculation APIs ---

// 1. Top N Products (Overall)
router.get('/top-products/overall', async (req, res) => {
  const { n = '10', startDate, endDate } = req.query;
  const limit = parseInt(n);
  const dateMatch = getDateRangeMatch(startDate, endDate);

  try {
    const topProducts = await Order.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: '$productId',
          totalQuantitySold: { $sum: '$quantitySold' },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'productId',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          totalQuantitySold: 1,
          productName: '$productInfo.productName',
        },
      },
    ]);

    res.json(topProducts);
  } catch (error) {
    console.error('Error fetching top products (overall):', error);
    res.status(500).json({ error: 'Failed to fetch top products.' });
  }
});

// 2. Top N Products by Category
router.get('/top-products/category/:category', async (req, res) => {
    try {
        const  category  = req.params.category;
        const { startDate, endDate } = req.query;
    
        // Step 1: Find productIds for given category
        const products = await Product.find({ category: category });
        const productIds = products.map(p => p.productId);
    
        if (productIds.length === 0) {
          return res.status(404).json({ message: 'No products found for this category.' });
        }
    
        // Step 2: Build filter for orders
        const orderFilter = {
          productId: { $in: productIds }
        };
    
        if (startDate || endDate) {
          orderFilter.dateOfSale = {};
          if (startDate) {
            orderFilter.dateOfSale.$gte = new Date(startDate);
          }
          if (endDate) {
            orderFilter.dateOfSale.$lte = new Date(endDate);
          }
        }
    
        // Step 3: Find orders and calculate total quantity sold
        const orders = await Order.find(orderFilter);
    
        const totalQuantitySold = orders.reduce((sum, order) => sum + order.quantitySold, 0);
    
        res.json({
          category,
          startDate: startDate || null,
          endDate: endDate || null,
          totalQuantitySold,
          ordersCount: orders.length,
          productsMatched: productIds.length
        });
    
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
      }
});

// 3. Top N Products by Region
router.get('/top-products/region/:region', async (req, res) => {
  const { region } = req.params;
  const { n = '10', startDate, endDate } = req.query;
  const limit = parseInt(n);
  const dateMatch = getDateRangeMatch(startDate, endDate);

  try {
    const topProductsByRegion = await Order.aggregate([
      { $match: dateMatch },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: 'customerId',
          as: 'customerInfo',
        },
      },
      { $unwind: '$customerInfo' },
      { $match: { 'customerInfo.region': region } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: 'productId',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productId',
          totalQuantitySold: { $sum: '$quantitySold' },
          productName: { $first: '$productInfo.productName' },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          totalQuantitySold: 1,
          productName: 1,
        },
      },
    ]);

    res.json(topProductsByRegion);
  } catch (error) {
    console.error(`Error fetching top products by region (${region}):`, error);
    res.status(500).json({ error: `Failed to fetch top products for region: ${region}` });
  }
});

module.exports = router;