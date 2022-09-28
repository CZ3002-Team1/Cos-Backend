const express = require("express");
const router = express.Router();
const Merch = require("../model/Merch");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const sendMail = async (subject, text, receiverEmail) => {
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PW,
    },
  });

  const mailDetails = {
    from: process.env.GMAIL_USER,
    to: receiverEmail,
    subject: subject,
    html: text,
  };

  try {
    await mailTransporter.sendMail(mailDetails);
  } catch (err) {
    console.log(err);
  }
};

/**
 * @swagger
 * api/merch:
 *   post:
 *     summary: Create a new merch.
 *     tags: [Merch]
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
 *               Size:
 *                 type: string
 *               Price:
 *                 type: number
 *               Quantity:
 *                 type: number
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
 *                       Name:
 *                         type: string
 *                       Description:
 *                         type: string
 *                       Size:
 *                         type: string
 *                       Price:
 *                         type: number
 *                       Quantity:
 *                         type: number
 *                       PhotoUrl:
 *                         type: string
 *       400:
 *         description: Merch Name already exists.
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
  const merchData = req.body;

  const duplicateName = await Merch.findOne({
    Name: merchData.Name,
  });

  if (duplicateName) {
    res.json({
      success: false,
      message: "Merch Name already exists",
    });

    return;
  }

  const merch = new Merch(merchData);
  await merch.save();

  res.json({
    success: true,
    message: "Merch created successfully",
    data: merch,
  });
});

/**
 * @swagger
 * api/merch/:id:
 *   put:
 *     summary: Update merch.
 *     tags: [Merch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the merch to update.
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
 *               Size:
 *                 type: string
 *               Price:
 *                 type: number
 *               Quantity:
 *                 type: number
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
 *                       Name:
 *                         type: string
 *                       Description:
 *                         type: string
 *                       Size:
 *                         type: string
 *                       Price:
 *                         type: number
 *                       Quantity:
 *                         type: number
 *                       PhotoUrl:
 *                         type: string
 *       400:
 *         description: Merch Name already exists.
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
  const merchData = req.body;

  const oldMerch = await Merch.findOne({ _id: req.params.id });

  if (merchData.Name !== oldMerch.Name) {
    const duplicateName = await Merch.findOne({
      Name: merchData.Name,
    });

    if (duplicateName) {
      res.json({
        success: false,
        message: "Merch Name already exists",
      });

      return;
    }
  }

  const updatedMerch = await Merch.findOneAndUpdate(
    { _id: req.params.id },
    merchData,
    {
      new: true,
    }
  );

  res.json({
    success: true,
    message: "Merch updated successfully",
    data: updatedMerch,
  });
});

/**
 * @swagger
 * api/merch:
 *   get:
 *     summary: Get all merches.
 *     tags: [Merch]
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
 *                       Size:
 *                         type: string
 *                       Price:
 *                         type: number
 *                       Quantity:
 *                         type: number
 *                       PhotoUrl:
 *                         type: string
 *
 *       404:
 *         description: No merches found.
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
  const merches = await Merch.find({});
  if (merches.length === 0) {
    res.json({
      success: false,
      message: "No merches found",
    });
  } else {
    res.json({
      success: true,
      message: "Merches found",
      data: merches,
    });
  }
});

/**
 * @swagger
 * api/merch/:id:
 *   delete:
 *     summary: Delete merch.
 *     tags: [Merch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the merch to delete.
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
 *         description: No merch found.
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
  const exists = await Merch.findOne({ _id: req.params.id });
  if (!exists) {
    res.json({
      success: false,
      message: "No such merch exists",
    });
    return;
  }

  await Merch.deleteOne({ _id: req.params.id });

  res.json({
    success: true,
    message: "Merch deleted successfully",
  });
});

/**
 * @swagger
 * api/merch/createCheckoutSession:
 *   post:
 *     summary: Create Stripe Session and return link
 *     tags: [Merch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Items:
 *                 type: array
 *                 items:
 *                     type: object
 *                     properties:
 *                       Id:
 *                         type: string
 *                       Quantity:
 *                         type: number
 *               Email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Created Session Successfully.
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
 *                 url:
 *                   type: string
 *
 *       404:
 *         description: Error with Stripe
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
router.post("/createCheckoutSession", async (req, res) => {
  const data = [];
  await Promise.all(
    req.body.Items.map(async (item) => {
      const merch = await Merch.findOne({
        _id: item.Id,
      });

      data.push({
        Name: merch.Name,
        Price: merch.Price,
        BuyQuantity: item.Quantity,
      });
    })
  );

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.body.Email,
      line_items: data.map((item) => {
        return {
          price_data: {
            currency: "sgd",
            product_data: {
              name: item.Name,
            },
            unit_amount: item.Price * 100,
          },
          quantity: item.BuyQuantity,
        };
      }),
      //   success_url: `${process.env.CLIENT_URL}/success.html`,
      //   cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      success_url: `http://google.com`,
      cancel_url: `http://google.com`,
    });
    res.json({
      success: true,
      message: "Successful",
      url: session.url,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err,
    });
  }
});

router.post(
  "/stripeWebHook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const event = req.body;

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const id = event.data.object.id;

        const session = await stripe.checkout.sessions.retrieve(id, {
          expand: ["line_items"],
        });

        const data = session.line_items.data;

        let receipt = "";
        let total_amount = 0;
        data.map((d) => {
          total_amount += (d.price.unit_amount / 100) * d.quantity;
          receipt += `<p>${d.quantity} x ${d.description} ($${
            d.price.unit_amount / 100
          })</p>`;
        });
        receipt += `<p>Total Amount: $${total_amount}</p>`;

        const subject = "Confirmation of Payment of Merchandise";
        const text = `
                        <div
                            class="container"
                            style="max-width: 90%; margin: auto; padding-top: 20px"
                        >
                            <h2>Welcome to COS.</h2>
                            <h4>You have succesfully completed a purchase with us!</h4>
                            <p>Here are the details</p>
                            ${receipt}
                    </div>`;

        await sendMail(subject, text, session.customer_email);

        await Promise.all(
          data.map(async (d) => {
            await Merch.findOneAndUpdate(
              {
                Name: d.description,
              },
              {
                $inc: {
                  Quantity: -d.quantity,
                },
              }
            );
          })
        );

        res.send("Successful");
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
);

module.exports = router;
