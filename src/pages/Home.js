import { Box, Grid, Paper, Typography, styled, useTheme } from "@mui/material";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { tokens } from "../theme/theme";
import CountData from "../components/CountData";
import {
  CalendarMonthOutlined,
  DirectionsRunOutlined,
  ScoreboardOutlined,
  SportsScoreOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { getAuthToken } from "../util/auth";
import { json, redirect, useLoaderData } from "react-router-dom";
import config from "../Services/config.json";

const Home = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const data = useLoaderData();
  const StyledPaper = styled(Paper)({
    backgroundColor: `${colors.whiteGradient[100]}`,
    padding: "25px",
    borderRadius: "10px",
    height: "250px",
    margin: "5px",
  });
  const TitleBox = styled(Box)({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  });
  return (
    <>
      <ToastContainer />
      <Box sx={{ width: "97%", margin: "10px" }}>
        <ToastContainer theme={theme.palette.mode} />
        <Paper elevation={3} sx={{ padding: "10px" }}>
          <Box p={2} display={"flex"} justifyContent={"space-between"}>
            <Typography variant="h5" color={colors.primary[100]}>
              Statistics
            </Typography>
          </Box>
          <Grid container>
            <Grid item xs={3}>
              <StyledPaper elevation={3}>
                <TitleBox>
                  <Typography variant="h6">Toatal Athelets</Typography>
                  <DirectionsRunOutlined />
                </TitleBox>
                <CountData link={"athletes"} count={data.athleteCount} />
              </StyledPaper>
            </Grid>
            <Grid item xs={3}>
              <StyledPaper elevation={3}>
                <TitleBox>
                  <Typography variant="h6">Total Events</Typography>
                  <CalendarMonthOutlined />
                </TitleBox>
                <CountData link={"events"} count={data.eventCount} />
                {/* <EarningCount /> */}
              </StyledPaper>
            </Grid>
            <Grid item xs={3}>
              <StyledPaper elevation={3}>
                <TitleBox>
                  <Typography variant="h6">Result Data</Typography>
                  <ScoreboardOutlined />
                </TitleBox>
                <CountData
                  link={"managment/results"}
                  count={data.resultCount}
                />
                {/* <EarningCount /> */}
              </StyledPaper>
            </Grid>
            <Grid item xs={3}>
              <StyledPaper elevation={3}>
                <TitleBox>
                  <Typography variant="h6">Competition Data</Typography>
                  <SportsScoreOutlined />
                </TitleBox>
                <CountData
                  link={"managment/competition"}
                  count={data.competitionCount}
                />
                {/* <EarningCount /> */}
              </StyledPaper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default Home;

export const loader = async () => {
  try {
    const response = await axios.get(config.apiUrl + "/dashboardData", {
      headers: {
        Authorization: "Bearer " + getAuthToken(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = response.data.data;
    return data;
  } catch (error) {
    if (error.response.status === 403 || error.response.status === 401) {
      localStorage.clear();
      return redirect("/login");
    }
    if (error.response.status === 500) {
      throw json({ message: "Could not Login User." }, { status: 500 });
    }
  }
};
