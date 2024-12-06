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
import { ToastContainer } from "react-toastify";
import DataGriTable from "../../components/DataGrid";
import useHttp from "../../hooks/use-http";
import useErrorHandling from "../../hooks/use-errorHandeler";
import { useLocation } from "react-router-dom";
import {
  getCompetition,
  getGender,
  getTimeRange,
} from "../../Services/publicDataServices";
import config from "../../Services/config.json";

const Event = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [eventData, setEventData] = useState({
    gender: null,
    year: null,
    time_range: null,
    competition: null,
  });
  const [rowData, setRowData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [timeRangeData, setTimeRangeData] = useState([]);
  const [competitionData, setCompetitionData] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const URL = config.apiUrl + "/search/event";
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
      eventData.gender !== null &&
      eventData.year !== null &&
      eventData.gender !== undefined &&
      eventData.year !== undefined
    ) {
      timeOutId = setTimeout(() => getSpecificRowData(eventData), 500);
    } else {
      setRowData([]);
    }
    return () => clearTimeout(timeOutId);
  }, [eventData]);

  useEffect(() => {
    getSpecificRowData(eventData);
  }, [location.search]);

  const genderDataHandler = async (value) => {
    try {
      const response = await getGender({ name: value });
      const data = response.data;
      setGenderData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  const timeRangeDataHandler = async (value) => {
    try {
      const response = await getTimeRange({ time: value });
      const data = response.data;
      setTimeRangeData(data.data);
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
  const rows = rowData?.map((task, index) => ({
    id: task.id,
    serial: paginationModel.page * paginationModel.pageSize + index + 1,
    event_name: task.event_name,
    gender: task.gender,
    year: task.year,
    competition_name: task.competition_name,
    timeRange: task.timeRange,
    task: task.tasks,
    avg_score: task.avg_score,
    win_score: task.win_score,
  }));

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setEventData((prevValues) => {
      if (name === "year" && value === "") {
        const { year, ...newValues } = prevValues;
        return newValues;
      } else if (name === "competition" && value === "") {
        const { competition, ...newValues } = prevValues;
        return newValues;
      }
      return { ...prevValues, [name]: value };
    });
  };
  return (
    <Box sx={{ margin: "20px" }}>
      <ToastContainer theme={theme.palette.mode} />
      <Paper elevation={3}>
        <Box pl={2} pt={2}>
          <Typography variant="h5" color={colors.primary[100]}>
            Event Data
          </Typography>
        </Box>
        <Box pr={2} display={"flex"} justifyContent={"flex-end"} gap={1}>
          <Autocomplete
            sx={{ width: 250 }}
            options={genderData}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => {
              return option.id === value.id;
            }}
            onChange={(event, newValue) =>
              handleFieldChange({
                target: { name: "gender", value: newValue?.id },
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
                name="gender"
                label="Gender"
                variant="standard"
              />
            )}
          />
          <TextField
            sx={{ width: 100 }}
            required
            id="standard-basic"
            name="year"
            label="Year"
            variant="standard"
            onChange={handleFieldChange}
          />
          <Autocomplete
            sx={{ width: 250 }}
            options={timeRangeData}
            getOptionLabel={(option) =>
              `${option.start_time} - ${option.end_time}`
            }
            isOptionEqualToValue={(option, value) => {
              return option.id === value.id;
            }}
            onChange={(event, newValue) =>
              handleFieldChange({
                target: { name: "time_range", value: newValue?.id },
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
                id="id"
                name="time_range"
                label="Time Range"
                variant="standard"
              />
            )}
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
                target: { name: "competition", value: newValue?.id },
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
                name="competition"
                label="Competition"
                variant="standard"
              />
            )}
          />
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

export default Event;

const columns = [
  {
    field: "serial",
    headerName: "Sr#",
    flex: 0.2,
    sortable: false,
    filterable: false,
  },
  {
    field: "event_name",
    headerName: "Event Name",
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
    field: "avg_score",
    headerName: "Avg Score",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "win_score",
    headerName: "Win Score",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "task",
    headerName: "Tasks",
    flex: 2,
    sortable: false,
    filterable: false,
  },
];
