import React, { useEffect } from "react"
import AppRoutes from "./routes/AppRoutes"
import { ModalProvider } from "./context/modal.context"
import { UserProvider } from "./context/user.context"

function App() {
  // Handle Google OAuth callback - extract token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);

      // Clean up URL by removing query parameters
      const redirectPage = urlParams.get('redirectPage') || '/';
      window.history.replaceState({}, document.title, redirectPage);

      // Reload to trigger UserContext to fetch user profile
      window.location.reload();
    }
  }, []);

  return (
    <UserProvider>
      <ModalProvider>
        <AppRoutes />
      </ModalProvider>
    </UserProvider>

  )
}

export default App

