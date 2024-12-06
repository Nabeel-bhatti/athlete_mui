import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  LinearProgress,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme/theme";
import { ToastContainer, toast } from "react-toastify";
import DataGriTable from "../../components/DataGrid";
import useHttp from "../../hooks/use-http";
import useErrorHandling from "../../hooks/use-errorHandeler";
import { useLocation } from "react-router-dom";
import { getCompetition, getGender } from "../../Services/publicDataServices";
import config from "../../Services/config.json";

const Performance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [performanceData, setPerformanceData] = useState({
    gender_id: null,
    min_percentile: null,
    max_percentile: null,
    year: null,
    competition_id: null,
  });
  const [rowData, setRowData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [competitionData, setCompetitionData] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const URL = config.apiUrl + "/search/performance";
  const { getSpecificRowData } = useHttp(
    URL,
    paginationModel,
    setRowData,
    setRowCountState,
    setPaginationModel
  );
  const { handleError } = useErrorHandling();

  useEffect(() => {
    let timeOutId = null;
    if (
      performanceData.gender_id !== null &&
      performanceData.min_percentile !== null &&
      performanceData.max_percentile !== null &&
      performanceData.gender_id !== undefined &&
      performanceData.min_percentile !== undefined &&
      performanceData.max_percentile !== undefined
    ) {
      timeOutId = setTimeout(() => getSpecificRowData(performanceData), 500);
    } else {
      setRowData([]);
    }
    return () => clearTimeout(timeOutId);
  }, [performanceData, location.search]);

  const genderDataHandler = async (value) => {
    try {
      const response = await getGender({ name: value });
      const data = response.data;
      setGenderData(data.data);
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

  const rows = rowData?.map((performance, index) => ({
    id: performance.id,
    serial: paginationModel.page * paginationModel.pageSize + index + 1,
    athlete_name: performance.athlete_name,
    gender: performance.gender,
    year: performance.year,
    competition_name: performance.competition_name,
    timeRange: performance.timeRange,
    event: performance.event,
    place: performance.place,
    score: performance.score,
    margin: performance.margin,
    percentile: performance.percentile,
  }));

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    if (name === "min_percentile" && value !== "") {
      const parsedValue = parseFloat(value);
      if (parsedValue >= 0 && parsedValue <= 100) {
        setPerformanceData({ ...performanceData, [name]: parsedValue });
      } else {
        toast.error("Invalid Min Value: must be greater or = 0", {
          toastId: "minFieldError",
        });
      }
    } else if (name === "max_percentile" && value !== "") {
      const parsedValue = parseFloat(value);
      if (parsedValue >= 0 && parsedValue <= 100) {
        setPerformanceData({ ...performanceData, [name]: parsedValue });
      } else {
        toast.error("Invalid Max Value: must be less or = 100", {
          toastId: "maxFieldError",
        });
      }
    } else {
      setPerformanceData((prevValues) => {
        if (name === "year" && value === "") {
          const { year, ...newValues } = prevValues;
          return newValues;
        } else if (name === "competition" && value === "") {
          const { competition, ...newValues } = prevValues;
          return newValues;
        }
        return { ...prevValues, [name]: value };
      });
    }
  };
  console.log({ performanceData });
  return (
    <Box sx={{ margin: "20px" }}>
      <ToastContainer theme={theme.palette.mode} />
      <Paper elevation={3}>
        <Box pl={2} pt={2}>
          <Typography variant="h5" color={colors.primary[100]}>
            Performance Data
          </Typography>
        </Box>
        <Box pr={2} display={"flex"} justifyContent={"flex-end"}>
          <Box display={"flex"} gap={1}>
            <Autocomplete
              sx={{ width: 250 }}
              options={genderData}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => {
                return option.id === value.id;
              }}
              onChange={(event, newValue) =>
                handleFieldChange({
                  target: { name: "gender_id", value: newValue?.id },
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
                  id="id"
                  name="gender_id"
                  label="Gender"
                  variant="standard"
                />
              )}
            />
            <TextField
              sx={{ width: 120 }}
              required
              id="standard-basic"
              name="min_percentile"
              placeholder="Min 0"
              label="Min Percentile"
              variant="standard"
              onChange={handleFieldChange}
            />
            <TextField
              sx={{ width: 120 }}
              required
              id="standard-basic"
              name="max_percentile"
              label="Max Percentile"
              placeholder="Max 100"
              variant="standard"
              onChange={handleFieldChange}
            />
            <Autocomplete
              sx={{ width: 250 }}
              options={competitionData}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => {
                return option.id === value.id;
              }}
              onChange={(event, newValue) =>
                handleFieldChange({
                  target: { name: "competition_id", value: newValue?.id },
                })
              }
              onInputChange={(event, value) => {
                if (value) {
                  competitionDataHandler(value);
                } else {
                  setCompetitionData([]);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="id"
                  name="competition_id"
                  label="Competition"
                  variant="standard"
                />
              )}
            />
            <TextField
              sx={{ width: 100 }}
              id="standard-basic"
              name="year"
              label="Year"
              variant="standard"
              onChange={handleFieldChange}
            />
          </Box>
        </Box>

        <DataGriTable
          rows={rows}
          columns={columns}
          url={URL}
          slots={{
            loadingOverlay: LinearProgress,
          }}
          rowCountState={rowCountState}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Paper>
    </Box>
  );
};

export default Performance;

const columns = [
  {
    field: "serial",
    headerName: "Sr#",
    flex: 0.2,
    sortable: false,
    filterable: false,
  },
  {
    field: "athlete_name",
    headerName: "Athlete Name",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "gender",
    headerName: "Gender",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "year",
    headerName: "Year",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "competition_name",
    headerName: "Competition",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "timeRange",
    headerName: "Time Range",
    flex: 0.7,
    sortable: false,
    filterable: false,
  },
  {
    field: "event",
    headerName: "Event Name",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "place",
    headerName: "Place",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "score",
    headerName: "Score",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "margin",
    headerName: "Margin",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "percentile",
    headerName: "Percentile",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
];
