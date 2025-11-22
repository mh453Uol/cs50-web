/**
 * Cache Management Utility
 * Provides methods for managing service worker caches and monitoring performance
 */

export interface CacheInfo {
  version: string;
  static: number;
  api: number;
  images: number;
  fonts: number;
}

export interface CacheStats {
  cacheHits: number;
  cacheMisses: number;
  totalRequests: number;
  hitRate: number;
}

class CacheManager {
  private static instance: CacheManager;
  private cacheStats: CacheStats = {
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
    hitRate: 0
  };

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Get cache information from service worker
   */
  async getCacheInfo(): Promise<CacheInfo | null> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage(
            { type: 'CACHE_INFO' },
            [messageChannel.port2]
          );
        }
      });
    }
    return null;
  }

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE'
      });
    }
  }

  /**
   * Update service worker to latest version
   */
  async updateServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }
  }

  /**
   * Track cache hit/miss for monitoring
   */
  trackCacheAccess(hit: boolean): void {
    this.cacheStats.totalRequests++;
    if (hit) {
      this.cacheStats.cacheHits++;
    } else {
      this.cacheStats.cacheMisses++;
    }
    this.cacheStats.hitRate = this.cacheStats.cacheHits / this.cacheStats.totalRequests;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): CacheStats {
    return { ...this.cacheStats };
  }

  /**
   * Reset cache statistics
   */
  resetCacheStats(): void {
    this.cacheStats = {
      cacheHits: 0,
      cacheMisses: 0,
      totalRequests: 0,
      hitRate: 0
    };
  }

  /**
   * Check if service worker is supported
   */
  isServiceWorkerSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  /**
   * Check if app is running offline
   */
  isOffline(): boolean {
    return !navigator.onLine;
  }

  /**
   * Add event listeners for online/offline status
   */
  onConnectionChange(callback: (isOnline: boolean) => void): () => void {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }

  /**
   * Preload critical resources
   */
  async preloadCriticalResources(): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // This would typically be handled by the service worker
      // but we can trigger preloading through messages if needed
      console.log('Preloading critical resources...');
    }
  }

  /**
   * Get cache size information
   */
  async getCacheSizes(): Promise<Record<string, number>> {
    const cacheNames = await caches.keys();
    const cacheSizes: Record<string, number> = {};

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      cacheSizes[cacheName] = requests.length;
    }

    return cacheSizes;
  }
}

export default CacheManager;
