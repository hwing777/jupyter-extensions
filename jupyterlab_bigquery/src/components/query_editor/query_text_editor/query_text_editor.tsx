import React from 'react';
import Editor, { monaco, Monaco } from '@monaco-editor/react';
import { connect } from 'react-redux';
import {
  updateQueryResult,
  resetQueryResult,
  deleteQueryEntry,
  QueryId,
} from '../../../reducers/queryEditorTabSlice';

import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

import { Button, CircularProgress, Typography } from '@material-ui/core';
import { stylesheet } from 'typestyle';
import PagedService, { JobState } from '../../../utils/pagedAPI/paged_service';
import PagedJob from '../../../utils/pagedAPI/pagedJob';
import { QueryEditorType } from '../query_editor_tab/query_editor_results';

interface QueryTextEditorState {
  buttonState: ButtonStates;
  bytesProcessed: number | null;
  errorMsg: string | null;
  height: number;
}

interface QueryTextEditorProps {
  updateQueryResult: any;
  resetQueryResult: any;
  deleteQueryEntry: any;
  queryId: QueryId;
  iniQuery?: string;
  editorType?: QueryEditorType;
  queryFlags?: { [keys: string]: any };
  width?: number;
}

interface QueryResponseType {
  content: string;
  labels: string;
  bytesProcessed: number;
}

export interface QueryResult {
  content: Array<Array<unknown>>;
  labels: Array<string>;
  bytesProcessed: number;
  queryId: QueryId;
}

interface QueryRequestBodyType {
  query: string;
  jobConfig: {};
  dryRunOnly: boolean;
}

const SQL_EDITOR_OPTIONS: editor.IEditorConstructionOptions = {
  lineNumbers: 'on',
  formatOnType: true,
  formatOnPaste: true,
  wordWrap: 'on',
  wrappingIndent: 'same',
  wrappingStrategy: 'advanced',
  minimap: {
    enabled: false,
  },
};

const styleSheet = stylesheet({
  queryButton: {
    float: 'right',
    width: '100px',
    maxWidth: '200px',
    margin: '10px',
  },
  queryTextEditor: {
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    minHeight: '200px',
    flex: 1,
  },
  queryTextEditorInCell: {
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    minHeight: '300px',
    height: '30vh',
  },
  wholeEditor: {
    // 4/9 of panel height (in relation to results)
    flex: 4,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
  },
  wholeEditorInCell: {
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
  },
  optionalText: {
    marginRight: '10px',
    marginLeft: '10px',
    alignSelf: 'center',
    justifySelf: 'center',
  },
  pendingStatus: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  buttonInfoBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: '10px',
  },
});

enum ButtonStates {
  READY,
  PENDING,
  ERROR,
}

class QueryTextEditor extends React.Component<
  QueryTextEditorProps,
  QueryTextEditorState
