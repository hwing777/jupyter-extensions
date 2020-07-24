import { UseSignal } from '@jupyterlab/apputils';
import { Signal } from '@phosphor/signaling';
import * as React from 'react';
import { ReduxReactWidget } from '../../utils/widgetManager/redux_react_widget';
import {
  ListProjectsService,
  ListDatasetsService,
  ListTablesService,
  ListModelsService,
} from './service/tree_items';
import DataTreePanel from './data_tree_panel';
import { Context } from './data_tree_panel';

/** Widget to be registered in the left-side panel. */
export default class DataTreeWidget extends ReduxReactWidget {
  id = 'datatree';
  private visibleSignal = new Signal<DataTreeWidget, boolean>(this);

  constructor(
    private readonly listProjectsService: ListProjectsService,
    private readonly listDatasetsService: ListDatasetsService,
    private readonly listTablesService: ListTablesService,
    private readonly listModelsService: ListModelsService,
    private context: Context
  ) {
    super();
    this.title.iconClass = 'jp-Icon jp-Icon-20 jp-BigQueryIcon';
    this.title.caption = 'BigQuery In Notebooks';
  }

  onAfterHide() {
    this.visibleSignal.emit(false);
  }

  onAfterShow() {
    this.visibleSignal.emit(true);
  }

  renderReact() {
    return (
      <UseSignal signal={this.visibleSignal}>
        {(_, isVisible) => (
          <DataTreePanel
            isVisible={isVisible}
            listProjectsService={this.listProjectsService}
            listDatasetsService={this.listDatasetsService}
            listTablesService={this.listTablesService}
            listModelsService={this.listModelsService}
            context={this.context}
          />
        )}
      </UseSignal>
    );
  }
}
