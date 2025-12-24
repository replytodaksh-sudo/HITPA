import React from "react";
import { type ReactNode } from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak.config";
import { CircularProgress, Box, Typography } from "@mui/material";
import { sessionService } from "./utils/session.service";

interface KeycloakProviderProps {
  children: ReactNode;
}

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  // Keycloak init options
  const initOptions = {
    onLoad: "login-required", // Redirects to login if not authenticated
    redirectUri: window.location.origin + "/investigation/admin/dashboard",
    checkLoginIframe: false, // Disable iframe check for better performance
    pkceMethod: "S256", // Use PKCE for security
  };

  // Loading component
  const LoadingComponent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="text.secondary">
        Authenticating...
      </Typography>
    </Box>
  );

  // Event handlers
  const handleOnEvent = (event: string, error: any) => {
    if (event === "onAuthSuccess") {
      // Store token in sessionStorage
      if (keycloak.token) {
        sessionStorage.setItem("token", keycloak.token);
        sessionStorage.setItem("refreshToken", keycloak.refreshToken || "");
      }
    }

    if (event === "onAuthError") {
      console.error("Authentication error:", error);
    }

    if (event === "onTokenExpired") {
      keycloak.updateToken(30).catch(() => {
        keycloak.login();
      });
    }
  };

  const handleOnTokens = (tokens: any) => {
    // Update tokens in sessionStorage
    if (tokens.token) {
      sessionStorage.setItem("token", tokens.token);
      sessionStorage.setItem("refreshToken", tokens.refreshToken || "");
    }

    const decodedValue: any = sessionService.decodeToken(tokens.token);
    console.log("Decoded Token:", decodedValue);
    if (decodedValue) {
      sessionService.storeOther("userCode", decodedValue.userCode);
      sessionService.storeOther("name", decodedValue.name);
      sessionService.storeOther("sessionId", decodedValue.sessionId);
      sessionService.storeOther("role", decodedValue.realm_access.roles);
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      LoadingComponent={LoadingComponent}
      onEvent={handleOnEvent}
      onTokens={handleOnTokens}
    >
      {children}
    </ReactKeycloakProvider>
  );
};

export default KeycloakProvider;
