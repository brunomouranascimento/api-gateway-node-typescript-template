export interface Gateway {
  name: string;
  host: string;
  config: Config;
  security: Security;
  services: Array<Service>;
}

interface Config {
  port: number;
  morgan: boolean;
}

interface Security {
  json: boolean;
  helmet: boolean;
}

interface Service {
  service: string;
  url: string;
}
