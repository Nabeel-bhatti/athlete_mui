import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme/theme";
import { useContext } from "react";
import { DarkModeOutlined } from "@mui/icons-material";
import { LightModeOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const location = useLocation();
  const pathname = location.pathname;
  const paths = pathname.split("/");
  let page =
    paths[2] === "athletes" || paths[2] === "events" || paths[2] === "upload"
      ? paths[2]
      : paths[3];

  if (page && page !== "") {
    page = page.charAt(0).toUpperCase() + page.slice(1);
  }
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      backgroundColor={theme.palette.background.default}
      justifyContent={"space-between"}
      width={"100%"}
      sx={{ position: "static", top: 0, zIndex: 10 }}
    >
      <Box p={2}>
        <Typography variant="h4" color={colors.primary[100]}>
          {page && page !== "" ? page : "Home"}
        </Typography>
      </Box>
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
        }}
      >
        <Box display="flex" justifyContent={"flex-end"} mr={2}>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined />
            ) : (
              <LightModeOutlined />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
