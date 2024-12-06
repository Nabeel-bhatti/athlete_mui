import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  ButtonBase,
  List,
  Menu,
  MenuItem,
  Paper,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme/theme";
import DropdownListItem from "../../components/DropdownListItem";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarMonthOutlined,
  DirectionsRunOutlined,
  Person,
  QueryStatsOutlined,
  TuneOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const refPicker = useRef();
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleModleOpen = () => {
    setOpenModal(Boolean(refPicker.current));
    setAnchorEl(refPicker.current);
  };
  const handleModleClose = () => {
    setOpenModal(false);
    setAnchorEl(null);
  };
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
    setOpenModal(false);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.whiteGradient[100],
        width: "220px",
        height: "100vh",
        position: "fixed",
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.whiteGradient[100],
          width: "220px",
          maxHeight: "87vh",
          position: "fixed",
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <Box
          display="flex"
          p="10px"
          mb="20px"
          mt="10px"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h5"
            component={Link}
            to="/admin"
            sx={{
              // color: `${colors.primary[100]}`,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Athlete Stats
          </Typography>
        </Box>
        <List>
          <DropdownListItem
            text="Advance Search"
            icon={QueryStatsOutlined}
            link="/"
          />
          <DropdownListItem
            text="Athletes"
            icon={DirectionsRunOutlined}
            link="athletes"
          />
          <DropdownListItem
            text="Events"
            icon={CalendarMonthOutlined}
            link="events"
          />
          <DropdownListItem
            text="Managment Center"
            icon={TuneOutlined}
            options={[
              { text: "Gender", link: "managment/gender" },
              { text: "Time Range", link: "managment/timerange" },
              { text: "Results", link: "managment/results" },
              { text: "Event Tasks", link: "managment/tasks" },
              { text: "Competition", link: "managment/competition" },
            ]}
          />
          <DropdownListItem
            text="Upload CSV"
            icon={UploadFileOutlined}
            link="upload"
          />
        </List>
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        <Paper
          id="basic-button"
          ref={refPicker}
          onClick={handleModleOpen}
          sx={{
            position: "fixed",
            bottom: 20,
            width: "180px",
            height: "55px",
            textAlign: "center",
            background: theme.palette.primary.main,
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <UserBox>
            <Avatar>
              <Person />
            </Avatar>
            <Typography variant="body1">
              {localStorage.getItem("name")?.toUpperCase()}
            </Typography>
            <LogoutTwoToneIcon />
          </UserBox>
        </Paper>
        {anchorEl && (
          <Menu
            id="basic-menu"
            open={openModal}
            anchorEl={anchorEl}
            onClose={handleModleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem
              sx={{
                width: "175px",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={logoutHandler}
            >
              Logout
            </MenuItem>
          </Menu>
        )}
      </Box>
    </Box>
  );
};
const UserBox = styled(ButtonBase)({
  display: "flex",
  flexDirection: "row",
  alignItems: "space-between",
  alignContent: "",
  padding: "8px 33px 14px 10px ",
  gap: "20px",
  color: "#FFFFFF",
});

export default Sidebar;
