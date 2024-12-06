import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthToken } from "../util/auth";
import { toast } from "react-toastify";
import useErrorHandling from "./use-errorHandeler";

const useHttp = (
  url,
  paginationModel,
  setRowData,
  setRowCountState,
  setPaginationModel,
  setFilterModel,
  setSortModel
) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [customData, setCustomData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { handleError: handleErrorResponse } = useErrorHandling();
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const hasQueryParams = params.keys().next().done === false;

    if (!hasQueryParams) {
      // Params has query parameters
      const param = new URLSearchParams({
        page: paginationModel.page,
        page_size: paginationModel.pageSize,
      });
      navigate(`?${param.toString()}`, { replace: true });
    }
    const page = params.get("page") || paginationModel.page;
    const pageSize = params.get("page_size") || paginationModel.pageSize;

    // Construct the sort object
    const sortField = params.get("sort[0][field]");
    const sortDirection = params.get("sort[0][sort]");
    const sort =
      sortField && sortDirection
        ? [{ field: sortField, sort: sortDirection }]
        : [];

    // Construct the filter object
    const filterField = params.get("filter[0][field]");
    const filterOperator = params.get("filter[0][operator]");
    const filterValue = params.get("filter[0][value]");
    const filter =
      filterField && filterOperator && filterValue
        ? {
            field: filterField,
            operator: filterOperator,
            value: filterValue,
          }
        : null;
    if (setFilterModel) {
      setFilterModel({ items: filter ? [filter] : [] });
    }
    if (setPaginationModel) {
      setPaginationModel({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
    }
    if (setSortModel) {
      setSortModel(sort);
    }

    return {
      page: parseInt(page) + 1,
      page_size: pageSize,
      sort,
      filter: [filter],
    };
  };
  const addInQueryPrams = (method) => {
    const queryParams = new URLSearchParams(location.search);
    const existingMethod = queryParams.get("method");
    if (existingMethod === method) {
      // Increment the number if the method already exists
      let count = 1;
      while (queryParams.has(`${method}${count}`)) {
        count++;
      }
      queryParams.set("method", `${method}${count}`);
    } else {
      // Set the method if it doesn't exist
      queryParams.set("method", method);
    }
    const updatedParams = queryParams.toString();
    navigate(`?${updatedParams}`, { replace: true });
  };

  const getData = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          ...getQueryParams(),
        },
        headers: {
          Authorization: "Bearer " + getAuthToken(),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = response?.data;
      if (setRowData) {
        setRowData(data.data.data);
      }
      if (setRowCountState) {
        setRowCountState(data.data.total);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getSpecificRowData = async (params) => {
    try {
      const response = await axios.get(url, {
        params: {
          ...getQueryParams(),
          ...params,
        },
        headers: {
          Authorization: "Bearer " + getAuthToken(),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = response?.data;
      if (setRowData) {
        setRowData(data.data.data);
      }
      setCustomData(data.custom_data);
      if (setRowCountState) {
        setRowCountState(data.data.meta.total);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setRowData([]);
      } else {
        handleErrorResponse(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const createData = async (params) => {
    try {
      const response = await axios.post(
        url,
        { ...params },
        {
          headers: {
            Authorization: "Bearer " + getAuthToken(),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      addInQueryPrams("add");
    } catch (error) {
      handleErrorResponse(error);
    }
  };
  const updateData = async (id, param) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        url + "/" + id,
        { ...param },
        {
          headers: {
            Authorization: "Bearer " + getAuthToken(),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      addInQueryPrams("update");
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteData = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(url + "/" + id, {
        headers: {
          Authorization: "Bearer " + getAuthToken(),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      toast.success(response.data.message);
      addInQueryPrams("delete");
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isLoading: isLoading,
    setIsLoading: setIsLoading,
    getData: getData,
    getSpecificRowData: getSpecificRowData,
    createData: createData,
    updateData: updateData,
    deleteData: deleteData,
    customData,
  };
};
export default useHttp;
