import { redirect, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useErrorHandling = () => {
  const navigate = useNavigate();
  const handleError = (error) => {
    console.error("Error:", error);

    if (error.response) {
      const { status, data } = error.response;

      if (status === 500) {
        toast.error("Oops! Something went wrong.", {
          toastId: "serverError",
        });
      } else if (status === 401 || status === 403) {
        localStorage.clear();
        navigate("/login");
        toast.error("You are not Authorized Login first", {
          toastId: "authError",
        });
      } else if (status === 422) {
        let errorMessages = "";
        if (data.errors) {
          errorMessages = Object.values(data.errors)
            .flatMap((errorArray) => errorArray)
            .join("\n");
        } else {
          errorMessages = data.message || "An error occurred";
        }

        toast.error(`${errorMessages}\n${data.message}`, {
          toastId: "serverResponseError",
        });
      } else {
        const errorMessage = data.message || "An error occurred";
        toast.error(errorMessage, { toastId: "serverResponseError" });
      }
    }
  };
  return { handleError: handleError };
};

export default useErrorHandling;
