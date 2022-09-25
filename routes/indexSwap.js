const express = require("express");
const router = express.Router();
const IndexSwap = require("../model/IndexSwap");

/**
 * @swagger
 * api/indexSwap:
 *   post:
 *     summary: Create a new index swap request.
 *     tags: [IndexSwap]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               StudentName:
 *                 type: string
 *               ModuleName:
 *                 type: string
 *               ModuleCode:
 *                 type: string
 *               HaveIndex:
 *                 type: string
 *               WantIndex:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               TeleHandle:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                       _id:
 *                         type: string
 *                       StudentName:
 *                         type: string
 *                       ModuleName:
 *                         type: string
 *                       ModuleCode:
 *                         type: string
 *                       HaveIndex:
 *                         type: string
 *                       WantIndex:
 *                         type: string
 *                       PhoneNumber:
 *                         type: string
 *                       TeleHandle:
 *                         type: string
 *       400:
 *         description: Index Swap Request already exists.
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
router.post("/", async (req, res) => {
  const indexSwapData = req.body;

  const findDuplicate = await IndexSwap.findOne({
    StudentName: indexSwapData.StudentName,
    ModuleName: indexSwapData.ModuleName,
    ModuleCode: indexSwapData.ModuleCode,
    HaveIndex: indexSwapData.HaveIndex,
    WantIndex: indexSwapData.WantIndex,
  });

  if (findDuplicate) {
    res.json({
      success: false,
      message: "Index Swap request already exists",
    });
    return;
  }

  const indexSwap = new IndexSwap(indexSwapData);
  await indexSwap.save();

  res.json({
    success: true,
    message: "Index Swap Request created successfully",
    data: indexSwap,
  });
});

/**
 * @swagger
 * api/indexSwap/:id:
 *   put:
 *     summary: Update existing index swap request.
 *     tags: [IndexSwap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the index swap to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               StudentName:
 *                 type: string
 *               ModuleName:
 *                 type: string
 *               ModuleCode:
 *                 type: string
 *               HaveIndex:
 *                 type: string
 *               WantIndex:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               TeleHandle:
 *                 type: string
 *     responses:
 *       201:
 *         description: Updated Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                       _id:
 *                         type: string
 *                       StudentName:
 *                         type: string
 *                       ModuleName:
 *                         type: string
 *                       ModuleCode:
 *                         type: string
 *                       HaveIndex:
 *                         type: string
 *                       WantIndex:
 *                         type: string
 *                       PhoneNumber:
 *                         type: string
 *                       TeleHandle:
 *                         type: string
 *       400:
 *         description: Index Swap Request already exists.
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
router.put("/:id", async (req, res) => {
  const indexSwapData = req.body;

  const findDuplicate = await IndexSwap.findOne({
    StudentName: indexSwapData.StudentName,
    ModuleName: indexSwapData.ModuleName,
    ModuleCode: indexSwapData.ModuleCode,
    HaveIndex: indexSwapData.HaveIndex,
    WantIndex: indexSwapData.WantIndex,
  });

  if (findDuplicate) {
    res.json({
      success: false,
      message: "Index Swap request already exists",
    });
    return;
  }

  const updatedIndex = await IndexSwap.findOneAndUpdate(
    { _id: req.params.id },
    indexSwapData,
    {
      new: true,
    }
  );

  res.json({
    success: true,
    message: "Index Swap Request updated successfully",
    data: updatedIndex,
  });
});

/**
 * @swagger
 * api/indexSwap:
 *   get:
 *     summary: Get all index swap requests.
 *     tags: [IndexSwap]
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
 *                       StudentName:
 *                         type: string
 *                       ModuleName:
 *                         type: string
 *                       ModuleCode:
 *                         type: string
 *                       HaveIndex:
 *                         type: string
 *                       WantIndex:
 *                         type: string
 *                       PhoneNumber:
 *                         type: string
 *                       TeleHandle:
 *                         type: string
 *       404:
 *         description: No index swap requests found.
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
router.get("/", async (req, res) => {
  const indexSwaps = await IndexSwap.find({});
  if (indexSwaps.length === 0) {
    res.json({
      success: false,
      message: "No index swap requests found",
    });
  } else {
    res.json({
      success: true,
      message: "Index swap requests found",
      data: indexSwaps,
    });
  }
});

/**
 * @swagger
 * api/indexSwap/:id:
 *   delete:
 *     summary: Delete index swap requests.
 *     tags: [IndexSwap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the index swap to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted Successfully.
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
 *
 *       404:
 *         description: No index swap request found.
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
router.delete("/:id", async (req, res) => {
  const exists = await IndexSwap.findOne({ _id: req.params.id });
  if (!exists) {
    res.json({
      success: false,
      message: "No such index swap request exists",
    });
    return;
  }

  await IndexSwap.deleteOne({ _id: req.params.id });

  res.json({
    success: true,
    message: "Index swap requests deleted successfully",
  });
});

module.exports = router;
