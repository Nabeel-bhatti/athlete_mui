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
} from "@mui/material";
import { toast } from "react-toastify";
import { getGender, getEvent } from "../Services/publicDataServices";
import useHttp from "../hooks/use-http";
import useErrorHandling from "../hooks/use-errorHandeler";
import AutoCompleteField from "./AutoCompleteCustom";

const CompetitionModel = ({ open, setOpen, url, updateRow, title }) => {
  const [formValues, setFormValues] = useState({
    id: updateRow?.id || "",
    name: updateRow?.name || "",
    win_score: updateRow?.win_score || "",
    avg_score: updateRow?.avg_score || "",
    year: updateRow?.year || "",
    event_id: updateRow?.event_id?.id || "",
    gender_id: updateRow?.gender_id?.id || "",
  });
  const { createData, updateData } = useHttp(url);
  const [genderData, setGenderData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const { handleError } = useErrorHandling();

  const getGenderById = async () => {
    try {
      const response = await getGender({ id: formValues.gender_id });
      const data = response.data;
      setGenderData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  const getEventById = async () => {
    try {
      const response = await getEvent({ id: formValues.event_id });
      const data = response.data;
      setEventsData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    if (formValues.gender_id !== "" && formValues.event !== "") {
      getGenderById();
      getEventById();
    }
  }, []);

  const handleSave = async () => {
    if (updateRow) {
      if (validateForm()) {
        const id = formValues.id;
        const params = {
          name: formValues.name,
          win_score: formValues.win_score,
          year: formValues.year,
          avg_score: formValues.avg_score,
          event_id: formValues.event_id,
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
  const eventDataHandler = async (value) => {
    try {
      const response = await getEvent({ name: value });
      const data = response.data;
      setEventsData(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title} New Competition</DialogTitle>
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
          <InputLabel htmlFor="win_score" required>
            Win Score
          </InputLabel>
          <TextField
            id="win_score"
            margin="dense"
            name="win_score"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.win_score || ""}
            onChange={handleFieldChange}
          />
          <InputLabel htmlFor="avg_score" required>
            Avg Score
          </InputLabel>
          <TextField
            id="avg_score"
            margin="dense"
            name="avg_score"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.avg_score || ""}
            onChange={handleFieldChange}
          />
          <InputLabel htmlFor="year" required>
            Year
          </InputLabel>
          <TextField
            id="year"
            margin="dense"
            name="year"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.year || ""}
            onChange={handleFieldChange}
          />
          <AutoCompleteField
            label="Gender"
            name="gender_id"
            value={formValues.gender_id || ""}
            options={genderData}
            onValueChange={handleFieldChange}
            onInputChange={(event, value) => {
              if (value) {
                genderDataHandler(value);
              } else {
                setGenderData([]);
              }
            }}
          />
          <AutoCompleteField
            label="Event"
            name="event_id"
            value={formValues.event_id || ""}
            options={eventsData}
            onValueChange={handleFieldChange}
            onInputChange={(event, value) => {
              if (value) {
                eventDataHandler(value);
              } else {
                setEventsData([]);
              }
            }}
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

export default CompetitionModel;
