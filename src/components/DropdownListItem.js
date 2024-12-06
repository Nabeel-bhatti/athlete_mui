import React, { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  List,
  styled,
  useTheme,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { tokens } from "../theme/theme";

const DropdownListItem = ({
  text,
  options,
  icon: Icon,
  link,
  fontsize,
  marginleft,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const hasNestedOptions = Array.isArray(options) && options.length > 0;
  return (
    <>
      <ListItem disablePadding onClick={handleClick}>
        {link ? (
          <NavLink
            style={({ isActive }) => {
              return {
                textDecoration: "none",
                color: `${colors.whiteGradient[500]}`,
                backgroundColor: isActive ? theme.palette.primary.light : "",
                width: "100%",
                borderRadius: "10px",
              };
            }}
            to={link}
          >
            <StyledListButton>
              {Icon && <Icon />}
              <ListItemText>
                <Typography
                  sx={{
                    ml: marginleft ? `${marginleft}` : 2,
                    fontSize: `${fontsize}`,
                  }}
                >
                  {text}
                </Typography>
              </ListItemText>
              {hasNestedOptions && (open ? <ExpandLess /> : <ExpandMore />)}
            </StyledListButton>
          </NavLink>
        ) : (
          <StyledListButton>
            {Icon && <Icon />}
            <ListItemText>
              <Typography sx={{ ml: 2, fontSize: `${fontsize}` }}>
                {text}
              </Typography>
            </ListItemText>
            {hasNestedOptions && (open ? <ExpandLess /> : <ExpandMore />)}
          </StyledListButton>
        )}
      </ListItem>
      {open && hasNestedOptions && (
        <List disablePadding>
          {options.map((option) => (
            <List key={option.text} disablePadding>
              <div>
                <DropdownListItem
                  text={option.text}
                  options={option.dropdownOptions}
                  link={option.link}
                  fontsize={"14px"}
                  marginleft={"40px"}
                />
              </div>
            </List>
          ))}
        </List>
      )}
    </>
  );
};
const StyledListButton = styled(ListItemButton)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius: "10px",
  width: "100%", // Set the width to 100% of the container
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));
export default DropdownListItem;
