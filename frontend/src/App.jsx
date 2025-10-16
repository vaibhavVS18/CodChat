import React from 'react'
import AppRoutes from "./routes/AppRoutes";
import {UserProvider} from "./context/user.context"
import {ModalProvider} from "./context/modal.context"

const App = () => {
  return (
    <UserProvider>
      <ModalProvider>
          <AppRoutes/>
      </ModalProvider>
    </UserProvider>
  )
}

export default App;
