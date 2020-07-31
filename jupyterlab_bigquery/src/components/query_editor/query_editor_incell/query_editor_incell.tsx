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
import { DOMWidgetView } from '@jupyter-widgets/base';

interface QueryEditorInCellProps {
  queries: { [key: string]: QueryResult };
  ipyView: DOMWidgetView;
}

interface QueryEditorInCellState {
  width: number;
}

export class QueryEditorInCell extends Component<
  QueryEditorInCellProps,
  QueryEditorInCellState
> {
  queryId: QueryId;
  iniQuery: string;
  queryFlags: { [keys: string]: any };

  constructor(pros) {
    super(pros, QueryEditorInCell);

    this.queryId = generateQueryId();
    this.iniQuery = this.props.ipyView.model.get('query') as string;
    const rawQueryFlags = this.props.ipyView.model.get('query_flags') as string;
    this.queryFlags = JSON.parse(rawQueryFlags);

    this.state = {
      width: 0,
    };
  }

  // private containerRef = React.createRef<HTMLDivElement>();
  // onRefChange = node => {
  //   console.log('onrefChange triggered');
  //   if (node) {
  //     this.setState({ width: node.clientWidth });
  //   }
  // };

  render() {
    const { queries } = this.props;

    const queryResult = queries[this.queryId];
    // eslint-disable-next-line no-extra-boolean-cast
    const showResult = !!queryResult && queryResult.content.length > 0;

    return (
      <div>
        <QueryTextEditor
          queryId={this.queryId}
          iniQuery={this.iniQuery}
          editorType="IN_CELL"
          queryFlags={this.queryFlags}
          // ref={this.onRefChange}
        />
        {showResult ? (
          <QueryResults queryId={this.queryId} editorType="IN_CELL" />
        ) : (
          undefined
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { queries: state.queryEditorTab.queries };
};

export default connect(mapStateToProps)(QueryEditorInCell);
