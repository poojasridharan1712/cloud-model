const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
