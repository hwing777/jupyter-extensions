// Ensure styles are loaded by webpack
import '../style/index.css';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ListItemsWidget } from './components/list_items_panel/list_tree_item_widget';
import { ListProjectsService } from './components/list_items_panel/service/list_items';
import { IBigQueryFactory } from './tokens';
import { WidgetManager } from './utils/widget_manager';
import { Clipboard } from '@jupyterlab/apputils';

const copyID = 'bigquery:copy-id';

function addCommands(app: JupyterFrontEnd, widget: ListItemsWidget) {
  const { commands } = app;

  commands.addCommand(copyID, {
    label: 'Copy ID',
    isEnabled: () => true,
    isVisible: () => true,
    iconClass: 'jp-MaterialIcon jp-CopyIcon',
    execute: () => {
      if (!widget) {
        return;
      }

      // const item = widget.selectedItems().next();
      // const id = item.id;
      const id = "hi";

      console.log(id);
      Clipboard.copyToSystem(id);
    },
  });
}

async function activate(app: JupyterFrontEnd, factory: IBigQueryFactory) {
  const manager = new WidgetManager(app);
  const context = { app: app, manager: manager };
  const listProjectsService = new ListProjectsService();
  const listWidget = new ListItemsWidget(listProjectsService, context);
  listWidget.addClass('jp-BigQueryIcon');

  addCommands(app, listWidget);
  app.contextMenu.addItem({
    command: copyID,
    selector: '.jp-bigquery-DirListing',
  });

  app.shell.add(listWidget, 'left', { rank: 100 });
}

/**
 * The JupyterLab plugin.
 */
const ListItemsPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bigquery:bigquery',
  requires: [],
  activate: activate,
  autoStart: true,
};

/**
 * Export the plugin as default.
 */
export default [ListItemsPlugin];
