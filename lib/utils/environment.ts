export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
export const isProd = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';
export const isDev = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev';
export const useMocks = () => process.env.USE_MOCKS === 'true';
export const useMockedLogin = () => process.env.DISABLE_LOGIN === 'true';
