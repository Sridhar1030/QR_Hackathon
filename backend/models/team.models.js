import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    ],
    isSelected: {
      type: Boolean,
      default: false,
    },
    hasPaid: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailSent: {
      type: String,
      enum: ["Not Sent", "Sent", "Selected"], // example statuses
      default: "Not Sent",
    }
  },
  {
    timestamps: true,
  }
);

// Optional: populate leader and members when fetching
// teamSchema.pre(/^find/, function(next) {
//   this.populate("leader", "username email teamName")
//       .populate("members", "username email teamName");
//   next();
// });

export const Team = mongoose.model("Team", teamSchema);
