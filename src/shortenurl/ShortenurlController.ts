import { ShortenUrlService } from './ShortenurlService';
import { IShortenUrlReq } from './types';

export class ShortenurlController {
 public service: ShortenUrlService;

 constructor(service: ShortenUrlService) {
  this.service = service;
  
  this.createShortenUrl = this.createShortenUrl.bind(this);
  this.getShortenUrlInfo = this.getShortenUrlInfo.bind(this);
  this.deleteShortenUrl = this.deleteShortenUrl.bind(this);
  this.getAnalyticsByShortenUrl = this.getAnalyticsByShortenUrl.bind(this);
  this.redirectToOriginalUrl = this.redirectToOriginalUrl.bind(this);
 }

 async createShortenUrl(req: any, res: any) {
  const body = req.body as IShortenUrlReq;

  try {
   const { shortenUrl } = await this.service.createShortenedUrl(body);
   return res.status(201).json({ shortenUrl });
   // return res.send({ message: 'Shorten URL has been created' });
  } catch (error) {
   if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
   }
  }
 }

 async redirectToOriginalUrl(req: any, res: any) {
  const { shortUrl } = req.params;
  const ipAddress = req.ip;

  try {
   const originalUrl = await this.service.redirectToOriginalUrl(
    shortUrl,
    ipAddress
   );
   console.log('originalUrl', originalUrl);
   return res.status(200).json(originalUrl);
   // return res.status(301).redirect(originalUrl);
  } catch (error) {
   if (error instanceof Error) {
    if (error.message === 'Page not found') {
     return res.status(404).json({ message: 'Page not found' });
    } else if (error.message === 'Gone') {
     return res.status(410).json({ message: 'Gone' });
    }
   }
  }
 }

 async getShortenUrlInfo(req: any, res: any) {
  const { shortUrl } = req.params;

  try {
   const urlInfo = await this.service.getShortenUrlInfo(shortUrl);
   return res.status(200).json({ urlInfo });
  } catch (error) {
   if (error instanceof Error) {
    if (error.message === 'Page not found') {
     return res.status(404).json({ message: 'Page not found' });
    }
   }
  }
 }

 async deleteShortenUrl(req: any, res: any) {
  const { shortUrl } = req.params;
  try {
   await this.service.deleteShortenUrl(shortUrl);
   return res.status(200).json({ message: 'Shorten Url deleted successfully' });
  } catch (error) {
   if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
   }
  }
 }

 async getAnalyticsByShortenUrl(req: any, res: any) {
  const { shortUrl } = req.params;
  try {
   const receivedData = await this.service.getAnalyticsByShortenUrl(shortUrl);

   return res.status(200).json(receivedData);
  } catch (error) {
   if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
   }
  }
 }
}
