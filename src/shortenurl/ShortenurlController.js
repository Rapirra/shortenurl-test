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
Object.defineProperty(exports, '__esModule', { value: true });
exports.ShortenUrlController = void 0;
const express_1 = require('express');

class ShortenurlController {
 constructor(shortenUrlService) {
  this.service = shortenUrlService;
  this.router = (0, express_1.Router)();
  this.router.post('/shorten', this.createShortenUrl.bind(this));
  this.router.get('/:shortUrl', this.redirectToOriginalUrl.bind(this));
  this.router.get('/info/:shortenUrl', this.getShortenUrlInfo.bind(this));
  this.router.get(' /delete/:shortenUrl', this.deleteShortenUrl.bind(this));
  this.router.get(
   '/analytics:shortenUrl',
   this.getAnalyticsByShortenUrl.bind(this)
  );
 }

 createShortenUrl(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
   const body = req.body;
   try {
    const { shortenUrl } = yield this.service.createShortenedUrl(body);
    return res.status(201).json({ shortenUrl });
   } catch (error) {
    if (error instanceof Error) {
     return res.status(400).json({ message: error.message });
    }
   }
  });
 }

 redirectToOriginalUrl(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
   const { shortUrl } = req.params;
   const ipAddress = req.ip;
   try {
    const originalUrl = yield this.service.redirectToOriginalUrl(
     shortUrl,
     ipAddress
    );
    return res.status(301).redirect(originalUrl);
   } catch (error) {
    if (error instanceof Error) {
     if (error.message === 'Page not found') {
      return res.status(404).json({ message: 'Page not found' });
     } else if (error.message === 'Gone') {
      return res.status(410).json({ message: 'Gone' });
     }
    }
   }
  });
 }

 getShortenUrlInfo(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
   const { shortUrl } = req.params;
   try {
    const urlInfo = yield this.service.getShortenUrlInfo(shortUrl);
    return res.status(200).json({ urlInfo });
   } catch (error) {
    if (error instanceof Error) {
     if (error.message === 'Page not found') {
      return res.status(404).json({ message: 'Page not found' });
     }
    }
   }
  });
 }

 deleteShortenUrl(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
   const { shortUrl } = req.params;
   try {
    yield this.service.deleteShortenUrl(shortUrl);
    return res
     .status(200)
     .json({ message: 'Shorten Url deleted successfully' });
   } catch (error) {
    if (error instanceof Error) {
     return res.status(400).json({ message: error.message });
    }
   }
  });
 }

 getAnalyticsByShortenUrl(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
   const { shortUrl } = req.params;
   try {
    const receivedData = yield this.service.getAnalyticsByShortenUrl(shortUrl);
    return res.status(200).json(receivedData);
   } catch (error) {
    if (error instanceof Error) {
     return res.status(400).json({ message: error.message });
    }
   }
  });
 }
}

exports.ShortenUrlController = ShortenurlController;
