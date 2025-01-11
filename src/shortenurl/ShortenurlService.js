'use strict';
var __awaiter =
 (this && this.__awaiter) ||
 function (thisArg, _arguments, P, generator) {
  function adopt(value) {
   return value instanceof P
    ? value
    : new P(function (resolve) {
       resolve(value);
      });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
   function fulfilled(value) {
    try {
     step(generator.next(value));
    } catch (e) {
     reject(e);
    }
   }

   function rejected(value) {
    try {
     step(generator['throw'](value));
    } catch (e) {
     reject(e);
    }
   }

   function step(result) {
    result.done
     ? resolve(result.value)
     : adopt(result.value).then(fulfilled, rejected);
   }

   step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
 };
var __importDefault =
 (this && this.__importDefault) ||
 function (mod) {
  return mod && mod.__esModule ? mod : { default: mod };
 };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ShortenUrlService = void 0;
const node_crypto_1 = __importDefault(require('node:crypto'));

class ShortenurlService {
 createShortenedUrl(body) {
  return __awaiter(this, void 0, void 0, function* () {
   const { alias, originalUrl, expiresAt } = body;
   if (alias && alias.length > 20) {
    throw new Error('Alias must be less than 20 characters');
   }
   if (alias) {
    const existingAlias = yield shortenurl_entity_1.ShortUrl.findOne({ alias });
    if (existingAlias) {
     throw new Error('Alias is already exists');
    }
   }
   const hashedUrl = node_crypto_1.default
    .createHash('sha256')
    .update(originalUrl)
    .digest('hex');
   const shortenUrl = hashedUrl.substring(0, 6);
   const shortUrl = new shortenurl_entity_1.ShortUrl({
    originalUrl,
    shortenUrl,
    alias,
    createdAt: new Date().getTime(),
    expiresAt,
    clickCount: 0,
   });
   yield shortUrl.save();
   return { shortenUrl };
  });
 }

 redirectToOriginalUrl(shortUrl, ipAddress) {
  return __awaiter(this, void 0, void 0, function* () {
   const currentTime = new Date().getTime();
   try {
    const urlInfo = yield shortenurl_entity_1.ShortUrl.findOne({
     shortUrl: shortUrl,
    });
    if (!urlInfo) {
     throw new Error('Page not found');
    }
    if (currentTime > urlInfo.expiresAt.getTime()) {
     throw new Error('Gone');
    }
    yield shortenurl_entity_1.ShortUrl.findOneAndUpdate(
     {
      shortUrl: shortUrl,
     },
     { clickCount: urlInfo.clickCount + 1 }
    );
    const clickLog = new clicked_entity_1.ClickLogger({
     shortUrl: urlInfo._id,
     clickedAt: new Date(),
     ipAddress: ipAddress,
    });
    yield clickLog.save();
    return urlInfo.originalUrl;
   } catch (err) {
    throw err;
   }
  });
 }

 getShortenUrlInfo(shortUrl) {
  return __awaiter(this, void 0, void 0, function* () {
   try {
    const urlInfo = yield shortenurl_entity_1.ShortUrl.findOne({
     shortUrl: shortUrl,
    });
    if (!urlInfo) {
     throw new Error('Page not found');
    }
    return urlInfo;
   } catch (err) {
    throw err;
   }
  });
 }

 deleteShortenUrl(shortUrl) {
  return __awaiter(this, void 0, void 0, function* () {
   try {
    const result = yield shortenurl_entity_1.ShortUrl.deleteOne({ shortUrl });
    if (result.deletedCount === 0) {
     throw new Error('Shorten URL has not been deleted');
    }
    return { message: 'Shorten URL has been deleted' };
   } catch (err) {
    throw err;
   }
  });
 }

 getAnalyticsByShortenUrl(shortUrl) {
  return __awaiter(this, void 0, void 0, function* () {
   try {
    const urlInfo = yield shortenurl_entity_1.ShortUrl.findOne({
     shortUrl: shortUrl,
    }).exec();
    if (!urlInfo) throw new Error('Url not found');
    if (urlInfo) {
     const lastClickedIpAddresses = yield clicked_entity_1.ClickLogger.find({
      shortUrl: urlInfo._id,
     })
      .sort({ clickedAt: -1 })
      .limit(5)
      .select('ipAddress');
     return { clickCountByUrl: urlInfo.clickCount, lastClickedIpAddresses };
    }
   } catch (err) {
    throw err;
   }
  });
 }
}

exports.ShortenUrlService = ShortenurlService;
