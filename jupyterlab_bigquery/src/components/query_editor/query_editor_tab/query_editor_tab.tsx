// @ts-nocheck

import React from 'react';
import QueryTextEditor, {
  QueryResult,
} from '../query_text_editor/query_text_editor';
import QueryResults from '../query_text_editor/query_editor_results';
import {
  QueryId,
  generateQueryId,
} from '../../../reducers/queryEditorTabSlice';
import { connect } from 'react-redux';
// import ReactResizeDetector from 'react-resize-detector';

interface QueryEditorTabProps {
  isVisible: boolean;
  queryId?: string;
  iniQuery?: string;
  width?: number;
  queries: { [key: string]: QueryResult };
}

class QueryEditorTab extends React.Component<QueryEditorTabProps, {}> {
  queryId: QueryId;
  editorRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isVisible,
    };

    this.queryId = this.props.queryId ?? generateQueryId();
  }

  renderEditorOnly() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <QueryTextEditor
          queryId={this.queryId}
          iniQuery={this.props.iniQuery}
          width={this.props.width}
        />
      </div>
    );
  }

  renderEditorWithResult() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <QueryTextEditor
          queryId={this.queryId}
          iniQuery={this.props.iniQuery}
          width={this.props.width}
        />
        <QueryResults queryId={this.queryId} />
      </div>
    );
  }

  render() {
    const { queries } = this.props;

    const queryResult = queries[this.queryId];
    // eslint-disable-next-line no-extra-boolean-cast
    const showResult = !!queryResult && queryResult.content.length > 0;

    if (showResult) {
      return this.renderEditorWithResult();
    } else {
      return this.renderEditorOnly();
    }
  }
}

const mapStateToProps = state => {
  return { queries: state.queryEditorTab.queries };
};

export default connect(mapStateToProps)(QueryEditorTab);
