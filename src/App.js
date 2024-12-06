import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import Home, { loader as countLoader } from "./pages/Home";
import Athletes from "./pages/Athletes";
import Events from "./pages/Events";
import Athlete from "./pages/advanceSearch/Athlete";
import Performance from "./pages/advanceSearch/Performance";
import Task from "./pages/advanceSearch/Task";
import Time from "./pages/advanceSearch/Time";
import Competition from "./pages/managmentCenter/Competition";
import EventTasks from "./pages/managmentCenter/EventTasks";
import Gender from "./pages/managmentCenter/Gender";
import Results from "./pages/managmentCenter/Results";
import TimeRange from "./pages/managmentCenter/TimeRange";
import "react-toastify/ReactToastify.min.css";
import { ColorModeContext, useMode } from "./theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Login, { action as loginAction } from "./pages/Login";
import Signup, { action as signupAction } from "./pages/Signup";
import ErrorPage from "./pages/Error";
import { checkAuthLoader } from "./util/auth";
import Header from "./pages/globalLayout/Header";
import Event from "./pages/advanceSearch/Event";
import UploadCSV from "./pages/UploadCSV";
function App() {
  const [theme, colorMode] = useMode();
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Navigate to="search" replace />,
        },
        {
          path: "search",
          element: <Header />,
          children: [
            {
              path: "",
              element: <Navigate to="athlete" replace />,
            },
            {
              path: "athlete",
              element: <Athlete />,
            },
            {
              path: "event",
              element: <Event />,
            },
            {
              path: "performance",
              element: <Performance />,
            },
            {
              path: "task",
              element: <Task />,
            },
            {
              path: "time",
              element: <Time />,
            },
          ],
        },
        {
          path: "/login",
          element: <Login />,
          action: loginAction,
        },
        // {
        //   path: "signup",
        //   element: <Signup />,
        //   action: signupAction,
        // },
        {
          path: "admin",
          element: <RootLayout />,
          errorElement: <ErrorPage />,
          loader: checkAuthLoader,
          children: [
            {
              path: "",
              element: <Home />,
              loader: countLoader,
            },
            {
              path: "athletes",
              element: <Athletes />,
            },
            {
              path: "events",
              element: <Events />,
            },
            {
              path: "upload",
              element: <UploadCSV />,
            },
            {
              path: "managment",
              errorElement: <ErrorPage />,
              children: [
                {
                  path: "",
                  element: <Navigate to="gender" replace />,
                },
                {
                  path: "competition",
                  element: <Competition />,
                },
                {
                  path: "tasks",
                  element: <EventTasks />,
                },
                {
                  path: "gender",
                  element: <Gender />,
                },
                {
                  path: "timerange",
                  element: <TimeRange />,
                },
                {
                  path: "results",
                  element: <Results />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
