"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortUrl = void 0;
const mongoose_1 = require("mongoose");
const ShortUrlSchema = new mongoose_1.Schema({
    shortUrl: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    alias: {
        type: String,
        required: false,
        default: null,
        unique: true,
        maxlength: 20,
    },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    clickCount: { type: Number, default: 0 },
});
exports.ShortUrl = (0, mongoose_1.model)('ShortUrl', ShortUrlSchema);
