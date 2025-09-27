import { LogLevel } from '@azure/msal-browser';

// Get configuration from environment variables
const getAppBaseUrl = () => {
  return import.meta.env.VITE_APP_BASE_URL || window.location.origin;
};

const getClientId = () => {
  return import.meta.env.VITE_AZURE_CLIENT_ID || '6ce1f29a-d59f-4b06-8b79-5b373126a3bf';
};

const getApiScope = () => {
  return import.meta.env.VITE_AZURE_API_SCOPE || 'https://ombudgetapp.onmicrosoft.com/cb33bc74-391a-4691-b2cb-2acda62dcd78/access_as_user';
};

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
    scopes: ["openid", "profile", "email"],
};

// API request for accessing your backend
export const apiRequest = {
    scopes: [getApiScope()],
};

// Debug info
console.log(`🔧 Auth Config:`);
console.log(`  Environment: ${import.meta.env.DEV ? 'Development' : 'Production'}`);
console.log(`  Client ID: ${getClientId().substring(0, 8)}...`);
console.log(`  Redirect URI: ${getAppBaseUrl()}/redirect`);
console.log(`  API Scope: ${getApiScope()}`);
