import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';

interface UserProfile {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      // Load user profile
      keycloak.loadUserProfile().then((profile: any) => {
        // Get user roles
        const roles = keycloak.tokenParsed?.realm_access?.roles || [];
        const resourceRoles = keycloak.tokenParsed?.resource_access || {};

        setUserProfile({
          username: profile.username,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          roles: roles,
        });
        console.log('User Profile:', roles)
      // Store user info in sessionStorage (for backward compatibility)
      sessionStorage.setItem('username', profile.username || '');
      sessionStorage.setItem('roleName', roles.toString() || '');
      sessionStorage.setItem('userEmail', profile.email || '');
    });
}
  }, [initialized, keycloak.authenticated]);

const logout = () => {
  // Clear sessionStorage
  sessionStorage.clear();
  // Keycloak logout
  keycloak.logout({
    redirectUri: window.location.origin,
  });
};

const hasRole = (role: string): boolean => {
  return keycloak.tokenParsed?.realm_access?.roles?.includes(role) || false;
};

const hasAnyRole = (roles: string[]): boolean => {
  return roles.some(role => hasRole(role));
};

const getToken = (): string | undefined => {
  return keycloak.token;
};

const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshed = await keycloak.updateToken(30);
    if (refreshed && keycloak.token) {
      sessionStorage.setItem('token', keycloak.token);
    }
    return refreshed;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};

return {
  keycloak,
  initialized,
  authenticated: keycloak.authenticated,
  userProfile,
  logout,
  hasRole,
  hasAnyRole,
  getToken,
  refreshToken,
};
};