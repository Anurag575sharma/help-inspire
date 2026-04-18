const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const router = express.Router();
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const { sendDonationReceipt } = require("../utils/mailer");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, campaignId, donorName, donorEmail } = req.body;

    if (!donorName || !campaignId) return res.status(400).json({ error: "Name and campaign are required." });
    if (typeof donorName !== "string" || donorName.length > 100) return res.status(400).json({ error: "Invalid name." });
    if (!amount || amount < 1 || amount > 10000000) return res.status(400).json({ error: "Invalid amount." });
    if (donorEmail && (typeof donorEmail !== "string" || !donorEmail.includes("@"))) return res.status(400).json({ error: "Invalid email." });

    // Sanitize name — strip HTML tags
    const safeName = donorName.replace(/<[^>]*>/g, "").trim();

    // Check campaign exists and is not completed
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: "Campaign not found." });
    if (campaign.collectedAmount >= campaign.targetAmount) return res.status(400).json({ error: "Campaign is fully funded." });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Donation.create({
      campaignId,
      donorName: safeName,
      donorEmail: donorEmail || "",
      amount,
      razorpay_order_id: order.id,
      status: "created",
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment signature and update records
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details." });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Find donation by order ID
    const donation = await Donation.findOneAndUpdate(
      { razorpay_order_id, status: "created" },
      { razorpay_payment_id, status: "paid" },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ error: "Donation record not found." });
    }

    // Use campaignId from donation record, not from client
    const campaign = await Campaign.findByIdAndUpdate(donation.campaignId, {
      $inc: { collectedAmount: donation.amount },
    }, { new: true });

    // Send receipt email only if email provided
    if (donation.donorEmail) {
      sendDonationReceipt({
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        amount: donation.amount,
        campaignTitle: campaign.title,
        paymentId: razorpay_payment_id,
      });
    }

    res.json({ message: "Payment verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get top donors for a campaign (aggregated by name)
router.get("/donors/:campaignId", async (req, res) => {
  try {
    const donors = await Donation.aggregate([
      { $match: { campaignId: new (require("mongoose").Types.ObjectId)(req.params.campaignId), status: "paid" } },
      { $group: { _id: "$donorName", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, donorName: "$_id", amount: "$totalAmount", count: 1 } },
    ]);
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recent donations from active (non-hidden, non-completed) campaigns only
router.get("/recent-donations", async (req, res) => {
  try {
    // Get IDs of active campaigns
    const activeCampaigns = await Campaign.find({
      hidden: { $ne: true },
      $expr: { $lt: ["$collectedAmount", "$targetAmount"] },
    }).select("_id");

    const activeIds = activeCampaigns.map((c) => c._id);

    const donations = await Donation.find({ status: "paid", campaignId: { $in: activeIds } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("donorName amount createdAt campaignId")
      .populate("campaignId", "title");

    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Donation stats — active campaigns only if ?active=true
router.get("/stats", async (req, res) => {
  try {
    let match = { status: "paid" };

    if (req.query.active === "true") {
      const activeCampaigns = await Campaign.find({
        hidden: { $ne: true },
        $expr: { $lt: ["$collectedAmount", "$targetAmount"] },
      }).select("_id");
      const activeIds = activeCampaigns.map((c) => c._id);
      match.campaignId = { $in: activeIds };
    }

    const result = await Donation.aggregate([
      { $match: match },
      { $group: { _id: null, totalAmount: { $sum: "$amount" }, totalDonors: { $sum: 1 } } },
    ]);
    const stats = result[0] || { totalAmount: 0, totalDonors: 0 };
    res.json({ totalAmount: stats.totalAmount, totalDonors: stats.totalDonors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
