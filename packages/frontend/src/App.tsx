import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import HomePage from "./views/Home";
import LoginPage from "./views/Login";
import RegisterPage from "./views/Register";
import theme from "./theme";
import { store } from "./store/index";
import RoomPage from "./views/Room";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/room/:id",
      element: <RoomPage />,
    },
  ]);
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
