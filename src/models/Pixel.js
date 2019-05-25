import mongoose from 'mongoose';

const mongooseHidden = require('mongoose-hidden')();

const { Schema } = mongoose;

const pixelSchema = new Schema({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  weblink: {
    type: String,
    required: true
  },
  color: {
    type: String
  }
});

// This will remove `_id` and `__v`
pixelSchema.plugin(mongooseHidden);

pixelSchema.statics.isPurchased = async function({ x, y }) {
  const pixels = await this.find({ x, y }).limit(1);

  if (!pixels || pixels.length === 0) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

export default mongoose.model('Pixel', pixelSchema);
