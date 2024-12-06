import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { InputLabel } from "@mui/material";

const AutoCompleteField = ({
  label,
  name,
  options,
  onValueChange,
  onInputChange,
}) => {
  // console.log(options);
  return (
    <>
      <InputLabel htmlFor={name} required>
        {label}
      </InputLabel>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.name}
        id={name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, newValue) =>
          onValueChange({
            target: { name, value: newValue?.id || "" },
          })
        }
        onInputChange={onInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            id={name}
            name={name}
            placeholder={options.length > 0 ? options[0].name : ""}
            variant="standard"
          />
        )}
      />
    </>
  );
};

export default AutoCompleteField;
