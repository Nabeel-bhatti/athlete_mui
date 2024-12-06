import React, { useContext } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, useTheme } from "@mui/material";
import { getAuthToken } from "../../util/auth";
import { ColorModeContext, tokens } from "../../theme/theme";
import {
  ArrowBackIosNewOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  LoginOutlined,
} from "@mui/icons-material";
import { ToastContainer } from "react-toastify";

const Header = () => {
  const token = getAuthToken();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: theme.palette.primary.main }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Athlete Stats
          </Typography>
          <Button
            component={NavLink}
            to="/search/athlete"
            color="inherit"
            style={({ isActive }) => {
              return {
                textDecoration: isActive ? "underline" : "none",
              };
            }}
          >
            Athlete
          </Button>
          <Button
            component={NavLink}
            to="/search/event"
            color="inherit"
            style={({ isActive }) => {
              return {
                textDecoration: isActive ? "underline" : "none",
              };
            }}
          >
            Event
          </Button>
          <Button
            component={NavLink}
            to="/search/performance"
            color="inherit"
            style={({ isActive }) => {
              return {
                textDecoration: isActive ? "underline" : "none",
              };
            }}
          >
            Performance
          </Button>
          <Button
            component={NavLink}
            to="/search/task"
            color="inherit"
            style={({ isActive }) => {
              return {
                textDecoration: isActive ? "underline" : "none",
              };
            }}
          >
            Task
          </Button>
          <Button
            component={NavLink}
            to="/search/time"
            color="inherit"
            style={({ isActive }) => {
              return {
                textDecoration: isActive ? "underline" : "none",
              };
            }}
          >
            Time
          </Button>

          <Button onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? (
              <Typography display={"flex"} alignItems={"center"} gap={1}>
                <DarkModeOutlined />
                Dark
              </Typography>
            ) : (
              <Typography display={"flex"} alignItems={"center"} gap={1}>
                <LightModeOutlined />
                Light
              </Typography>
            )}
          </Button>

          {!token ? (
            <Button
              component={Link}
              to="/login"
              color="inherit"
              startIcon={<LoginOutlined />}
              sx={{
                boxShadow: 15,
                ml: 2,
                backgroundColor: `${colors.indigoGradient[600]}`,
                "&:hover": {
                  backgroundColor: `${colors.indigoGradient[700]}`,
                },
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              component={Link}
              to="/admin"
              color="inherit"
              startIcon={<ArrowBackIosNewOutlined />}
              sx={{
                boxShadow: 15,
                ml: 2,
                backgroundColor: `${colors.indigoGradient[600]}`,
                "&:hover": {
                  backgroundColor: `${colors.indigoGradient[700]}`,
                },
              }}
            >
              Back to Dashboard
            </Button>
          )}
        </Toolbar>
        <ToastContainer />
      </AppBar>
      <Outlet />
    </>
  );
};

export default Header;
