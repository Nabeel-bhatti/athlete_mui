import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, InputLabel } from "@mui/material";
import { toast } from "react-toastify";
import useHttp from "../hooks/use-http";

export default function AddNewModal({
  open,
  setOpen,
  heading,
  formData,
  method,
  url,
}) {
  const [formValues, setFormValues] = useState(formData || {});
  const { createData, updateData } = useHttp(url);
  const handleSave = async () => {
    if (method === "update") {
      if (validateForm()) {
        const { id, serial, ...params } = formValues;
        updateData(id, params);
        setOpen(false);
      }
    } else {
      if (validateForm()) {
        createData(formValues);
        setOpen(false);
      }
    }
  };

  const validateForm = () => {
    for (const key in formValues) {
      if (formValues[key] === "" && key !== "id" && key !== "serial") {
        toast.error("Please fill in all required fields.", {
          toastId: "formValidation",
        });
        return false;
      }
    }
    return true;
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  };

  const renderTextField = (key) => {
    if (key === "start_time" || key === "end_time") {
      return (
        <div key={key}>
          <InputLabel htmlFor={key} required>
            {key}
          </InputLabel>
          <TextField
            autoFocus
            id={key}
            name={key}
            type="text"
            fullWidth
            value={formValues[key]}
            onChange={handleFieldChange}
          />
        </div>
      );
    } else if (key !== "id" && key !== "serial") {
      return (
        <div key={key}>
          <InputLabel htmlFor={key} required>
            {key}
          </InputLabel>
          <TextField
            autoFocus
            key={key}
            id={key}
            margin="dense"
            name={key}
            type="text"
            fullWidth
            variant="standard"
            value={formValues[key]}
            onChange={handleFieldChange}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{heading}</DialogTitle>
        <DialogContent sx={{ width: "500px" }}>
          <DialogContentText>Add a Record</DialogContentText>
          {Object.keys(formValues).map((key) => renderTextField(key))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
