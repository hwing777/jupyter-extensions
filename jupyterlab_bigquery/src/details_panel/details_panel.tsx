import * as React from 'react';

import { Grid, Chip } from '@material-ui/core';
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
    // TODO(cxjia): make this responsive
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
  detailTable: {
    marginTop: '16px',
  },
});

const getStripedStyle = index => {
  return { background: index % 2 ? 'white' : '#fafafa' };
};

export const DetailsPanel = props => {
  const { details, rows } = props;
  return (
    <div className={localStyles.panel}>
      <header className={localStyles.header}>{details.id}</header>
      <div className={localStyles.detailsBody}>
        <Grid container>
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
                    return <Chip key={index} label={value} />;
                  })}
                </div>
              ) : (
                'None'
              )}
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className={localStyles.title}>Dataset info</div>
          </Grid>
          <Grid item xs={12} className={localStyles.detailTable}>
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
        </Grid>
      </div>
    </div>
  );
};
