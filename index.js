require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

// ฟังก์ชันจัดการข้อความ
async function handleEvent(event) {
  console.log("Received event:", event);

  let replyText = "ขอโทษครับ ฉันยังไม่เข้าใจข้อความของคุณ 😅";

  if (event.type === "message") {
    switch (event.message.type) {
      case "text":
        replyText = `คุณพิมพ์ว่า: ${event.message.text}`;
        break;
      case "sticker":
        replyText = "น่ารักจังเลย! 🥰";
        break;
      case "image":
        replyText = "โอ้ว! นี่คือภาพอะไรเหรอ? 📷";
        break;
      case "video":
        replyText = "ดูวิดีโอสนุกไหม? 🎥";
        break;
      default:
        replyText = "ฉันยังไม่รองรับข้อความประเภทนี้ 😅";
    }
  }

  return client.replyMessage(event.replyToken, { type: "text", text: replyText });
}

// Webhook Handler
app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    await Promise.all(events.map(handleEvent));
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Health Check Endpoint
app.get("/", (req, res) => {
  res.send("LINE Bot is running!");
});

// Start Server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
