import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme/theme";
import { Link } from "react-router-dom";

const CountData = ({ link, count }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box textAlign="center">
      <Typography
        variant={"h1"}
        m={3}
        color={colors.primary[100]}
        fontSize={"50px"}
      >
        {count}
      </Typography>
      <Link to={link}>
        <Button
          fullWidth={true}
          texttransform={"none"}
          sx={{
            height: "46px",
            marginTop: "20px",
            border: `1px solid ${colors.whiteGradient[400]}`,
            boxShadow: "0px 0px 4px 1px rgba(0, 0, 0, 0.25)",
            borderRadius: "8px",
            color: colors.primary[100],
          }}
        >
          <Typography variant="subtitleS">Details</Typography>
        </Button>
      </Link>
    </Box>
  );
};

export default CountData;
