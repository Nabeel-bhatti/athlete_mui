import React from "react";
import Typography from "@mui/material/Typography";
import { useRouteError } from "react-router-dom";
import { Container, useTheme } from "@mui/material";

const ErrorPage = () => {
  const error = useRouteError();
  const theme = useTheme();
  let errorText = "";
  let errorMessage = "";
  if (error.status === 404) {
    errorText = "404 - Page Not Found";
    errorMessage = "Oops! The page you are looking for does not Exist.";
  } else if (error.status === 500) {
    errorText = "500 - Internal Server Error";
    errorMessage = "Oops! Looks like something is wrong with our Servers.";
  } else {
    errorText = "An Error Occoured";
    errorMessage = "Oops! Something Went Wrong.";
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: theme.spacing(2),
          fontWeight: "bold",
        }}
      >
        {errorText}
      </Typography>
      <Typography variant="body1">{errorMessage}</Typography>
    </Container>
  );
};

export default ErrorPage;
