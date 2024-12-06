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
import useHttp from "../hooks/use-http";
import useErrorHandling from "../hooks/use-errorHandeler";
import {
  getAthlete,
  getCompetition,
  getScoreType,
} from "../Services/publicDataServices";
import AutoCompleteField from "./AutoCompleteCustom";
import * as yup from "yup";

const ResultsModel = ({ open, setOpen, url, updateRow, title }) => {
  const [formValues, setFormValues] = useState({
    id: updateRow?.id || "",
    athlete_id: updateRow?.athlete_id?.id || "",
    competition_id: updateRow?.competition_id?.id || "",
    place: updateRow?.place || "",
    score_type_id: updateRow?.score_type_id.id || "",
    score: updateRow?.score || "",
    margin: updateRow?.margin || "",
    percentile: updateRow?.percentile || "",
  });
  const { createData, updateData } = useHttp(url);
  const [competitionData, setCompetitionData] = useState([]);
  const [scoreTypeData, setScoreTypeData] = useState([]);
  const [athleteData, setAthleteData] = useState([]);
  const [errors, setErrors] = useState({});
  const { handleError } = useErrorHandling();
  const validationSchema = yup.object().shape({
    place: yup
      .number()
      .integer("Place must be an integer")
      .min(0, "Place cannot be negative")
      .required("Place is required"),
    margin: yup
      .number()
      .min(0, "Margin cannot be negative")
      .required("Margin is required"),
    percentile: yup
      .number()
      .min(0, "Percentile must be greater than or equal to 0")
      .max(100, "Percentile must be less than or equal to 100")
      .required("Percentile is required"),
    score: yup
      .string()
      .matches(
        /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
        "Invalid time format (HH:MM:SS)"
      )
      .required("Score is required"),
  });
  const getAthleteById = async () => {
    try {
      const response = await getAthlete({ id: formValues.athlete_id });
      const data = response.data;
      setAthleteData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  const getCompetitionById = async () => {
    try {
      const response = await getCompetition({ id: formValues.competition_id });
      const data = response.data;
      setCompetitionData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  const getScoreTypeById = async () => {
    try {
      const response = await getScoreType({
        id: formValues.score_type_id,
      });
      const data = response.data;
      setScoreTypeData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    if (formValues.athlete_id !== "" && formValues.competition_id !== "") {
      getAthleteById();
      getScoreTypeById();
      getCompetitionById();
    }
  }, []);

  const handleSave = async () => {
    if (updateRow) {
      if (validateForm()) {
        const id = formValues.id;
        const params = {
          athlete_id: formValues.athlete_id,
          competition_id: formValues.competition_id,
          place: formValues.place,
          score_type_id: formValues.score_type_id,
          score: formValues.score,
          margin: formValues.margin,
          percentile: formValues.percentile,
        };
        console.log(params);
        updateData(id, params);
        setOpen(false);
      }
    } else {
      const { id, ...formData } = formValues;
      if (validateForm()) {
        createData(formData);
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

  const athleteDataHandler = async (value) => {
    try {
      const response = await getAthlete({ name: value });
      const data = response.data;
      setAthleteData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  const competitionDataHandler = async (value) => {
    try {
      const response = await getCompetition({ name: value });
      const data = response.data;
      setCompetitionData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  const scoreTypeDataHandler = async (value) => {
    try {
      const response = await getScoreType({ name: value });
      const data = response.data;
      setScoreTypeData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  const handleFieldChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [fieldName]: fieldValue,
    }));

    // Validate the field on every change
    handleTimeScoreValidation(fieldName, fieldValue);
  };

  const handleTimeScoreValidation = async (fieldName, fieldValue) => {
    try {
      await validationSchema.validateAt(fieldName, {
        score: fieldValue,
        scoreTypeData,
      });
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: error.message,
      }));
    }
    try {
      await validationSchema.validateAt(fieldName, formValues);
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: error.message,
      }));
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title} New Result</DialogTitle>
        <DialogContent sx={{ width: "500px" }}>
          <DialogContentText>{title} a Record</DialogContentText>
          <AutoCompleteField
            label="Athlete"
            name="athlete_id"
            value={formValues.athlete_id || ""}
            options={athleteData}
            onValueChange={handleFieldChange}
            onInputChange={(event, value) => {
              if (value) {
                athleteDataHandler(value);
              } else {
                setAthleteData([]);
              }
            }}
          />
          <AutoCompleteField
            label="Competition"
            name="competition_id"
            value={formValues.competition_id || ""}
            options={competitionData}
            onValueChange={handleFieldChange}
            onInputChange={(event, value) => {
              if (value) {
                competitionDataHandler(value);
              } else {
                setCompetitionData([]);
              }
            }}
          />

          <AutoCompleteField
            label="Score Type"
            name="score_type_id"
            value={formValues.score_type_id || ""}
            options={scoreTypeData}
            onValueChange={handleFieldChange}
            onInputChange={(event, value) => {
              if (value) {
                scoreTypeDataHandler(value);
              } else {
                setScoreTypeData([]);
              }
            }}
          />
          {scoreTypeData.length > 0 && scoreTypeData[0].name === "Reps" && (
            <>
              <InputLabel htmlFor="score" required>
                Score
              </InputLabel>
              <TextField
                required
                id="score"
                margin="dense"
                name="score"
                fullWidth
                variant="standard"
                value={formValues.score || ""}
                onChange={handleFieldChange}
              />
            </>
          )}
          {scoreTypeData.length > 0 && scoreTypeData[0].name === "Time" && (
            <>
              <InputLabel htmlFor="score" required>
                Score
              </InputLabel>
              <TextField
                required
                id="score"
                margin="dense"
                name="score"
                fullWidth
                variant="standard"
                placeholder="HH:MM:SS"
                value={formValues.score || ""}
                onChange={handleFieldChange}
                onBlur={() =>
                  handleTimeScoreValidation("score", formValues.score)
                }
                error={!!errors.score}
                helperText={errors.score}
              />
            </>
          )}
          <InputLabel htmlFor="place" required>
            Place
          </InputLabel>
          <TextField
            required
            id="place"
            margin="dense"
            name="place"
            type="number"
            fullWidth
            variant="standard"
            value={formValues.place || ""}
            onChange={handleFieldChange}
            error={!!errors.place}
            helperText={errors.place}
            onBlur={() => handleTimeScoreValidation("place", formValues.place)}
          />
          <InputLabel htmlFor="margin" required>
            Margin
          </InputLabel>
          <TextField
            required
            id="margin"
            margin="dense"
            name="margin"
            fullWidth
            variant="standard"
            type="number"
            value={formValues.margin || ""}
            onChange={handleFieldChange}
            error={!!errors.margin}
            helperText={errors.margin}
            onBlur={() =>
              handleTimeScoreValidation("margin", formValues.margin)
            }
          />
          <InputLabel htmlFor="percentile" required>
            Percentile
          </InputLabel>
          <TextField
            required
            id="percentile"
            margin="dense"
            name="percentile"
            type="number"
            fullWidth
            variant="standard"
            value={formValues.percentile || ""}
            onChange={handleFieldChange}
            error={!!errors.percentile}
            helperText={errors.percentile}
            onBlur={() =>
              handleTimeScoreValidation("percentile", formValues.percentile)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={
              !!errors.score ||
              !!errors.place ||
              !!errors.margin ||
              !!errors.percentile
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResultsModel;
