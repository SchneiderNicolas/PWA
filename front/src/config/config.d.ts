declare module './config' {
  const config: {
    API_BASE_URL: string;
    BASE_URL: string;
    PUBLIC_VAPID_KEY: string;
  };
  export = config;
}

declare module './config.dev' {
  const config: {
    API_BASE_URL: string;
    BASE_URL: string;
    PUBLIC_VAPID_KEY: string;
  };
  export = config;
}

declare module './config.prod' {
  const config: {
    API_BASE_URL: string;
    BASE_URL: string;
    PUBLIC_VAPID_KEY: string;
  };
  export = config;
}
