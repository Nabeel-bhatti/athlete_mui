import React from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddNewModal from "./AddNewModal";
import { useNavigate } from "react-router-dom";
import useHttp from "../hooks/use-http";
import DeleteModal from "./DeleteModal";
const DataGriTable = ({
  columns,
  openDeleteConfirmation,
  deleteRow,
  setOpenDeleteConfirmation,
  openUpdateConfirmation,
  updateRow,
  setOpenUpdateConfirmation,
  rows,
  columnVisibilityModel,
  rowCountState,
  paginationModel,
  setPaginationModel,
  filterModel,
  setFilterModel,
  sortModel,
  setSortModel,
  slots,
  url,
}) => {
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useHttp(url);

  // Pagination Funtionality
  const handlePaginationModelChange = async (newPaginationModel) => {
    setIsLoading(true);
    const { page, pageSize } = newPaginationModel;
    let sorting = [];
    let filtering = [];
    if (sortModel?.length > 0) {
      const { field, sort } = sortModel[0];
      sorting = [
        {
          field: field,
          sort: sort,
        },
      ];
    }
    if (filterModel?.items.length > 0) {
      const { field: fieldName, operator, value } = filterModel.items[0];
      if (value !== undefined) {
        filtering = [
          {
            field: fieldName,
            operator: operator,
            value: value,
          },
        ];
      }
    }
    setPaginationModel({
      page,
      pageSize,
    });
    queryParameters(filtering, sorting, page, pageSize);
  };
  // Sorting Funtionality
  const handleSortModelChange = async (newSortModel) => {
    setIsLoading(true);
    setSortModel(newSortModel);
    const { page, pageSize } = paginationModel;
    let sorting = [];
    if (newSortModel.length > 0) {
      const { field, sort } = newSortModel[0];
      sorting = [
        {
          field: field,
          sort: sort,
        },
      ];
    }
    let filtering = [];
    if (filterModel.items.length > 0) {
      const { field: fieldName, operator, value } = filterModel.items[0];
      if (value !== undefined) {
        filtering = [
          {
            field: fieldName,
            operator: operator,
            value: value,
          },
        ];
      }
    }
    queryParameters(filtering, sorting, page, pageSize);
  };

  // Filtering Functionality
  const handleFilterModelChange = async (newFilterModel) => {
    setIsLoading(true);
    setFilterModel(newFilterModel);
    const { page, pageSize } = paginationModel;
    let sorting = [];
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sorting = [
        {
          field: field,
          sort: sort,
        },
      ];
    }
    let filtering = [];
    if (newFilterModel.items.length > 0) {
      const { field, operator, value } = newFilterModel.items[0];
      if (value !== undefined) {
        filtering = [
          {
            field: field,
            operator: operator,
            value: value,
          },
        ];
      }
    }
    queryParameters(filtering, sorting, page, pageSize);
  };

  const queryParameters = (filtering, sorting, page, pageSize) => {
    const params = new URLSearchParams({
      page: page,
      page_size: pageSize,
    });
    if (sorting.length > 0) {
      params.append("sort[0][field]", sorting[0].field);
      params.append("sort[0][sort]", sorting[0].sort);
    }
    if (filtering.length > 0 && filtering[0].value !== undefined) {
      params.append("filter[0][field]", filtering[0].field);
      params.append("filter[0][operator]", filtering[0].operator);
      params.append("filter[0][value]", filtering[0].value);
    }
    navigate(`?${params.toString()}`, { replace: true });
    setIsLoading(false);
  };

  const handleDeleteConfirmationClose = () => {
    setOpenDeleteConfirmation(false);
  };

  return (
    <>
      <Box p={2}>
        <DataGrid
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          rows={rows}
          rowCount={rowCountState}
          slots={slots}
          autoHeight={true}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          sortModel={sortModel}
          filterMode="server"
          onFilterModelChange={handleFilterModelChange}
          filterModel={filterModel}
          loading={isLoading}
          paginationMode="server"
          pageSizeOptions={[10, 20, 30]}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          rowsPerPage={
            paginationModel.pageSize !== undefined
              ? paginationModel.pageSize
              : 10
          }
        />
        {/*On Delete Dailog Implementaion*/}
        <DeleteModal
          url={url}
          openDeleteConfirmation={openDeleteConfirmation}
          handleDeleteConfirmationClose={handleDeleteConfirmationClose}
          deleteRow={deleteRow}
        />
        {/* On Update Dailog Implementaion */}
        {openUpdateConfirmation && (
          <AddNewModal
            open={openUpdateConfirmation}
            setOpen={setOpenUpdateConfirmation}
            heading={"Update Record"}
            formData={updateRow}
            method={"update"}
            url={url}
          />
        )}
      </Box>
    </>
  );
};

export default DataGriTable;
