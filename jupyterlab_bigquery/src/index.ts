// Ensure styles are loaded by webpack
import '../style/index.css';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import * as QueryEditorInCellWidgetsExport from './components/query_editor/query_editor_incell/query_editor_incell_widget';

import DataTreeWidget from './components/data_tree_panel/data_tree_widget';
import {
  ListProjectsService,
  ListDatasetsService,
  ListTablesService,
  ListModelsService,
} from './components/data_tree_panel/service/tree_items';
import { WidgetManager } from './utils/widgetManager/widget_manager';
import { ReduxReactWidget } from './utils/widgetManager/redux_react_widget';

async function activate(
  app: JupyterFrontEnd,
  registry: IJupyterWidgetRegistry
) {
  WidgetManager.initInstance(app);
  const manager = WidgetManager.getInstance();
  const context = { app: app, manager: manager };
  const listProjectsService = new ListProjectsService();
  const listDatasetsService = new ListDatasetsService();
  const listTablesService = new ListTablesService();
  const listModelsService = new ListModelsService();
  manager.launchWidget(
    DataTreeWidget,
    'left',
    'ListItemWidget',
    (widget: ReduxReactWidget) => {
      widget.addClass('jp-BigQueryIcon');
    },
    [
      listProjectsService,
      listDatasetsService,
      listTablesService,
      listModelsService,
      context,
    ],
    { rank: 100 }
  );

  registry.registerWidget({
    name: 'bigquery_query_incell_editor',
    version: '0.0.1',
    exports: QueryEditorInCellWidgetsExport,
  });
}

/**
 * The JupyterLab plugin.
 */
const BigQueryPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bigquery:bigquery',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requires: [IJupyterWidgetRegistry as any],
  activate: activate,
  autoStart: true,
};

/**
 * Export the plugin as default.
 */
export default [BigQueryPlugin];
