const express = require("express");
const router = express.Router();
const Event = require("../model/Event");
require("dotenv").config();

/**
 * @swagger
 * api/event:
 *   post:
 *     summary: Create a new event.
 *     tags: [Event]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Description:
 *                 type: string
 *               StartDate:
 *                 type: string
 *                 format: date
 *               EndDate:
 *                 type: string
 *                 format: date
 *               Time:
 *                 type: string
 *               PhotoUrl:
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
 *         description: Event Name already exists.
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
  const eventData = req.body;

  const duplicateName = await Event.findOne({
    Name: eventData.Name,
  });

  if (duplicateName) {
    res.json({
      success: false,
      message: "Event Name already exists",
    });

    return;
  }

  const event = new Event(eventData);
  await event.save();

  res.json({
    success: true,
    message: "Event created successfully",
    data: event,
  });
});

/**
 * @swagger
 * api/event/:id:
 *   put:
 *     summary: Update event.
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the event to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Description:
 *                 type: string
 *               StartDate:
 *                 type: string
 *                 format: date
 *               EndDate:
 *                 type: string
 *                 format: date
 *               Time:
 *                 type: string
 *               PhotoUrl:
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
 *         description: Event Name already exists.
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
  const eventData = req.body;

  const oldEvent = await Event.findOne({ _id: req.params.id });

  if (eventData.Name !== oldEvent.Name) {
    const duplicateName = await Event.findOne({
      Name: eventData.Name,
    });

    if (duplicateName) {
      res.json({
        success: false,
        message: "Event Name already exists",
      });

      return;
    }
  }

  const updatedEvent = await Event.findOneAndUpdate(
    { _id: req.params.id },
    eventData,
    {
      new: true,
    }
  );

  res.json({
    success: true,
    message: "Event updated successfully",
    data: updatedEvent,
  });
});

/**
 * @swagger
 * api/event:
 *   get:
 *     summary: Get all events.
 *     tags: [Event]
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
 *                       Name:
 *                         type: string
 *                       Description:
 *                         type: string
 *                       StartDate:
 *                         type: string
 *                         format: date
 *                       EndDate:
 *                         type: string
 *                         format: date
 *                       Time:
 *                         type: string
 *                       PhotoUrl:
 *                         type: string
 *
 *       404:
 *         description: No events found.
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
  const events = await Event.find({});
  if (events.length === 0) {
    res.json({
      success: false,
      message: "No events found",
    });
  } else {
    res.json({
      success: true,
      message: "Events found",
      data: events,
    });
  }
});

/**
 * @swagger
 * api/event/:id:
 *   delete:
 *     summary: Delete event.
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the event to delete.
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
 *         description: No event found.
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
  const exists = await Event.findOne({ _id: req.params.id });
  if (!exists) {
    res.json({
      success: false,
      message: "No such event exists",
    });
    return;
  }

  await Event.deleteOne({ _id: req.params.id });

  res.json({
    success: true,
    message: "Index swap requests deleted successfully",
  });
});

module.exports = router;
