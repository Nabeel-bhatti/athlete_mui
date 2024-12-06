import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import useHttp from "../hooks/use-http";

const DeleteModal = ({
  openDeleteConfirmation,
  handleDeleteConfirmationClose,
  deleteRow,
  url,
}) => {
  const { deleteData } = useHttp(url);
  const generateNameList = (dataObject) => {
    if (!dataObject) {
      return null;
    }
    const names = [];
    const findNames = (obj) => {
      for (const [key, value] of Object.entries(obj)) {
        if (key === "name" && value !== "Reps" && value !== "Time") {
          names.push(value);
        } else if (typeof value === "object" && value !== null) {
          findNames(value); // Recursively check nested objects
        }
      }
    };
    findNames(dataObject);
    return names.map((name) => <li key={name}>{name}</li>);
  };

  return (
    <>
      <Dialog
        open={openDeleteConfirmation || false}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle>Delete Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the <strong>Record</strong> with
            these <strong>values</strong>
            <ul>{generateNameList(deleteRow)}</ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteData(deleteRow.id);
            }}
            color="primary"
          >
            <span onClick={handleDeleteConfirmationClose}>Delete</span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteModal;
