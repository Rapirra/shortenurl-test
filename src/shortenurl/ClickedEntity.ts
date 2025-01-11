import { model, Schema } from 'mongoose';

const ClickLoggerSchema = new Schema({
 ipAddress: { type: String, required: true },
 clickedAt: { type: Date, required: true },
 shortenUrlRef: {
  type: Schema.Types.ObjectId,
  ref: 'ShortUrl',
  required: true,
 },
});

export const ClickLogger = model('ClickLogger', ClickLoggerSchema);
