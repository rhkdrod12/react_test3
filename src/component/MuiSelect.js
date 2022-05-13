import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function MuiSelect() {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [state, setState] = React.useState(false);

  const onToggle = (event) => {
    setState((val) => ({ ...val, error: !val.error }));
  };

  return (
    <div>
      <button onClick={onToggle}>click</button>
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }} disabled>
          <InputLabel id="demo-simple-select-disabled-label">Age</InputLabel>
          <Select labelId="demo-simple-select-disabled-label" id="demo-simple-select-disabled" value={age} label="Age" onChange={handleChange}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          <FormHelperText>Disabled</FormHelperText>
        </FormControl>
      </div>

      <FormControl sx={{ m: 1, minWidth: 120 }} {...state}>
        <InputLabel id="demo-simple-select-error-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-error-label"
          id="demo-simple-select-error"
          value={age}
          label="Age"
          onChange={handleChange}
          //   renderValue={(value, qwe) => {
          //     return `⚠️${value}`;
          //   }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        {state.error ? <FormHelperText>필수 입력값입니다.</FormHelperText> : null}
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-readonly-label">Age</InputLabel>
        <Select labelId="demo-simple-select-readonly-label" id="demo-simple-select-readonly" value={age} label="Age" onChange={handleChange} inputProps={{ readOnly: true }}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Read only</FormHelperText>
      </FormControl>
      <FormControl required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-required-label">Age</InputLabel>
        <Select labelId="demo-simple-select-required-label" id="demo-simple-select-required" value={age} label="Age *" onChange={handleChange}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>
    </div>
  );
}
