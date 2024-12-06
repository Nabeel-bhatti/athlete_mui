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
import { getAthlete } from "../../Services/publicDataServices";
import config from "../../Services/config.json";

const Athlete = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [formValues, setFormValues] = useState({
    id: "",
  });

  const [rowData, setRowData] = useState([]);
  const [athleteData, setAthleteData] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const URL = config.apiUrl + "/search/athlete";
  const { getSpecificRowData, customData } = useHttp(
    URL,
    paginationModel,
    setRowData,
    setRowCountState,
    setPaginationModel
  );
  const { handleError } = useErrorHandling();

  useEffect(() => {
    if (formValues.id !== "" && formValues.id !== undefined) {
      getSpecificRowData({ athlete: formValues.id });
    } else {
      setRowData([]);
    }
  }, [formValues.id, location.search]);

  const athleteDataHandler = async (value) => {
    try {
      const response = await getAthlete({ name: value });
      const data = response.data;
      setAthleteData(data.data);
    } catch (error) {
      handleError(error);
    }
  };
  const onInputChange = (event, value, reason) => {
    if (value) {
      athleteDataHandler(value);
    } else {
      setAthleteData([]);
    }
  };
  const rows = rowData?.map((athlete, index) => ({
    id: athlete.id,
    serial: paginationModel.page * paginationModel.pageSize + index + 1,
    athlete: athlete.athlete,
    year: athlete.year,
    competition: athlete.competition,
    event: athlete.event,
    win_score: athlete.win_score,
    avg_score: athlete.avg_score,
    place: athlete.place,
    score: athlete.score,
    margin: athlete.margin,
    percentile: athlete.percentile,
  }));
  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  };
  return (
    <Box sx={{ margin: "20px" }}>
      <ToastContainer theme={theme.palette.mode} />
      <Paper elevation={3}>
        <Box pl={2} pt={2}>
          <Typography variant="h5" color={colors.primary[100]}>
            Athlete Data
          </Typography>
        </Box>
        <Box pr={2} display={"flex"} justifyContent={"flex-end"}>
          <Autocomplete
            sx={{ width: 300 }}
            options={athleteData}
            getOptionLabel={(option) => option.name}
            id="athlete_id"
            isOptionEqualToValue={(option, value) => {
              return option.id === value.id;
            }}
            onChange={(event, newValue) =>
              handleFieldChange({
                target: { name: "id", value: newValue?.id },
              })
            }
            onInputChange={onInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                id="id"
                name="id"
                label="Search Athlete"
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

export default Athlete;

const columns = [
  {
    field: "serial",
    headerName: "Sr#",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "athlete",
    headerName: "Athlete Name",
    flex: 1,
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
    field: "competition",
    headerName: "Competition",
    flex: 1,
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
    field: "win_score",
    headerName: "Win Score",
    flex: 0.5,
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
    flex: 1,
    sortable: false,
    filterable: false,
  },
];
