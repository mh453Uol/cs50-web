import React, { useEffect, useState } from 'react';
import CacheManager from '../../utils/cacheManager';
import { CacheInfo, CacheStats } from '../../utils/cacheManager';

const CacheInfoComponent: React.FC = () => {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheSizes, setCacheSizes] = useState<Record<string, number>>({});

  const cacheManager = CacheManager.getInstance();

  useEffect(() => {
    // Set up connection monitoring
    const cleanup = cacheManager.onConnectionChange(setIsOnline);

    // Load initial cache info
    loadCacheInfo();
    loadCacheSizes();

    // Update stats every 5 seconds
    const statsInterval = setInterval(() => {
      setCacheStats(cacheManager.getCacheStats());
    }, 5000);

    return () => {
      cleanup();
      clearInterval(statsInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCacheInfo = async () => {
    const info = await cacheManager.getCacheInfo();
    setCacheInfo(info);
  };

  const loadCacheSizes = async () => {
    const sizes = await cacheManager.getCacheSizes();
    setCacheSizes(sizes);
  };

  const handleClearCache = async () => {
    await cacheManager.clearAllCaches();
    await loadCacheInfo();
    await loadCacheSizes();
    cacheManager.resetCacheStats();
  };

  const handleUpdateServiceWorker = async () => {
    await cacheManager.updateServiceWorker();
    setTimeout(loadCacheInfo, 1000); // Reload info after update
  };

  const handlePreloadResources = async () => {
    await cacheManager.preloadCriticalResources();
  };

  return (
    <div className="cache-info-container p-4 bg-light border rounded">
      <h3>Cache Management</h3>
      
      {/* Connection Status */}
      <div className="mb-3">
        <strong>Connection Status: </strong>
        <span className={isOnline ? 'text-success' : 'text-danger'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Cache Information */}
      {cacheInfo && (
        <div className="mb-3">
          <h5>Cache Information</h5>
          <p><strong>Version:</strong> {cacheInfo.version}</p>
          <div className="row">
            <div className="col">
              <small>Static: {cacheInfo.static}</small>
            </div>
            <div className="col">
              <small>API: {cacheInfo.api}</small>
            </div>
            <div className="col">
              <small>Images: {cacheInfo.images}</small>
            </div>
            <div className="col">
              <small>Fonts: {cacheInfo.fonts}</small>
            </div>
          </div>
        </div>
      )}

      {/* Cache Statistics */}
      {cacheStats && (
        <div className="mb-3">
          <h5>Cache Statistics</h5>
          <p>
            Hit Rate: <strong>{(cacheStats.hitRate * 100).toFixed(1)}%</strong>
          </p>
          <div className="progress mb-2">
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${cacheStats.hitRate * 100}%` }}
            ></div>
          </div>
          <small>
            Hits: {cacheStats.cacheHits} | 
            Misses: {cacheStats.cacheMisses} | 
            Total: {cacheStats.totalRequests}
          </small>
        </div>
      )}

      {/* Cache Sizes */}
      {Object.keys(cacheSizes).length > 0 && (
        <div className="mb-3">
          <h5>Cache Sizes</h5>
          {Object.entries(cacheSizes).map(([cacheName, size]) => (
            <div key={cacheName} className="d-flex justify-content-between">
              <span className="text-truncate" style={{ maxWidth: '200px' }}>
                {cacheName}
              </span>
              <span>{size} items</span>
            </div>
          ))}
        </div>
      )}

      {/* Control Buttons */}
      <div className="btn-group" role="group">
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={loadCacheInfo}
        >
          Refresh Info
        </button>
        
        <button 
          className="btn btn-outline-warning btn-sm"
          onClick={handleUpdateServiceWorker}
        >
          Update Service Worker
        </button>
        
        <button 
          className="btn btn-outline-info btn-sm"
          onClick={handlePreloadResources}
        >
          Preload Resources
        </button>
        
        <button 
          className="btn btn-outline-danger btn-sm"
          onClick={handleClearCache}
        >
          Clear Cache
        </button>
      </div>

      {/* Service Worker Support */}
      <div className="mt-3">
        <small className="text-muted">
          Service Worker Support: {cacheManager.isServiceWorkerSupported() ? '✅' : '❌'}
        </small>
      </div>
    </div>
  );
};

export default CacheInfoComponent;
