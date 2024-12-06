import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { tokens } from "../../theme/theme";
import useHttp from "../../hooks/use-http";
import { useLocation } from "react-router-dom";
import DataGriTable from "../../components/DataGrid";
import { ToastContainer } from "react-toastify";
import ActionsButtonGrid from "../../components/ActionsButtonGrid";
import { getGridStringOperators } from "@mui/x-data-grid";
import ResultsModel from "../../components/ResultsModel";
import { CustomToolbar } from "../../components/girdCustomToolbar";
import config from "../../Services/config.json";

const Results = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openUpdateConfirmation, setOpenUpdateConfirmation] = useState(false);
  const [deleteRow, setDeleteRow] = useState({});
  const [updateRow, setUpdateRow] = useState({});
  const [rowData, setRowData] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([]);
  const URL = config.apiUrl + "/results";
  const { getData } = useHttp(
    URL,
    paginationModel,
    setRowData,
    setRowCountState,
    setPaginationModel,
    setFilterModel,
    setSortModel
  );
  useEffect(() => {
    getData();
  }, [location.search]);
  const stringOperators = getGridStringOperators().filter((op) =>
    ["contains", "equals"].includes(op.value)
  );

  const columns = [
    {
      field: "serial",
      headerName: "Sr#",
      flex: 0.1,
      sortable: false,
      filterable: false,
    },
    {
      field: "athlete_id",
      headerName: "Athlete Name",
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="p">{params.row.athlete_id?.name}</Typography>
      ),
    },
    {
      field: "competition_id",
      headerName: "Competition",
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="p">{params.row.competition_id?.name}</Typography>
      ),
    },
    {
      field: "year",
      headerName: "Year",
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="p">{params.row.year}</Typography>
      ),
    },
    {
      field: "event",
      headerName: "Event",
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="p">{params.row.event}</Typography>
      ),
    },
    {
      field: "place",
      headerName: "Place",
      flex: 0.4,
      filterOperators: stringOperators,
    },
    {
      field: "score_type_id",
      headerName: "Score Type",
      filterable: false,
      flex: 0.6,
      renderCell: (params) => (
        <Typography variant="p">{params.row.score_type_id?.name}</Typography>
      ),
    },
    {
      field: "score",
      headerName: "Score",
      flex: 0.6,
      filterOperators: stringOperators,
    },
    {
      field: "margin",
      headerName: "Margin",
      flex: 0.6,
      filterOperators: stringOperators,
    },
    {
      field: "percentile",
      headerName: "Percentile",
      flex: 0.6,
      filterOperators: stringOperators,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <ActionsButtonGrid
          row={params.row}
          setDeleteRow={setDeleteRow}
          setOpenDeleteConfirmation={setOpenDeleteConfirmation}
          setUpdateRow={setUpdateRow}
          setOpenUpdateConfirmation={setOpenUpdateConfirmation}
        />
      ),
    },
  ];
  const rows = rowData.map((result, index) => ({
    id: result.id,
    serial: paginationModel.page * paginationModel.pageSize + index + 1,
    athlete_id: {
      id: result.athlete_id,
      name: result.athlete?.name,
    },
    competition_id: {
      id: result.competition_id,
      name: result.competition?.name,
    },
    year: result.competition?.year,
    event: result.competition?.event?.name,
    place: result.place,
    // score_type_id: result.score_type_id,
    score_type_id: {
      id: result.score_type_id,
      name: result.score_type?.name,
    },
    score: result.score,
    margin: result.margin,
    percentile: result.percentile,
  }));
  return (
    <Box sx={{ height: 400, width: "97%", margin: "10px" }}>
      <ToastContainer theme={theme.palette.mode} />
      <Paper elevation={3}>
        <Box p={2} display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h5" color={colors.primary[100]}>
            Results Data
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add New Reslut
          </Button>
        </Box>
        {open && (
          <ResultsModel open={open} setOpen={setOpen} url={URL} title={"Add"} />
        )}
        {openUpdateConfirmation && (
          <ResultsModel
            open={openUpdateConfirmation}
            setOpen={setOpenUpdateConfirmation}
            url={URL}
            title={"Update"}
            updateRow={updateRow}
          />
        )}
        <DataGriTable
          rows={rows}
          columns={columns}
          url={URL}
          slots={{
            toolbar: CustomToolbar,
            loadingOverlay: LinearProgress,
          }}
          openDeleteConfirmation={openDeleteConfirmation}
          deleteRow={deleteRow}
          setOpenDeleteConfirmation={setOpenDeleteConfirmation}
          rowCountState={rowCountState}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
          sortModel={sortModel}
          setSortModel={setSortModel}
        />
      </Paper>
    </Box>
  );
};

export default Results;
