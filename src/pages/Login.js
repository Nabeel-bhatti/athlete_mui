import React, { useContext } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ColorModeContext, tokens } from "../theme/theme";
import {
  Form,
  Link,
  json,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { postCredentials } from "../Services/authServices";
import { ToastContainer, toast } from "react-toastify";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

const Login = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const colors = tokens(theme.palette.mode);
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Invalid Email"
        )
        .required("Required"),
      password: Yup.string()
        .min(6, "must be of at least 6 charecters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      submit(values, {
        method: "POST",
        action: `/login`,
      });
    },
  });
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box m={1} width="80vw">
          <ToastContainer />
          <Paper elevation={6} sx={{ borderRadius: "10px", p: "10px" }}>
            <Grid container component="main">
              <Grid item xs={12} sm={12} md={6} mt={7} mb={7}>
                <Form
                  component="form"
                  onSubmit={formik.handleSubmit}
                  method="post"
                >
                  <Grid
                    container
                    gap={2}
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                  >
                    <Grid item display={"flex"} flexDirection={"row"}>
                      <Box display="flex" alignItems={"center"} mr={2}>
                        <Typography component="h1" variant="h5">
                          Login
                        </Typography>
                        <IconButton onClick={colorMode.toggleColorMode}>
                          {theme.palette.mode === "dark" ? (
                            <DarkModeOutlined />
                          ) : (
                            <LightModeOutlined />
                          )}
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      display={"flex"}
                      flexDirection={"column"}
                    >
                      <Typography component={"label"} variant="regTextL">
                        Email
                      </Typography>
                      <TextField
                        required
                        fullWidth
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        size="small"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div>{formik.errors.email}</div>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      display={"flex"}
                      flexDirection={"column"}
                    >
                      <Typography component={"label"} variant="regTextL">
                        Password
                      </Typography>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        type="password"
                        placeholder=". . . . . . . . . ."
                        size="small"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div>{formik.errors.password}</div>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          color: "#FFFFFF",
                          borderRadius: "8px",
                          width: "330px",
                          height: "46px",
                          marginTop: 2,
                          marginBottom: 2,
                          backgroundColor: theme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        {isSubmitting === "submitting" ? "Submitting" : "Login"}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Link
                        // to={"/signup"}
                        to={"#"}
                        style={{
                          textDecoration: "none",
                          color: `${colors.whiteGradient[500]}`,
                        }}
                      >
                        Dont have an account?{" "}
                        <span style={{ color: theme.palette.primary.main }}>
                          Sign up
                        </span>
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              </Grid>
              <Grid
                item
                xs={false}
                sm={false}
                md={6}
                sx={{
                  background:
                    "linear-gradient(90deg, #C2A1FD 0%, #9154FD 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "10px",
                }}
              ></Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Login;

export const action = async ({ request, params }) => {
  const data = await request.formData();
  const formData = {
    email: data.get("email"),
    password: data.get("password"),
  };
  try {
    const response = await postCredentials(formData, "login");
    const token = response.data.data.token;
    const name = response.data.data.name;
    toast.success(` ${response.data.message}`);
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    return redirect("/admin");
  } catch (error) {
    console.log({ error });
    if (error.response.status === 422 || error.response.status === 401) {
      toast.error(`${error.response.data.message}`, {
        toastId: "serverResposeError",
      });
      return null;
    }
    if (error.response.status === 500) {
      throw json({ message: "Could not Login User." }, { status: 500 });
    }
  }
};
