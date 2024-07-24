import crypto from 'crypto';

export function generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length * 2);
}

export function generateRandomLargeInteger(): number {
    const id = Date.now();
    return id;
}