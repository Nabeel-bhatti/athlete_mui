import { Box, Button, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../theme/theme";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";

const ActionsButtonGrid = ({
  setDeleteRow,
  setOpenDeleteConfirmation,
  setUpdateRow,
  setOpenUpdateConfirmation,
  row,
  notDeleteRow,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // open Dialog onDelete Funtionality
  const handleDeleteConfirmationOpen = (row) => {
    setDeleteRow(row);
    setOpenDeleteConfirmation(true);
  };
  // open Dialog onDelete Funtionality
  const handleUpdateConfirmationOpen = (row) => {
    setUpdateRow(row);
    setOpenUpdateConfirmation(true);
  };
  return (
    <>
      <Box width={"100%"} display={"flex"} justifyContent={"space-around"}>
        {!notDeleteRow && (
          <Button
            variant="contained"
            onClick={() => handleDeleteConfirmationOpen(row)}
            sx={{
              backgroundColor: colors.danger[600],
              "&:hover": {
                backgroundColor: colors.danger[600],
              },
              width: "40%",
            }}
          >
            <DeleteTwoToneIcon />
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => handleUpdateConfirmationOpen(row)}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            "&:hover": {
              backgroundColor: theme.palette.secondary.main,
            },
            width: "40%",
          }}
        >
          <EditNoteTwoToneIcon />
        </Button>
      </Box>
    </>
  );
};

export default ActionsButtonGrid;
