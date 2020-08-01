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
import { Message } from '@phosphor/messaging';
import { Signal } from '@phosphor/signaling';
import { Widget } from '@phosphor/widgets';
import { UseSignal } from '@jupyterlab/apputils';
import { EnhancedStore } from '@reduxjs/toolkit';

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
      query: '',
      query_flags: '',
      result: '',
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'QueryIncellEditorModel';
  static model_module = 'bigquery_query_incell_editor';
  static model_module_version = '0.0.1';
  static view_name = 'QueryIncellEditorView'; // Set to null if no view
  static view_module = 'bigquery_query_incell_editor'; // Set to null if no view
  static view_module_version = '0.0.1';
}

export class QueryIncellEditorView extends DOMWidgetView {
  private resizeSignal = new Signal<this, Widget.ResizeMessage>(this);
  reduxStore: EnhancedStore;

  initialize() {
    this.reduxStore = WidgetManager.getInstance().getStore();
  }

  processPhosphorMessage(msg: Message) {
    if (msg.type === 'resize') {
      this.resizeSignal.emit(msg as Widget.ResizeMessage);
    }
  }

  render() {
    const appContainer = document.createElement('div');

    const reactApp = (
      <UseSignal signal={this.resizeSignal}>
        {() => {
          return (
            <Provider store={this.reduxStore}>
              <QueryEditorInCell ipyView={this} width={Math.random() * 600} />
            </Provider>
          );
        }}
      </UseSignal>
    );
    ReactDOM.render(reactApp, appContainer);
    this.el.append(appContainer);
  }
}
