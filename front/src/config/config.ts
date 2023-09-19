import dev from './config.dev';
import prod from './config.prod';

interface ConfigType {
  API_BASE_URL: string;
}

let config: ConfigType;

if (process.env.NODE_ENV === 'development') {
  config = dev;
} else {
  config = prod;
}

export default config;
