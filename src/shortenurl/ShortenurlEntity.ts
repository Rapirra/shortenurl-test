import { model, Schema } from 'mongoose';

const ShortUrlSchema = new Schema({
 shortUrl: { type: String, required: true, unique: true },
 originalUrl: { type: String, required: true },
 alias: {
  type: String,
  required: false,
  default: null,
  maxlength: 20,
 },
 expiresAt: { type: Date, required: true },
 createdAt: { type: Date, default: Date.now },
 clickCount: { type: Number, default: 0 },
 clickLogger: [{ type: Schema.Types.ObjectId, ref: 'ClickLogger' }],
});

export const ShortUrl = model('ShortUrl', ShortUrlSchema);
