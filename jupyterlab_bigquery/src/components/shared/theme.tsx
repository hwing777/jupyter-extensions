import { createMuiTheme } from '@material-ui/core';
import { BASE_FONT } from 'gcp_jupyterlab_shared';

export const BQtheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        fontSize: '13px',
        BASE_FONT,
      },
    },
    MuiTableHead: {
      root: {
        backgroundColor: '#f8f9fa',
        color: 'black',
        whiteSpace: 'nowrap',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});
