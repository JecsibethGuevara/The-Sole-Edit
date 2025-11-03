import * as crypto from 'crypto';

// Polyfill for global crypto
if (typeof (global as any).crypto === 'undefined') {
    (global as any).crypto = crypto;
}