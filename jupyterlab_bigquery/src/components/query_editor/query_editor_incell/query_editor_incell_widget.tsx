/* eslint-disable @typescript-eslint/camelcase */
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import React from 'react';
import ReactDOM from 'react-dom';
import QueryEditorInCell from './query_editor_incell';
import { Provider } from 'react-redux';
import { WidgetManager } from '../../../utils/widgetManager/widget_manager';

// TODO: refactor name and version to sync with back

export class QueryIncellEditorModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: QueryIncellEditorModel.model_name,
      _model_module: QueryIncellEditorModel.model_module,
      _model_module_version: QueryIncellEditorModel.model_module_version,
      _view_name: QueryIncellEditorModel.view_name,
      _view_module: QueryIncellEditorModel.view_module,
      _view_module_version: QueryIncellEditorModel.view_module_version,
      value: '',
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'QueryIncellEditorModel';
  static model_module = 'bigQuery-query-incell-editor';
  static model_module_version = '0.0.1';
  static view_name = 'QueryIncellEditorView'; // Set to null if no view
  static view_module = 'bigQuery-query-incell-editor'; // Set to null if no view
  static view_module_version = '0.0.1';
}

export class QueryIncellEditorView extends DOMWidgetView {
  initialize() {
    const appContainer = document.createElement('div');
    const reactApp = React.createElement(QueryEditorInCell, {
      update: (name, load) => {
        console.log(name, load);
        this.model.set(name, load);
        this.touch();
      },
    });
    const reduxStore = WidgetManager.getInstance().getStore();
    const reduxProvider = React.createElement(
      Provider,
      { store: reduxStore },
      reactApp
    );
    ReactDOM.render(reduxProvider, appContainer);
    this.el.append(appContainer);
  }

  value_changed() {
    console.log(this.model.get('value'));
  }
}
