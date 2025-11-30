// Komari API Types

export interface NodeInfo {
  uuid: string;
  name: string;
  cpu_name: string;
  virtualization: string;
  arch: string;
  cpu_cores: number;
  os: string;
  kernel_version: string;
  gpu_name: string;
  region: string;
  mem_total: number;
  swap_total: number;
  disk_total: number;
  weight: number;
  price: number;
  billing_cycle: number;
  auto_renewal: boolean;
  currency: string;
  expired_at: string | null;
  group: string;
  tags: string;
  public_remark?: string;
  hidden: boolean;
  traffic_limit: number;
  traffic_limit_type: string;
  created_at: string;
  updated_at: string;
}

export interface NodeStatus {
  cpu: {
    usage: number;
  };
  ram: {
    total: number;
    used: number;
  };
  swap: {
    total: number;
    used: number;
  };
  load: {
    load1: number;
    load5: number;
    load15: number;
  };
  disk: {
    total: number;
    used: number;
  };
  network: {
    up: number;
    down: number;
    totalUp: number;
    totalDown: number;
  };
  connections: {
    tcp: number;
    udp: number;
  };
  uptime: number;
  process: number;
  message: string;
  updated_at: string;
}

export interface WebSocketResponse {
  data: {
    online: string[];
    data: {
      [uuid: string]: NodeStatus;
    };
  };
  status: string;
}

export interface PublicInfo {
  allow_cors: boolean;
  custom_body: string;
  custom_head: string;
  description: string;
  disable_password_login: boolean;
  oauth_enable: boolean;
  oauth_provider: string | null;
  ping_record_preserve_time: number;
  private_site: boolean;
  record_enabled: boolean;
  record_preserve_time: number;
  sitename: string;
  theme: string;
  theme_settings: Record<string, any> | null;
}

export interface MeInfo {
  "2fa_enabled": boolean;
  logged_in: boolean;
  sso_id: string;
  sso_type: string;
  username: string;
  uuid: string;
}
