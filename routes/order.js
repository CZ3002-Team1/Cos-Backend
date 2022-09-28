const express = require("express");
const router = express.Router();
const Order = require("../model/Order");
require("dotenv").config();

/**
 * @swagger
 * api/order/:email:
 *   get:
 *     summary: Get all orders by user email.
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email of user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       Email:
 *                         type: string
 *                       Status:
 *                         type: string
 *                       DateCreated:
 *                         type: string
 *                         format: date
 *                       Items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             Name:
 *                               type: string
 *                             Quantity:
 *                               type: number
 *                             Price:
 *                               type: number
 *
 *
 *       404:
 *         description: No orders found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
router.get("/:email", async (req, res) => {
  const orders = await Order.find({
    Email: req.params.email,
  });
  if (orders.length === 0) {
    res.json({
      success: false,
      message: "No orders found",
    });
  } else {
    res.json({
      success: true,
      message: "Orders found",
      data: orders,
    });
  }
});

module.exports = router;
