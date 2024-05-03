import * as crypto from 'crypto';

export function generateHeader(): { [key: string]: string } {
     const key: string = process.env.ACCURATE_KEY || 'GXvV5sHWBkXZwYOnBmmcr6QhnVVeQy2Whu9Aa0ubZ66A0ONRPjzGYbKZbfR5hRuc';
     const timestamp: string =new Date().toISOString();
     const hmac: string = generateHmac(key, timestamp);
     const headers: { [key: string]: string } = {
         'Authorization': 'Bearer '+ process.env.ACCURATE_TOKEN,
         'X-Api-Timestamp': timestamp,
         'X-Api-Signature': hmac,
         'X-Session-ID': process.env.ACCURATE_DB || '1219052',
     };
     return headers;
}
function generateHmac(key: string, timestamp: string): string {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(timestamp);
    return hmac.digest('base64');
}