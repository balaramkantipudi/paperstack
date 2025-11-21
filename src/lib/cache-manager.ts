interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface DashboardMetrics {
  totalDocuments: number;
  processedDocuments: number;
  pendingDocuments: number;
  failedDocuments: number;
  [key: string]: unknown;
}

interface Vendor {
  id: string;
  name: string;
  [key: string]: unknown;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheItem<unknown>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cache dashboard metrics for better performance
  async getCachedDashboardMetrics(organizationId: string): Promise<DashboardMetrics | null> {
    return this.get<DashboardMetrics>(`dashboard_metrics_${organizationId}`);
  }

  setCachedDashboardMetrics(organizationId: string, metrics: DashboardMetrics): void {
    this.set<DashboardMetrics>(`dashboard_metrics_${organizationId}`, metrics, 2 * 60 * 1000); // 2 minutes
  }

  // Cache vendor list for better performance
  async getCachedVendors(organizationId: string): Promise<Vendor[] | null> {
    return this.get<Vendor[]>(`vendors_${organizationId}`);
  }

  setCachedVendors(organizationId: string, vendors: Vendor[]): void {
    this.set<Vendor[]>(`vendors_${organizationId}`, vendors, 10 * 60 * 1000); // 10 minutes
  }
}
