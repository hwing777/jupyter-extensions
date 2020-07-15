import React, { Component } from 'react';
import QueryTextEditor, {
  QueryResult,
} from '../query_text_editor/query_text_editor';
import { connect } from 'react-redux';
import QueryResults from '../query_editor_tab/query_editor_results';
import {
  QueryId,
  generateQueryId,
} from '../../../reducers/queryEditorTabSlice';

interface QueryEditorInCellProps {
  update: (string, any) => void;
  queryResult: QueryResult;
}

export class QueryEditorInCell extends Component<QueryEditorInCellProps, {}> {
  queryId: QueryId;

  constructor(pros) {
    super(pros, QueryEditorInCell);

    this.queryId = generateQueryId();
  }

  render() {
    const { update, queryResult } = this.props;

    const jsonLoad = JSON.stringify(queryResult);
    console.log(jsonLoad);
    update('result', jsonLoad);

    return (
      <div style={{ width: '80vw' }}>
        <QueryTextEditor queryId={this.queryId} />
        <QueryResults queryId={this.queryId} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const queryId = ownProps.queryId;
  let queryResult = state.queryEditorTab.queries[queryId];

  if (!queryResult) {
    queryResult = {
      content: [],
      labels: [],
      bytesProcessed: null,
      queryId: queryId,
    } as QueryResult;
  }
  return { queryResult: queryResult };
};

export default connect(mapStateToProps)(QueryEditorInCell);
