import Keycloak from 'keycloak-js';

// Keycloak configuration
const keycloakConfig = {
  url: "https://identity.cognaisure.com",
  realm: "lc360",
  clientId: "health-investigation-web-client",
};

const keycloak = new Keycloak(keycloakConfig);

// Add event listeners
keycloak.onAuthSuccess = () => {
  console.log('Keycloak authentication successful');
};

keycloak.onAuthError = () => {
  console.error('Keycloak authentication error');
};

keycloak.onAuthRefreshSuccess = () => {
  console.log('Keycloak token refreshed successfully');
};

keycloak.onAuthRefreshError = () => {
  console.error('Keycloak token refresh error');
  // Don't automatically redirect to login on refresh error
  // The app will handle this
};

keycloak.onTokenExpired = () => {
  console.log('Keycloak token expired');
  keycloak.updateToken(30).catch(() => {
    console.error('Failed to refresh expired token');
  });
};

export default keycloak;