const express = require("express");
const router = express.Router();
const Event = require("../model/Event");
require("dotenv").config();
const upload = require("express-fileupload");

const AWS = require("aws-sdk");

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const uploadFile = async (file) => {
  // const { createReadStream, filename } = await file;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: file.data,
    Key: `fileupload/scanskill-${Date.now()}-${file.name}`,
  };

  try {
    const data = await s3.upload(uploadParams).promise();
    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * @swagger
 * api/event/uploadFile:
 *   post:
 *     summary: Upload image to AWS S3.
 *     tags: [Event]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               File:
 *                 type: string
 *                 description: Put the entire file here
 *     responses:
 *       200:
 *         description: File uploaded successfully. Returns url of image
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
 *                 photoUrl:
 *                   type: string
 *
 *       400:
 *         description: Erorr with file upload
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
router.post("/uploadFile", async (req, res) => {
  try {
    const data = await uploadFile(req.files.File);

    res.json({
      success: true,
      photoUrl: data.Location,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err,
    });
  }
});

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