> {
  editor: editor.IStandaloneCodeEditor;
  monacoInstance: Monaco;
  job: PagedJob<QueryRequestBodyType, QueryResponseType>;
  timeoutAlarm: NodeJS.Timeout;
  queryId: QueryId;
  queryFlags: {};

  pagedQueryService: PagedService<QueryRequestBodyType, QueryResponseType>;

  constructor(props) {
    super(props);
    this.state = {
      buttonState: ButtonStates.READY,
      bytesProcessed: null,
      errorMsg: null,
      height: 0,
    };
    this.pagedQueryService = new PagedService('query');
    this.timeoutAlarm = null;
    this.queryId = props.queryId;
    this.queryFlags = !this.props.queryFlags ? {} : this.props.queryFlags;

    monaco
      .init()
      .then(monacoInstance => (this.monacoInstance = monacoInstance));
  }

  updateDimensions() {
    this.editor.layout();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    this.props.deleteQueryEntry(this.queryId);
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  componentDidUpdate(
    prevProps: QueryTextEditorProps,
    prevState: QueryTextEditorState
  ) {
    if (
      (prevProps.width !== this.props.width ||
        prevState.height !== this.state.height) &&
      this.editor
    ) {
      this.editor.layout({
        width: this.props.width,
        height: this.state.height,
      });
    }
  }

  handleButtonClick() {
    switch (this.state.buttonState) {
      case ButtonStates.READY:
      case ButtonStates.ERROR:
        this.handleQuery();
        break;
      case ButtonStates.PENDING:
        this.handleCancel();
    }
  }

  handleCancel() {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!this.job) {
      this.job.cancel();
    }
  }

  handleQuery() {
    this.props.resetQueryResult(this.props.queryId);
    const query = this.editor.getValue();

    this.setState({
      buttonState: ButtonStates.PENDING,
      bytesProcessed: null,
      errorMsg: null,
    });

    this.job = this.pagedQueryService.request(
      { query, jobConfig: this.queryFlags, dryRunOnly: false },
      (state, _, response) => {
        if (state === JobState.Pending) {
          response = response as QueryResponseType;

          Object.keys(response).map(key => {
            response[key] = JSON.parse(response[key]);
          });

          this.setState({ bytesProcessed: response.bytesProcessed });
          const processed = (response as unknown) as QueryResult;
          processed.queryId = this.queryId;

          this.props.updateQueryResult(processed);
        } else if (state === JobState.Fail) {
          this.setState({
            buttonState: ButtonStates.ERROR,
            errorMsg: response as string,
          });

          // switch to normal button after certain time
          setTimeout(() => {
            this.setState({ buttonState: ButtonStates.READY });
          }, 2000);
        } else if (state === JobState.Done) {
          this.setState({ buttonState: ButtonStates.READY });
        }
      },
      2000
    );
  }

  handleEditorDidMount(_, editor) {
    if (this.editorRef.current) {
      this.setState({ height: this.editorRef.current.clientHeight });
    }
    this.editor = editor;

    this.editor.onKeyUp(() => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!this.timeoutAlarm) {
        clearTimeout(this.timeoutAlarm);
        this.setState({ errorMsg: null });
      }
      this.timeoutAlarm = setTimeout(this.checkSQL.bind(this), 1500);
      this.resetMarkers();
    });

    // initial check
    this.checkSQL();
  }

  checkSQL() {
    const query = this.editor.getValue();

    if (!query) {
      return;
    }

    this.pagedQueryService.request(
      { query, jobConfig: this.queryFlags, dryRunOnly: true },
      (state, _, response) => {
        if (state === JobState.Fail) {
          const res = response as string;

          // deal with errors
          this.handleSyntaxError(res);
          this.handleNotFound(res);
        }
      }
    );
  }

  async handleNotFound(response: string) {
    const prompt = 'Not found:';
    response = response.trim();
    if (!response.startsWith(prompt)) {
      return;
    }

    const body = response;
    // response follow the format "not found: [Table, Dataset, etc] xxx:name"
    const errStr = response
      .split(' ')[3]
      .split(':')
      .pop();
    const model = this.editor.getModel();
    const texts = model.getValue().split('\n');

    let line = -1;
    let pos = -1;

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      const indx = text.indexOf(errStr);
      if (indx !== -1) {
        line = i + 1;
        pos = indx;
      }
    }

    const startPos = pos;
    const endPos = pos + errStr.length;

    this.monacoInstance.editor.setModelMarkers(model, 'owner', [
      {
        startLineNumber: line,
        endLineNumber: line,
        startColumn: startPos,
        endColumn: endPos,
        message: body,
        severity: this.monacoInstance.MarkerSeverity.Error,
      },
    ]);
  }

  async handleSyntaxError(response: string) {
    const prompt = 'Syntax error:';
    response = response.trim();
    if (!response.startsWith(prompt)) {
      return;
    }

    // error message follows the format xxxx at [row:column]
    const body = response.substring(prompt.length, response.lastIndexOf('at'));
    const posStr = response.substring(
      response.lastIndexOf('[') + 1,
      response.lastIndexOf(']')
    );

    const [line, pos] = posStr.split(':').map(x => parseInt(x, 10));
    const model = this.editor.getModel();
    const text = model.getValue().split('\n')[line - 1];

    const startPos = pos;
    const errLen = text.substring(pos).indexOf(' ');
    const endPos = errLen !== -1 ? errLen + pos + 1 : text.length + 1;
    this.monacoInstance.editor.setModelMarkers(model, 'owner', [
      {
        startLineNumber: line,
        endLineNumber: line,
        startColumn: startPos,
        endColumn: endPos,
        message: body,
        severity: this.monacoInstance.MarkerSeverity.Error,
      },
    ]);
  }

  resetMarkers() {
    const model = this.editor.getModel();
    this.monacoInstance.editor.setModelMarkers(model, 'owner', []);
  }

  readableBytes(bytes: number) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }

  renderButton() {
    const buttonState = this.state.buttonState;
    let color = undefined;
    let content = undefined;

    switch (buttonState) {
      case ButtonStates.PENDING:
        color = 'default';
        content = (
          <div className={styleSheet.pendingStatus}>
            <CircularProgress size="75%" style={{ alignSelf: 'center' }} />
            <Typography variant="button">Cancel</Typography>
          </div>
        );
        break;
      case ButtonStates.READY:
        color = 'primary';
        content = 'Submit';
        break;
      case ButtonStates.ERROR:
        color = 'secondary';
        content = 'Error';
        break;
    }

    return (
      <Button
        color={color}
        variant="contained"
        onClick={this.handleButtonClick.bind(this)}
        className={styleSheet.queryButton}
      >
        {content}
      </Button>
    );
  }

  renderOptionalText(text, config = {}) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!text) {
      return (
        <Typography
          className={styleSheet.optionalText}
          variant="body1"
          style={{ marginRight: '10px' }}
          {...config}
        >
          {text}
        </Typography>
      );
    }

    return undefined;
  }

  private editorRef = React.createRef<HTMLDivElement>();

  render() {
    const { iniQuery } = this.props;

    // eslint-disable-next-line no-extra-boolean-cast
    const readableSize = !!this.state.bytesProcessed
      ? 'Processed ' + this.readableBytes(this.state.bytesProcessed)
      : null;

    const errMsg = this.state.errorMsg;

    // eslint-disable-next-line no-extra-boolean-cast
    const queryValue = !!iniQuery ? iniQuery : 'SELECT * FROM *';

    return (
      <div
        className={
          this.props.editorType === 'IN_CELL'
            ? styleSheet.wholeEditorInCell
            : styleSheet.wholeEditor
        }
        ref={this.editorRef}
      >
        <div
          className={
            this.props.editorType === 'IN_CELL'
              ? styleSheet.queryTextEditorInCell
              : styleSheet.queryTextEditor
          }
        >
          <Editor
            width="100%"
            height="100%"
            theme={'light'}
            language={'sql'}
            value={queryValue}
            editorDidMount={this.handleEditorDidMount.bind(this)}
            options={SQL_EDITOR_OPTIONS}
          />
        </div>

        <div className={styleSheet.buttonInfoBar}>
          {this.renderOptionalText(errMsg, {
            variant: 'caption',
            color: 'error',
          })}
          {this.renderOptionalText(readableSize)}
          {this.renderButton()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {};

const mapDispatchToProps = {
  updateQueryResult,
  resetQueryResult,
  deleteQueryEntry,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryTextEditor);
