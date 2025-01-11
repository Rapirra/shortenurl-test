import { IShortenUrlReq } from './types';
import { ShortUrl } from './ShortenurlEntity';
import * as crypto from 'node:crypto';
import { ClickLogger } from './ClickedEntity';

export class ShortenUrlService {
 constructor() {}

 async createShortenedUrl(body: IShortenUrlReq) {
  const { alias, originalUrl, expiresAt } = body;

  if (alias && alias.length > 20) {
   throw new Error('Alias must be less than 20 characters');
  }

  if (alias) {
   const existingAlias = await ShortUrl.findOne({ alias });
   if (existingAlias) {
    throw new Error('Alias is already exists');
   }
  }

  const hashedUrl = crypto
   .createHash('sha256')
   .update(originalUrl)
   .digest('hex');
  const shortenUrl = hashedUrl.substring(0, 6);

  const shortUrl = new ShortUrl({
   originalUrl,
   shortUrl: shortenUrl,
   alias,
   createdAt: new Date().getTime(),
   expiresAt,
   clickCount: 0,
  });

  await shortUrl.save();
  return { shortenUrl };
 }

 async redirectToOriginalUrl(shortUrl: string, ipAddress: string) {
  const currentTime = new Date().getTime();
  try {
   const urlInfo = await ShortUrl.findOne({
    shortUrl: shortUrl,
   });
   console.log();

   if (!urlInfo) {
    throw new Error('Page not found');
   }

   if (currentTime > urlInfo.expiresAt.getTime()) {
    throw new Error('Gone');
   }

   await ShortUrl.findOneAndUpdate(
    {
     shortUrl: shortUrl,
    },
    { clickCount: urlInfo.clickCount + 1 }
   );

   const clickLog = new ClickLogger({
    shortenUrlRef: urlInfo._id,
    clickedAt: new Date().getTime(),
    ipAddress: ipAddress,
   });

   await clickLog.save();
   return urlInfo.originalUrl;
  } catch (err) {
   throw err;
  }
 }

 async getShortenUrlInfo(shortUrl: string) {
  try {
   const urlInfo = await ShortUrl.findOne({
    shortUrl: shortUrl,
   });

   if (!urlInfo) {
    throw new Error('Page not found');
   }

   return urlInfo;
  } catch (err) {
   throw err;
  }
 }

 async deleteShortenUrl(shortUrl: string) {
  try {
   const result = await ShortUrl.deleteOne({ shortUrl });

   if (result.deletedCount === 0) {
    throw new Error('Shorten URL has not been deleted');
   }

   return { message: 'Shorten URL has been deleted' };
  } catch (err) {
   throw err;
  }
 }

 async getAnalyticsByShortenUrl(shortUrl: string) {
  try {
   const urlInfo = await ShortUrl.findOne({
    shortUrl: shortUrl,
   }).exec();
   if (!urlInfo) throw new Error('Url not found');
   if (urlInfo) {
    const lastClickedIpAddresses = await ClickLogger.find({
     shortenUrlRef: urlInfo._id,
    })
     .sort({ clickedAt: -1 })
     .limit(5)
     .select('ipAddress');

    return { clickCountByUrl: urlInfo.clickCount, lastClickedIpAddresses };
   }
  } catch (err) {
   throw err;
  }
 }
}
