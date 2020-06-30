// /* eslint-disable @typescript-eslint/interface-name-prefix */
// // Copyright (c) Jupyter Development Team.
// // Distributed under the terms of the Modified BSD License.

// import { WidgetTracker } from '@jupyterlab/apputils';

// import { Token } from '@phosphor/coreutils';

// import { ListItemsWidget } from './components/list_items_panel/list_tree_item_widget';

// /* tslint:disable */
// /**
//  * The path tracker token.
//  */
// export const IBigQueryFactory = new Token<IBigQueryFactory>(
//   'bigquery:IBigQueryFactory'
// );
// /* tslint:enable */

// /**
//  * The file browser factory interface.
//  */
// export interface IBigQueryFactory {
//   /**
//    * Create a new file browser instance.
//    *
//    * @param id - The widget/DOM id of the file browser.
//    *
//    * #### Notes
//    * The ID parameter is used to set the widget ID. It is also used as part of
//    * the unique key necessary to store the file browser's restoration data in
//    * the state database if that functionality is enabled.
//    *
//    * If, after the file browser has been generated by the factory, the ID of the
//    * resulting widget is changed by client code, the restoration functionality
//    * will not be disrupted as long as there are no ID collisions, i.e., as long
//    * as the initial ID passed into the factory is used for only one file browser
//    * instance.
//    */
//   createFileBrowser(id: string): ListItemsWidget;

//   /**
//    * The widget tracker used by the factory to track file browsers.
//    */
//   readonly tracker: WidgetTracker<ListItemsWidget>;
// }
