export type ServiceCategory = 'chat' | 'code' | 'presentation' | 'image_video' | 'other';

export interface ServiceClient {
  id: string;
  title: string;
  category: ServiceCategory;
  urlPatterns: string[];
  adapterId: string;
  icon?: string;
  enabled: boolean;
  meta?: Record<string, unknown>;
}

export interface ServiceRegistryFile {
  version: 1;
  updatedAt: string;
  clients: ServiceClient[];
}

const serviceCategories: ServiceCategory[] = ['chat', 'code', 'presentation', 'image_video', 'other'];

export const isServiceCategory = (value: unknown): value is ServiceCategory => {
  return typeof value === 'string' && serviceCategories.includes(value as ServiceCategory);
};

export const isServiceClient = (value: unknown): value is ServiceClient => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<ServiceClient>;
  if (typeof candidate.id !== 'string' || !candidate.id.trim()) {
    return false;
  }
  if (typeof candidate.title !== 'string' || !candidate.title.trim()) {
    return false;
  }
  if (!isServiceCategory(candidate.category)) {
    return false;
  }
  if (!Array.isArray(candidate.urlPatterns) || candidate.urlPatterns.some((pattern) => typeof pattern !== 'string' || !pattern.trim())) {
    return false;
  }
  if (typeof candidate.adapterId !== 'string' || !candidate.adapterId.trim()) {
    return false;
  }
  if (candidate.icon !== undefined && (typeof candidate.icon !== 'string' || !candidate.icon.trim())) {
    return false;
  }
  if (typeof candidate.enabled !== 'boolean') {
    return false;
  }
  if (candidate.meta !== undefined && (typeof candidate.meta !== 'object' || Array.isArray(candidate.meta))) {
    return false;
  }
  return true;
};

export const isRegistryFile = (value: unknown): value is ServiceRegistryFile => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<ServiceRegistryFile>;
  if (candidate.version !== 1) {
    return false;
  }
  if (typeof candidate.updatedAt !== 'string' || !candidate.updatedAt.trim()) {
    return false;
  }
  if (!Array.isArray(candidate.clients) || candidate.clients.some((client) => !isServiceClient(client))) {
    return false;
  }
  return true;
};
