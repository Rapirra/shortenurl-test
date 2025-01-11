export interface IShortenUrlReq {
 originalUrl: string;
 expiresAt: Date;
 alias?: string;
}
