import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  LinearProgress,
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
import AthleteModel from "../components/AthleteModel";
import { CustomToolbar } from "../components/girdCustomToolbar";
import config from "../Services/config.json";

const Athletes = () => {
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
  const URL = config.apiUrl + "/athletes";
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
      headerName: "Athlete Name",
      flex: 1,
      filterOperators: stringOperators,
    },
    {
      field: "gender_id",
      headerName: "Gender",
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="p">{params.row.gender_id.name}</Typography>
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
  const rows = rowData?.map((athlete, index) => ({
    id: athlete.id,
    serial: paginationModel.page * paginationModel.pageSize + index + 1,
    name: athlete.name,
    gender_id: {
      id: athlete.gender_id,
      name: athlete.gender?.name,
    },
  }));

  return (
    <Box sx={{ height: 400, width: "97%", margin: "10px" }}>
      <ToastContainer theme={theme.palette.mode} />
      <Paper elevation={3}>
        <Box p={2} display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h5" color={colors.primary[100]}>
            Atheletes Data
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add New Athelete
          </Button>
        </Box>
        {open && (
          <AthleteModel open={open} setOpen={setOpen} url={URL} title={"Add"} />
        )}
        {openUpdateConfirmation && (
          <AthleteModel
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

export default Athletes;
