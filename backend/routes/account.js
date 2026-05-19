// backend/routes/account.js
import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { Account } from "../db.js";
import { default as mongoose } from "mongoose";

const router = Router();

router.get("/hello", (req, res) => {
  console.log("HELLO ROUTE HIT");

  res.json({
    message: "hello working",
  });
});

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

router.get("/test-email", async (req, res) => {
  try {
    console.log("TEST EMAIL ROUTE HIT");

    await sendOtpEmail("alwarujashwanth@gmail.com", "1234");

    console.log("EMAIL SENT");

    return res.json({
      message: "Email sent successfully",
    });
  } catch (err) {
    console.log("EMAIL ERROR:");
    console.log(err);

    return res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const { amount, to, otp } = req.body;

    // VALIDATE INPUTS
    if (!amount || !to || !otp) {
      return res.status(400).json({
        message: "Amount, recipient and OTP are required",
      });
    }

    // VERIFY OTP
    const otpRecord = await OTP.findOne({
      userId: req.userId,
      otp,
    });

    // INVALID OTP
    if (!otpRecord) {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    // OTP EXPIRED
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(401).json({
        message: "OTP expired",
      });
    }

    // FIND SENDER ACCOUNT
    const account = await Account.findOne({
      userId: req.userId,
    });

    if (!account) {
      return res.status(404).json({
        message: "Sender account not found",
      });
    }

    // CHECK BALANCE
    if (account.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // FIND RECEIVER ACCOUNT
    const toAccount = await Account.findOne({
      userId: to,
    });

    if (!toAccount) {
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // PREVENT SELF TRANSFER
    if (req.userId === to) {
      return res.status(400).json({
        message: "Cannot transfer to your own account",
      });
    }

    // DEBIT SENDER
    await Account.updateOne(
      {
        userId: req.userId,
      },
      {
        $inc: {
          balance: -amount,
        },
      },
    );

    // CREDIT RECEIVER
    await Account.updateOne(
      {
        userId: to,
      },
      {
        $inc: {
          balance: amount,
        },
      },
    );

    // DELETE OTP AFTER SUCCESSFUL TRANSFER
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    return res.json({
      message: "Transfer successful",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
