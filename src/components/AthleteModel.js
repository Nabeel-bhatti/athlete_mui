import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";
import { getGender } from "../Services/publicDataServices";
import useHttp from "../hooks/use-http";
import useErrorHandling from "../hooks/use-errorHandeler";

const AthleteModel = ({ open, setOpen, url, updateRow, title }) => {
  const [formValues, setFormValues] = useState({
    id: updateRow?.id || "",
    name: updateRow?.name || "",
    gender_id: updateRow?.gender_id?.id || "",
  });
  const { createData, updateData } = useHttp(url);
  const [genderData, setGenderData] = useState([]);
  const { handleError } = useErrorHandling();

  const handleSave = async () => {
    if (updateRow) {
      if (validateForm()) {
        const id = formValues.id;
        const params = {
          name: formValues.name,
          gender_id: formValues.gender_id,
        };
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

  const getGenderById = async () => {
    try {
      const response = await getGender({ id: formValues.gender_id });
      const data = response.data;
      setGenderData(data.data);
      console.log(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    if (formValues.gender_id !== "") {
      getGenderById();
    }
  }, []);
  const validateForm = () => {
    for (const key in formValues) {
      if (formValues[key] === "" && key !== "id") {
        toast.warning("Please fill in all required fields.", {
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

  const genderDataHandler = async (value) => {
    try {
      const response = await getGender({ name: value });
      const data = response.data;
      setGenderData(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title} Athlete</DialogTitle>
        <DialogContent sx={{ width: "500px" }}>
          <DialogContentText>{title} a Record</DialogContentText>
          <InputLabel htmlFor="name" required>
            Name
          </InputLabel>
          <TextField
            id="name"
            autoFocus
            margin="dense"
            name="name"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.name || ""}
            onChange={handleFieldChange}
          />
          <InputLabel htmlFor="gender_id" required>
            Gender
          </InputLabel>
          <Autocomplete
            options={genderData}
            getOptionLabel={(option) => option.name}
            id="gender_id"
            isOptionEqualToValue={(option, value) => {
              return option.id === value.id;
            }}
            onChange={(event, newValue) =>
              handleFieldChange({
                target: { name: "gender_id", value: newValue?.id || "" },
              })
            }
            onInputChange={(event, value) => {
              if (value) {
                genderDataHandler(value);
              } else {
                setGenderData([]);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                id="gender_id"
                name="gender_id"
                placeholder={genderData.length > 0 ? genderData[0].name : ""}
                variant="standard"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AthleteModel;
