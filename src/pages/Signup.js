import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Link, json, useNavigation, useSubmit } from "react-router-dom";
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
import { postCredentials } from "../Services/authServices";
import { ToastContainer, toast } from "react-toastify";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

const Signup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string()
        .matches(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Invalid Email"
        )
        .required("Required"),
      password: Yup.string()
        .min(6, "must be of at least 6 charecters")
        .required("Required"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      submit(values, {
        method: "POST",
        action: `/signup`,
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
                          Signup
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
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        placeholder="Name"
                        name="name"
                        type="text"
                        size="small"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div>{formik.errors.name}</div>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        placeholder="Email Address"
                        name="email"
                        size="small"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div>{formik.errors.email}</div>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        placeholder="Password"
                        type="password"
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
                      <TextField
                        required
                        fullWidth
                        name="password_confirmation"
                        placeholder="Confirm Password"
                        type="password"
                        size="small"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password_confirmation}
                      />
                      {formik.touched.password_confirmation &&
                        formik.errors.password_confirmation && (
                          <div>{formik.errors.password_confirmation}</div>
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
                        {isSubmitting === "submitting"
                          ? "Submitting"
                          : "Get started"}
                      </Button>
                    </Grid>
                    <Grid item xs={12} justifyContent={"flex-end"}>
                      <Link
                        to={"/login"}
                        style={{
                          textDecoration: "none",
                          color: `${colors.whiteGradient[500]}`,
                        }}
                      >
                        Already have an account?{" "}
                        <span style={{ color: theme.palette.primary.main }}>
                          Log in
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

export default Signup;

export const action = async ({ request, params }) => {
  const data = await request.formData();
  const formData = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
    password_confirmation: data.get("password_confirmation"),
  };
  try {
    const response = await postCredentials(formData, "register");
    toast.success(` ${response.data.message}`);
    return null;
  } catch (error) {
    console.log({ error });
    if (error.response.status === 422 || error.response.status === 401) {
      const errorMessages = Object.values(error.response.data.errors)
        .flatMap((errorArray) => errorArray)
        .join("\n");
      toast.error(`${errorMessages} ${error.response.data.message}`, {
        toastId: "serverResposeError",
      });
      return null;
    }
    if (error.response.status === 500) {
      throw json({ message: "Could not Register User." }, { status: 500 });
    }
  }
};
