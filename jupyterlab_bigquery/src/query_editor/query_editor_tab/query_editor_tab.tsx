import React from 'react';

interface QueryEditorTabProps {
  isVisible: boolean;
}

interface QueryEditorTabState {
  isVisible: boolean;
}

class QueryEditorTab extends React.Component<
  QueryEditorTabProps,
  QueryEditorTabState
> {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isVisible,
    };
  }

  render() {
    return <div style={{ flexGrow: 1 }}>Here</div>;
  }
}

export default QueryEditorTab;
