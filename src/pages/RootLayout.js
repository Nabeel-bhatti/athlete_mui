import React from "react";
import { Container, Grid, styled } from "@mui/material";
import Sidebar from "./globalLayout/Sidebar";
import Topbar from "./globalLayout/Topbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const CustomContainer = styled(Container)({
    padding: 0,
  });
  return (
    <CustomContainer maxWidth="xl" disableGutters={true}>
      <main className="content">
        <Grid container>
          <Grid item xs={2}>
            <Sidebar />
          </Grid>
          <Grid item xs={10}>
            <Grid container>
              <Grid item xs={12}>
                <Topbar />
                <Outlet />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </main>
    </CustomContainer>
  );
};

export default RootLayout;
