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
import useHttp from "../hooks/use-http";
import { getTimeRange } from "../Services/publicDataServices";
import useErrorHandling from "../hooks/use-errorHandeler";

const EventModel = ({ open, setOpen, url, updateRow, title }) => {
  const [formValues, setFormValues] = useState({
    id: updateRow?.id || "",
    name: updateRow?.name || "",
    time_range_id: updateRow?.time_range_id?.id || "",
  });
  const { updateData, createData } = useHttp(url);
  const [timeRangeData, setTimeRangeData] = useState([]);
  const { handleError } = useErrorHandling();

  const getTimeRangeById = async () => {
    try {
      const response = await getTimeRange({ id: formValues.time_range_id });
      const data = response.data;
      setTimeRangeData(data.data);
      console.log(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    if (formValues.time_range_id !== "") {
      getTimeRangeById();
    }
  }, []);

  const handleSave = async () => {
    if (updateRow) {
      if (validateForm()) {
        const id = formValues.id;
        const params = {
          name: formValues.name,
          time_range_id: formValues.time_range_id,
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

  const timeRangeDataHandler = async (value) => {
    try {
      const response = await getTimeRange({ name: value });
      const data = response.data;
      setTimeRangeData(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title} New Event</DialogTitle>
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
          <InputLabel htmlFor="time_range_id" required>
            Time Range
          </InputLabel>
          <Autocomplete
            options={timeRangeData}
            getOptionLabel={(option) =>
              `${option.start_time} - ${option.end_time}`
            }
            id="time_range_id"
            isOptionEqualToValue={(option, value) => {
              return option.id === value.id;
            }}
            onChange={(event, newValue) =>
              handleFieldChange({
                target: { name: "time_range_id", value: newValue?.id || "" },
              })
            }
            onInputChange={(event, value) => {
              if (value) {
                timeRangeDataHandler(value);
              } else {
                setTimeRangeData([]);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                id="time_range_id"
                name="time_range_id"
                placeholder={
                  timeRangeData.length > 0
                    ? `${timeRangeData[0].start_time}-${timeRangeData[0].end_time}`
                    : ""
                }
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

export default EventModel;
