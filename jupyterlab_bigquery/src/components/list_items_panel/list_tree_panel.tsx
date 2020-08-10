import {
  LinearProgress,
  Button,
  Portal,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as csstips from 'csstips';
import * as React from 'react';
import { connect } from 'react-redux';
import { stylesheet } from 'typestyle';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';

import {
  ListProjectsService,
  DataTree,
  GetProjectService,
} from './service/list_items';
import ListProjectItem from './list_tree_item';
import { WidgetManager } from '../../utils/widgetManager/widget_manager';
import ListSearchResults from './list_search_results';
import { QueryEditorTabWidget } from '../query_editor/query_editor_tab/query_editor_tab_widget';
import { generateQueryId } from '../../reducers/queryEditorTabSlice';
import { updateDataTree, addProject } from '../../reducers/dataTreeSlice';
import { SnackbarState, openSnackbar } from '../../reducers/snackbarSlice';
import {
  SearchProjectsService,
  SearchResult,
} from '../list_items_panel/service/search_items';
import { SearchBar } from './search_bar';
import { DialogComponent, COLORS, BASE_FONT } from 'gcp_jupyterlab_shared';
import CustomSnackbar from './snackbar';

interface Props {
  listProjectsService: ListProjectsService;
  isVisible: boolean;
  context: Context;
  updateDataTree: any;
  currentProject: string;
  projectIds: string[];
  addProject: any;
  snackbar: SnackbarState;
  openSnackbar: any;
}

export interface Context {
  app: JupyterFrontEnd;
  manager: WidgetManager;
  notebookTrack: INotebookTracker;
}

interface State {
  hasLoaded: boolean;
  isLoading: boolean;
  isLoadingSearch: boolean;
  searchToggled: boolean;
  searchEnabled: boolean;
  dialogOpen: boolean;
  isSearching: boolean;
  searchResults: SearchResult[];
  pinProjectDialogOpen: boolean;
  pinnedProject: string;
  loadingPinnedProject: boolean;
}

const localStyles = stylesheet({
  panel: {
    backgroundColor: 'white',
    //color: COLORS.base,
    height: '100%',
    ...BASE_FONT,
    // fontFamily: 'var(--jp-ui-font-family)',
    ...csstips.vertical,
    marginTop: '5px',
    marginBottom: '5px',
  },
  header: {
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    fontWeight: 500,
    letterSpacing: '1px',
    margin: 0,
    padding: '8px 12px',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
  resources: {
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
  },
  resourcesTitle: {
    fontWeight: 500,
    letterSpacing: '1px',
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '8px',
  },
  search: {
    marginBottom: '8px',
  },
  buttonContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  buttonWithIcon: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  buttonLabel: {
    fontWeight: 400,
    fontSize: 'var(--jp-ui-font-size1)',
    textTransform: 'initial',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  editQueryButton: {
    margin: 'auto',
    flexGrow: 0,
    minWidth: 0,
  },
  pinProjectsButton: {
    margin: 'auto',
    flexGrow: 0,
    padding: 0,
    minWidth: 0,
  },
  list: {
    margin: 0,
    flexDirection: 'column',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr',
    flexGrow: 1,
    overflow: 'scroll',
    padding: 0,
    ...csstips.flex,
  },
  resourceTree: {
    gridColumnStart: 1,
    gridRowStart: 1,
  },
  hidden: {
    display: 'none',
    margin: 0,
    padding: 0,
    ...csstips.flex,
  },
  showing: {
    zIndex: 1,
    gridColumnStart: 1,
    gridRowStart: 1,
    backgroundColor: 'white',
    margin: 0,
    padding: 0,
    ...csstips.flex,
  },
  enableSearch: {
    ...csstips.flex,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class ListItemsPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasLoaded: false,
      isLoading: false,
      isLoadingSearch: false,
      searchToggled: false,
      searchEnabled: false,
      dialogOpen: false,
      isSearching: false,
      searchResults: [],
      pinProjectDialogOpen: false,
      pinnedProject: '',
      loadingPinnedProject: false,
    };
  }

  // Handlers for searching

  handleOpenSearchDialog = () => {
    const { searchToggled } = this.state;
    this.setState({
      searchToggled: !searchToggled,
      dialogOpen: true,
    });
  };

  handleEnableSearch = () => {
    this.setState({
      dialogOpen: false,
      searchEnabled: true,
    });
  };

  handleCancelDialog = () => {
    this.setState({ dialogOpen: false, searchToggled: false });
  };

  async search(searchKey, project) {
    try {
      const service = new SearchProjectsService();
      await service.searchProjects(searchKey, project).then(results => {
        this.setState({
          searchResults: this.state.searchResults.concat(results.searchResults),
        });
      });
    } catch (err) {
      console.warn('Error searching', err.message);
      this.handleOpenSearchDialog();
      this.props.openSnackbar(
        `Error: Searching not allowed in project ${project}. 
        Enable the Data Catalog API in this project to continue.`
      );
    }
  }

  handleKeyPress = async event => {
    const { projectIds } = this.props;
    if (event.key === 'Enter') {
      const searchKey = event.target.value;
      this.setState({ searchResults: [] });
      if (projectIds.length !== 0) {
        this.setState({ isLoadingSearch: true, isSearching: true });
        await Promise.all(
          projectIds.map(async project => {
            await this.search(searchKey, project);
          })
        );
        this.setState({ isLoadingSearch: false });
      } else {
        console.warn(
          'Error searching, wait until data tree loads and try again'
        );
      }
    }
  };

  handleClear = () => {
    this.setState({ isSearching: false });
  };

  // Handlers for pinning projects

  addNewProject = async () => {
    try {
      this.setState({ loadingPinnedProject: true });
      const service = new GetProjectService();
      const newProjectId = this.state.pinnedProject;
      await service.getProject(newProjectId).then(project => {
        if (project) {
          this.props.addProject(project);
        } else {
          console.log('This project does not exist');
        }
      });
    } catch (err) {
      console.warn('Error checking access', err);
    } finally {
      this.handleClosePinProject();
      this.setState({ loadingPinnedProject: false });
    }
  };

  handleOpenPinProject = () => {
    this.setState({ pinProjectDialogOpen: true });
  };

  handlePinnedProjectChange = event => {
    this.setState({ pinnedProject: event.target.value });
  };

  handleClosePinProject = () => {
    this.setState({ pinProjectDialogOpen: false });
  };

  handleRefreshAll = () => {
    this.getProjects();
  };

  async componentWillMount() {
    try {
      //empty
    } catch (err) {
      console.warn('Unexpected error', err);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const isFirstLoad =
      !(this.state.hasLoaded || prevProps.isVisible) && this.props.isVisible;
    if (isFirstLoad) {
      this.getProjects();
    }
  }

  render() {
    const {
      isLoading,
      isLoadingSearch,
      isSearching,
      searchResults,
      searchEnabled,
      dialogOpen,
      pinProjectDialogOpen,
      loadingPinnedProject,
    } = this.state;
    const { snackbar } = this.props;

    const showSearchResults = isSearching
      ? localStyles.showing
      : localStyles.hidden;
    return (
      <div className={localStyles.panel}>
        <Portal>
          <CustomSnackbar open={snackbar.open} message={snackbar.message} />
        </Portal>
        <header className={localStyles.header}>
          <div>BigQuery Extension</div>
          <div className={localStyles.buttonContainer}>
            <Tooltip title="Open SQL editor">
              <Button
                style={{ color: COLORS.blue }}
                size="small"
                variant="outlined"
                className={localStyles.editQueryButton}
                onClick={() => {
                  const queryId = generateQueryId();
                  WidgetManager.getInstance().launchWidget(
                    QueryEditorTabWidget,
                    'main',
                    queryId,
                    undefined,
                    [queryId, undefined]
                  );
                }}
              >
                <div className={localStyles.buttonLabel}>Open SQL editor</div>
              </Button>
            </Tooltip>
          </div>
        </header>
        <div className={localStyles.resources}>
          <div className={localStyles.resourcesTitle}>
            <div>Resources</div>
            <div className={localStyles.buttonContainer}>
              <Tooltip title="Refresh">
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={this.handleRefreshAll}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Pin project">
                <Button
                  size="small"
                  variant="outlined"
                  style={{ minWidth: 0 }}
                  className={localStyles.pinProjectsButton}
                  onClick={this.handleOpenPinProject}
                  startIcon={<AddIcon />}
                >
                  <div className={localStyles.buttonLabel}>Pin project</div>
                </Button>
              </Tooltip>
            </div>
          </div>
          <div
            className={localStyles.search}
            onClick={searchEnabled ? null : this.handleOpenSearchDialog}
          >
            <SearchBar
              handleKeyPress={this.handleKeyPress}
              handleClear={this.handleClear}
              defaultText={'Search...'}
            />
          </div>
          {isLoading ? (
            <LinearProgress />
          ) : (
            <ul className={localStyles.list}>
              <div className={localStyles.resourceTree}>
                <ListProjectItem context={this.props.context} />
              </div>
              <div className={showSearchResults}>
                {isLoadingSearch ? (
                  <LinearProgress />
                ) : (
                  <ListSearchResults
                    context={this.props.context}
                    searchResults={searchResults}
                  />
                )}
              </div>
            </ul>
          )}
        </div>
        <DialogComponent
          header="Requirements to Enable Searching"
          open={dialogOpen}
          onSubmit={this.handleEnableSearch}
          onCancel={this.handleCancelDialog}
          onClose={this.handleCancelDialog}
          submitLabel="I have enabled the API"
          children={
            <p>
              To start using BigQuery's Search feature, you'll need to first
              enable the{' '}
              <a
                style={{ color: 'blue' }}
                href="https://console.developers.google.com/apis/api/datacatalog.googleapis.com/overview"
              >
                Google Data Catalog API
              </a>{' '}
              for all pinned projects. Once you click "Enable", this may take up
              to 2-3 minutes before you can start searching.
            </p>
          }
        />
        <DialogComponent
          header="Pin a Project"
          open={pinProjectDialogOpen}
          onSubmit={this.addNewProject}
          onCancel={this.handleClosePinProject}
          onClose={this.handleClosePinProject}
          submitLabel="Pin Project"
          children={
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p>
                Enter a project name to be pinned in the data tree for easy
                access.
              </p>
              <p>
                Warning: pins are not saved, and will be removed once the page
                is refreshed. <br /> <br />
                Enter a project name: <br /> <br />
              </p>
              <input
                type="text"
                value={this.state.pinnedProject}
                onChange={this.handlePinnedProjectChange}
              />
              {loadingPinnedProject && <LinearProgress />}
            </div>
          }
        />
      </div>
    );
  }

  private async getProjects() {
    try {
      this.setState({ isLoading: true });
      await this.props.listProjectsService
        .listProjects('')
        .then((data: DataTree) => {
          this.props.updateDataTree(data);
          this.setState({ hasLoaded: true });
        });
    } catch (err) {
      console.warn('Error retrieving projects', err);
    } finally {
      this.setState({ isLoading: false });
    }
  }
}

const mapStateToProps = state => {
  const currentProject = state.dataTree.data.projectIds[0];
  const snackbar = state.snackbar;
  const { projectIds } = state.dataTree.data;
  return { currentProject, snackbar, projectIds };
};
const mapDispatchToProps = {
  updateDataTree,
  addProject,
  openSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListItemsPanel);
