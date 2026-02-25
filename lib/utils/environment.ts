export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
export const isProd = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';
export const isDev = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev';
export const mocksEnabled = () => process.env.USE_MOCKS === 'true';
export const loginMocked = () => process.env.MOCK_LOGIN === 'true';
export const usesLocalWonderwall = () => isLocal() && process.env.WONDERWALL_OPENID_WELL_KNOWN_URL != null;
