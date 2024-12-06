import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import DataGriTable from "../components/DataGrid";
import { getGridStringOperators } from "@mui/x-data-grid";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import ActionsButtonGrid from "../components/ActionsButtonGrid";
import useHttp from "../hooks/use-http";
import EventModel from "../components/EventModel";
import { CustomToolbar } from "../components/girdCustomToolbar";
import config from "../Services/config.json";

const Events = () => {
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
  const URL = config.apiUrl + "/events";
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
      flex: 0.5,
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Event Name",
      filterable: true,
      flex: 1,
      filterOperators: stringOperators,
    },
    {
      field: "time_range_id",
      headerName: "Time Range",
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="p">
          Start: {params.row.time_range_id.start_time} End:{" "}
          {params.row.time_range_id.end_time}
        </Typography>
      ),
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
          notDeleteRow={true}
          setDeleteRow={setDeleteRow}
          setOpenDeleteConfirmation={setOpenDeleteConfirmation}
          setUpdateRow={setUpdateRow}
          setOpenUpdateConfirmation={setOpenUpdateConfirmation}
        />
      ),
    },
  ];
  const rows = rowData?.map((event, index) => ({
    id: event.id,
    serial: paginationModel.page * paginationModel.pageSize + index + 1,
    name: event.name,
    time_range_id: {
      id: event.time_range_id,
      start_time: event.time_range.start_time,
      end_time: event.time_range.end_time,
    },
  }));

  return (
    <Box sx={{ height: 400, width: "97%", margin: "10px" }}>
      <ToastContainer theme={theme.palette.mode} />
      <Paper elevation={3}>
        <Box p={2} display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h5" color={colors.primary[100]}>
            Events Data
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add New Event
          </Button>
        </Box>
        {open && (
          <EventModel open={open} setOpen={setOpen} url={URL} title={"Add"} />
        )}
        {openUpdateConfirmation && (
          <EventModel
            open={openUpdateConfirmation}
            setOpen={setOpenUpdateConfirmation}
            url={URL}
            updateRow={updateRow}
            title={"Update"}
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

export default Events;
