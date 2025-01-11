import { Router } from 'express';
import { ShortenurlController } from './ShortenurlController';
import { ShortenUrlService } from './ShortenurlService';

export default class ShortenUrlRoutes {
 router: Router;
 controller: ShortenurlController;

 constructor() {
  this.router = Router();
  this.controller = new ShortenurlController(new ShortenUrlService());

  this.router.post('/shorten', this.controller.createShortenUrl);

  this.router.get('/:shortUrl', this.controller.redirectToOriginalUrl);
  this.router.get('/info/:shortUrl', this.controller.getShortenUrlInfo);
  this.router.delete('/delete/:shortUrl', this.controller.deleteShortenUrl);
  this.router.get(
   '/analytics/:shortUrl',
   this.controller.getAnalyticsByShortenUrl
  );
 }
}
