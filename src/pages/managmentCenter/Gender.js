import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import AddNewModal from "../../components/AddNewModal";
import DataGriTable from "../../components/DataGrid";
import { getGridStringOperators } from "@mui/x-data-grid";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import ActionsButtonGrid from "../../components/ActionsButtonGrid";
import useHttp from "../../hooks/use-http";
import { CustomToolbar } from "../../components/girdCustomToolbar";
import config from "../../Services/config.json";

const Gender = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openUpdateConfirmation, setOpenUpdateConfirmation] = useState(false);
  const [updateRow, setUpdateRow] = useState({});
  const [rowData, setRowData] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([]);
  const URL = config.apiUrl + "/genders";

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
      headerName: "Gender",
      flex: 1,
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
          notDeleteRow={true}
          setUpdateRow={setUpdateRow}
          setOpenUpdateConfirmation={setOpenUpdateConfirmation}
        />
      ),
    },
  ];
  const rows = rowData.map((gender, index) => ({
    id: gender.id,
    serial: paginationModel.page * paginationModel.pageSize + index + 1,
    name: gender.name,
  }));
  return (
    <Box sx={{ height: 400, width: "97%", margin: "10px" }}>
      <ToastContainer theme={theme.palette.mode} />
      <Paper elevation={3}>
        <Box p={2} display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h5" color={colors.primary[100]}>
            Gender Data
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add new Gender
          </Button>
        </Box>
        {open && (
          <AddNewModal
            open={open}
            setOpen={setOpen}
            heading={"Add new Gender"}
            formData={{ name: "" }}
            method={"add"}
            url={URL}
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
          updateRow={updateRow}
          openUpdateConfirmation={openUpdateConfirmation}
          setOpenUpdateConfirmation={setOpenUpdateConfirmation}
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

export default Gender;
