// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
// Database connection
async function dbConnection() {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb://127.0.0.1:27017/ProjectOne",
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

dbConnection();
// call schema
const Contact = require("./models/Contact");

//post contact
app.post("/api/contact", async (req, res) => {
  try {
    //check for validation come from user
    const { fullName, phones = [], socialMedia = {} } = req.body;
    const contact = await Contact.create({ fullName, phones, socialMedia });
    res.json({
      success: true,
      msg: "Contact created successfully",
      data: contact,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//get contact
app.get("/api/contact", async (req, res) => {
  try {
    const contact = await Contact.find();
    const count = await Contact.countDocuments();
    res.json({
      success: true,
      msg: "Contacts fetched successfully",
      totalContacts: count,
      data: contact,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//delete contact
app.delete("/api/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        msg: "contact not found",
        data: contact,
      });
    }
    res.json({
      success: true,
      msg: "Contact deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
