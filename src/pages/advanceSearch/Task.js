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
import { getTask } from "../../Services/publicDataServices";
import config from "../../Services/config.json";

const Task = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [rowData, setRowData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const URL = config.apiUrl + "/search/task";
  const { handleError } = useErrorHandling();
  const { getSpecificRowData } = useHttp(
    URL,
    paginationModel,
    setRowData,
    setRowCountState,
    setPaginationModel
  );

  useEffect(() => {
    getSpecificRowData({ tasks: tasks });
  }, [tasks, location.search]);

  const taskDataHandler = async (value) => {
    try {
      const response = await getTask({ name: value });
      const data = response.data;
      setTaskData(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleTaskChange = (event, newValue) => {
    if (newValue.length >= 1 && newValue.length <= 3) {
      const selectedTaskIds = newValue.map((task) => task.id);
      setTasks(selectedTaskIds);
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
  return (
    <Box sx={{ margin: "20px" }}>
      <ToastContainer theme={theme.palette.mode} />
      <Paper elevation={3}>
        <Box pl={2} pt={2}>
          <Typography variant="h5" color={colors.primary[100]}>
            Task Data
          </Typography>
        </Box>
        <Box pr={2} display={"flex"} justifyContent={"flex-end"} gap={1}>
          <Autocomplete
            multiple
            sx={{ width: 300 }}
            options={taskData}
            getOptionLabel={(option) => option.name}
            getOptionDisabled={(option) =>
              tasks.length === 3 && !tasks.includes(option.id)
            }
            filterOptions={(options) => options}
            isOptionEqualToValue={(option, value) => {
              return option.id === value.id;
            }}
            onChange={handleTaskChange}
            onInputChange={(event, value) => {
              if (value) {
                taskDataHandler(value);
              } else {
                setTaskData([]);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                id="id"
                name="id"
                label="Search Tasks"
                variant="standard"
              />
            )}
            disableClearable={true}
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

export default Task;

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
