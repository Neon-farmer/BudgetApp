import { LogLevel } from '@azure/msal-browser';

// Get configuration from environment variables
const getAppBaseUrl = () => {
  return import.meta.env.VITE_APP_BASE_URL || window.location.origin;
};

const getClientId = () => {
  const clientId = import.meta.env.VITE_AZURE_CLIENT_ID || '6ce1f29a-d59f-4b06-8b79-5b373126a3bf';
  console.log('🔧 Using Client ID:', clientId.substring(0, 8) + '...');
  return clientId;
};

const getApiScope = () => {
  return import.meta.env.VITE_AZURE_API_SCOPE || 'https://ombudgetapp.onmicrosoft.com/cb33bc74-391a-4691-b2cb-2acda62dcd78/access_as_user';
};

// Debug environment variables at build time
console.log('🔧 Environment Variables Check:');
console.log('  VITE_APP_BASE_URL:', import.meta.env.VITE_APP_BASE_URL);
console.log('  VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('  VITE_AZURE_CLIENT_ID:', import.meta.env.VITE_AZURE_CLIENT_ID ? import.meta.env.VITE_AZURE_CLIENT_ID.substring(0, 8) + '...' : 'NOT SET');
console.log('  VITE_AZURE_API_SCOPE:', import.meta.env.VITE_AZURE_API_SCOPE ? 'SET' : 'NOT SET');
console.log('  import.meta.env.DEV:', import.meta.env.DEV);
console.log('  import.meta.env.PROD:', import.meta.env.PROD);

export const msalConfig = {
    auth: {
        clientId: getClientId(),
        authority: 'https://ombudgetapp.ciamlogin.com/',
        redirectUri: `${getAppBaseUrl()}/redirect`,
        postLogoutRedirectUri: '/', 
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                const env = import.meta.env.DEV ? 'DEV' : 'PROD';
                const clientPrefix = getClientId().substring(0, 8);
                
                switch (level) {
                    case LogLevel.Error:
                        console.error(`[${env}:${clientPrefix}] ${message}`);
                        return;
                    case LogLevel.Info:
                        console.info(`[${env}:${clientPrefix}] ${message}`);
                        return;
                    case LogLevel.Verbose:
                        console.debug(`[${env}:${clientPrefix}] ${message}`);
                        return;
                    case LogLevel.Warning:
                        console.warn(`[${env}:${clientPrefix}] ${message}`);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

// Login request for initial authentication
export const loginRequest = {
  scopes: ["openid", "profile", "email"] // no Graph scopes here
};

export const apiRequest = {
  scopes: [ import.meta.env.VITE_AZURE_API_SCOPE ] // exact API scope
};
