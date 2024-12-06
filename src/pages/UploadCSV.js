import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { tokens } from "../theme/theme";
import axios from "axios";
import config from "../Services/config.json";
import { getAuthToken } from "../util/auth";
import useErrorHandling from "../hooks/use-errorHandeler";

const UploadCSV = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCancelToken, setUploadCancelToken] = useState(null);
  const { handleError } = useErrorHandling();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload/POST File Funtionality
  const handleUpload = () => {
    if (!selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append("csvFile", selectedFile, "csvFile.csv");
    console.log(formData);
    const cancelToken = axios.CancelToken.source();
    setUploadCancelToken(cancelToken);
    axios
      .post(config.apiUrl + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + getAuthToken(),
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
        cancelToken: cancelToken.token, // Set the cancel toke
      })
      .then((res) => {
        setUploadProgress(0);
        setSelectedFile(null);
        toast.success("File Uploaded successfully.");
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          // Request was canceled
          toast.error("Upload Canceld");
        } else {
          setUploadProgress(0);
          handleError(error);
        }
      });
  };

  // Cancel Upload Funtionality
  const cancelUpload = () => {
    console.log(uploadCancelToken);
    if (uploadCancelToken) {
      uploadCancelToken.cancel("Upload canceled by user.");
      setUploadProgress(null);
    }
  };

  return (
    <>
      <Box sx={{ margin: "10px" }}>
        <ToastContainer theme={theme.palette.mode} />
        <Paper elevation={3} sx={{ padding: "10px" }}>
          <Box p={2} display={"flex"} justifyContent={"space-between"}>
            <Typography variant="h5" color={colors.primary[100]}>
              Upload CSV
            </Typography>
          </Box>
          <Box m={5}>
            <Box m={1}>
              {/* Upload  File Implementation */}
              <input
                type="file"
                style={{ display: "none" }}
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  component="span"
                  sx={{ mr: 5 }}
                  variant="contained"
                  color="primary"
                >
                  Select File
                </Button>
              </label>
              <Button
                onClick={handleUpload}
                variant="contained"
                color="primary"
              >
                {uploadProgress < 99 && uploadProgress > 1
                  ? "Uploading..."
                  : "Upload"}
              </Button>
            </Box>
            {selectedFile && (
              <Typography
                variant="p"
                sx={{ mr: 2, display: "flex", alignContent: "center" }}
              >
                {selectedFile.name}
                <CloseOutlined onClick={() => setSelectedFile(null)} />
              </Typography>
            )}
            {/* uploadProgress Bar Implementation */}
            {uploadProgress > 0 && (
              <Box mt={2} width={"100%"}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Box mt={1} textAlign="center">
                  {uploadProgress}%
                </Box>
                <Box mt={1} textAlign="center">
                  <Button
                    onClick={cancelUpload}
                    sx={{ color: "white" }}
                    variant="contained"
                    color="danger"
                  >
                    Cancel Upload
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default UploadCSV;
