import Keycloak from 'keycloak-js';

// Keycloak configuration
const keycloakConfig = {
  url: "https://identity.cognaisure.com",
  realm: "lc360",
  clientId: "health-investigation-web-client",
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;