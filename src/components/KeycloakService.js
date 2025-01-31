import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8180',
    realm: 'customers-realm',
    clientId: 'customers-client',
});

export default keycloak