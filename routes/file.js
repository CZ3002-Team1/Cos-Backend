const express = require("express");
const router = express.Router();
require("dotenv").config();

const AWS = require("aws-sdk");

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
 * api/file/uploadFile:
 *   post:
 *     summary: Upload image to AWS S3.
 *     tags: [File]
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

module.exports = router;
