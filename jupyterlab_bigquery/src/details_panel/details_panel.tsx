import * as React from 'react';

import {
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { stylesheet } from 'typestyle';

export const localStyles = stylesheet({
  header: {
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    fontSize: '18px',
    // letterSpacing: '1px',
    margin: 0,
    padding: '8px 12px 8px 24px',
  },
  title: {
    fontSize: '16px',
    marginBottom: '8px',
  },
  panel: {
    backgroundColor: 'white',
    height: '100%',
  },
  detailsBody: {
    margin: '24px',
    fontSize: '13px',
  },
  labelContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: '4px',
    },
  },
  rowTitle: {
    width: '200px',
  },
  row: {
    display: 'flex',
    padding: '6px',
  },
  tableHead: {
    backgroundColor: '#f0f0f0',
  },
});

const getStripedStyle = index => {
  return { background: index % 2 ? 'white' : '#fafafa' };
};

interface Props {
  details: any;
  rows: any[];
  type: string;
}

export const DetailsPanel: React.SFC<Props> = props => {
  const { details, rows, type } = props;
  return (
    <div className={localStyles.panel}>
      <header className={localStyles.header}>{details.id}</header>
      <div className={localStyles.detailsBody}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <div className={localStyles.title}>Description</div>
            <div>{details.description ? details.description : 'None'}</div>
          </Grid>

          <Grid item xs={6}>
            <div>
              <div className={localStyles.title}>Labels</div>
              {details.labels ? (
                <div className={localStyles.labelContainer}>
                  {details.labels.map((value, index) => {
                    return <Chip size="small" key={index} label={value} />;
                  })}
                </div>
              ) : (
                'None'
              )}
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className={localStyles.title}>Dataset info</div>
            {rows.map((row, index) => (
              <div
                key={index}
                className={localStyles.row}
                style={{ ...getStripedStyle(index) }}
              >
                <div className={localStyles.rowTitle}>
                  <b>{row.name}</b>
                </div>
                <div>{row.value}</div>
              </div>
            ))}
          </Grid>

          {type === 'table' && (
            <Grid item xs={12}>
              <div className={localStyles.title}>Schema</div>
              {details.schema ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={localStyles.tableHead}>
                        Field name
                      </TableCell>
                      <TableCell className={localStyles.tableHead}>
                        Type
                      </TableCell>
                      <TableCell className={localStyles.tableHead}>
                        Mode
                      </TableCell>
                      <TableCell className={localStyles.tableHead}>
                        Description
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details.schema.map((value, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <b>{value.name}</b>
                          </TableCell>
                          <TableCell>{value.type}</TableCell>
                          <TableCell>{value.mode}</TableCell>
                          <TableCell>{value.description ?? ''}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                'None'
              )}
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};
