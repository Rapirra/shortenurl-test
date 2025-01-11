"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickLogger = void 0;
const mongoose_1 = require("mongoose");
const ClickLoggerSchema = new mongoose_1.Schema({
    ipAddress: { type: String, required: true },
    clickedData: { type: Date, required: true },
    shortenUrlRef: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ShortUrl' },
});
exports.ClickLogger = (0, mongoose_1.model)('ClickLogger', ClickLoggerSchema);
