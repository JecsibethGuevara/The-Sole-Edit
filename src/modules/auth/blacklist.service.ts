// src/auth/simple-blacklist.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistService {
    private blacklistedTokens = new Set<string>();

    addToBlacklist(token: string): void {
        this.blacklistedTokens.add(token);
    }

    isBlacklisted(token: string): boolean {
        return this.blacklistedTokens.has(token);
    }
    removeFromBlacklist(token: string): void {
        this.blacklistedTokens.delete(token);
    }

    getBlacklistSize(): number {
        return this.blacklistedTokens.size;
    }
}