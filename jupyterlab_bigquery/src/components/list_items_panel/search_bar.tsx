import * as React from 'react';
import { stylesheet } from 'typestyle';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
// import TextField from '@material-ui/core/TextField';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import { Typography } from '@material-ui/core';

interface Props {
  handleKeyPress: (e) => void;
  handleClear: () => void;
  defaultText?: string;
}

const searchStyle = stylesheet({
  search: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    borderStyle: 'solid',
    borderRadius: '1px',
    borderWidth: 'thin',
    borderColor: '#d3d3d3',
  },
  searchIcon: {
    padding: '2px',
    color: '#d3d3d3',
  },
  clearIcon: {
    textTransform: 'none',
    alignSelf: 'center',
    color: '#d3d3d3',
    '&:hover': {
      cursor: 'pointer',
      opacity: 1,
    },
  },
});

/** Funtional Component for a common dialog interface with cancel and submit buttons. */
export function SearchBar(props: Props) {
  const [searchKey, setSearchKey] = React.useState('');
  const [showClearIcon, setShowClearIcon] = React.useState(false);

  const handleOnChange = event => {
    setSearchKey(event.target.value);
    if (event.target.value === '') {
      setShowClearIcon(false);
      props.handleClear();
    } else {
      setShowClearIcon(true);
    }
  };

  const handleClickClear = () => {
    setSearchKey('');
    setShowClearIcon(false);
    props.handleClear();
  };

  return (
    <div className={searchStyle.search}>
      <SearchIcon className={searchStyle.searchIcon} />
      <input
        onKeyPress={e => props.handleKeyPress(e)}
        onChange={e => handleOnChange(e)}
        placeholder="Search for your tables and datasets"
        value={searchKey}
        style={{ borderWidth: 0, flexGrow: 1 }}
      />
      {showClearIcon ? (
        <ClearIcon
          className={searchStyle.clearIcon}
          fontSize="small"
          onClick={() => handleClickClear()}
        />
      ) : (
        <div />
      )}
      {/* <TextField
        id="standard-search"
        value={searchKey}
        size="small"
        variant="outlined"
        placeholder={props.defaultText || 'Search...'}
        margin="none"
        fullWidth={true}
        onKeyPress={e => props.handleKeyPress(e)}
        onChange={e => handleOnChange(e)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {showClearIcon ? (
                <ClearIcon
                  className={searchStyle.clearIcon}
                  fontSize="small"
                  onClick={() => handleClickClear()}
                />
              ) : (
                <div />
              )}
            </InputAdornment>
          ),
        }}
      /> */}
    </div>
  );
}
