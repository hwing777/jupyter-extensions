import * as React from 'react';
import { stylesheet } from 'typestyle';

const localStyles = stylesheet({
  header: {
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    fontSize: '18px',
    margin: 0,
    padding: '16px 12px 16px 24px',
  },
});

export const Header: React.SFC<{ text: string }> = props => {
  return <header className={localStyles.header}>{props.text}</header>;
};
