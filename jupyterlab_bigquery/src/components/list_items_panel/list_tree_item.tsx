import { withStyles } from '@material-ui/core';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import * as csstips from 'csstips';
// import React, { useState } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import { stylesheet } from 'typestyle';

// import { DataTree, Project, Dataset, Table, Model } from './service/list_items';
import { DataTree, Project } from './service/list_items';
import { Context } from './list_tree_item_widget';
// import { DatasetDetailsWidget } from '../details_panel/dataset_details_widget';
// import { DatasetDetailsService } from '../details_panel/service/list_dataset_details';
// import { TableDetailsWidget } from '../details_panel/table_details_widget';
// import { TableDetailsService } from '../details_panel/service/list_table_details';

//import { COLORS, css } from '../styles';

const localStyles = stylesheet({
  item: {
    alignItems: 'center',
    listStyle: 'none',
    height: '40px',
    paddingRight: '8px',
    ...csstips.horizontal,
  },
  childItem: {
    alignItems: 'center',
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    listStyle: 'none',
    height: '40px',
    paddingRight: '8px',
    paddingLeft: '30px',
    ...csstips.horizontal,
  },
  details: {
    alignItems: 'center',
    paddingLeft: '4px',
    ...csstips.horizontal,
    ...csstips.flex,
  },
  wordTime: {
    color: 'var(--jp-content-font-color2)',
    fontSize: '9px',
    textAlign: 'right',
    ...csstips.flex,
  },
  viewLink: {
    backgroundImage: 'var(--jp-icon-notebook)',
    backgroundRepeat: 'no-repeat',
    marginLeft: '5px',
    padding: '0 6px',
    textDecoration: 'none',
  },
  icon: {
    padding: '0 0 0 5px',
  },
  list: {
    margin: '0',
    // overflowY: 'scroll',
    padding: '0',
    ...csstips.flex,
  },
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
});

interface ProjectProps {
  project: Project;
  context: Context;
  data: DataTree;
}

// interface DatasetProps {
//   dataset: Dataset;
//   context: Context;
// }

// interface TableProps {
//   table: Table;
//   context: Context;
// }

// interface ModelProps {
//   model: Model;
// }

interface State {
  expanded: boolean;
}

const BigArrowRight = withStyles({
  root: {
    fontSize: '16px',
  },
})(ArrowRight);

const ArrowDown = withStyles({
  root: {
    fontSize: '16px',
  },
})(ArrowDropDown);

export function BuildTree(data) {
  const renderTree = nodes => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map(node => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      className={localStyles.root}
      defaultCollapseIcon={<ArrowDown />}
      defaultExpanded={['root']}
      defaultExpandIcon={<BigArrowRight />}
    >
      {renderTree(data)}
    </TreeView>
  );
}

// function ListItem(props) {
//   const [expanded, setExpanded] = useState(false);

//   const handleExpand = () => {
//     const currentState = expanded;
//     setExpanded(!currentState);
//   };

//   const getIconForWord = subfields => {
//     if (subfields) {
//       if (expanded === false) {
//         return <BigArrowRight />;
//       } else {
//         return <ArrowDown />;
//       }
//     }
//   };

//   return (
//     <div>
//       <li className={localStyles.item}>
//         <div className={localStyles.icon} onClick={() => handleExpand()}>
//           {getIconForWord(props.subfields)}
//         </div>
//         <div className={localStyles.details} onDoubleClick={props.openDetails}>
//           <a className="{css.link}" href="#">
//             {props.name}
//           </a>
//         </div>
//       </li>
//       {expanded && <div>{props.children}</div>}
//     </div>
//   );
// }

class ListProjectItem extends React.Component<ProjectProps, State> {
  render() {
    const { data } = this.props;
    console.log('got here');
    console.log(data);
    return <div>{BuildTree(data)}</div>;
  }
}

// export class ListDatasetItem extends React.Component<DatasetProps, State> {
//   render() {
//     const { dataset, context } = this.props;
//     return (
//       <ul>
//         <ListItem
//           name={dataset.name}
//           subfields={dataset.tables}
//           openDetails={() => {
//             const service = new DatasetDetailsService();
//             const widgetType = DatasetDetailsWidget;
//             context.manager.launchWidgetForId(
//               dataset.id,
//               widgetType,
//               service,
//               dataset.id,
//               dataset.name
//             );
//           }}
//         >
//           <ul className={localStyles.list}>
//             {dataset.tables.map(t => (
//               <ListTableItem key={t.id} table={t} context={context} />
//             ))}
//           </ul>
//           <ul className={localStyles.list}>
//             {dataset.models.map(m => (
//               <ListModelItem key={m.id} model={m} />
//             ))}
//           </ul>
//         </ListItem>
//       </ul>
//     );
//   }
// }

// export class ListTableItem extends React.Component<TableProps, State> {
//   render() {
//     const { table, context } = this.props;
//     return (
//       <ul>
//         <ListItem
//           name={table.name}
//           subfields={null}
//           openDetails={() => {
//             const service = new TableDetailsService();
//             const widgetType = TableDetailsWidget;
//             context.manager.launchWidgetForId(
//               table.id,
//               widgetType,
//               service,
//               table.id,
//               table.name
//             );
//           }}
//         />
//       </ul>
//     );
//   }
// }

// export class ListModelItem extends React.Component<ModelProps, State> {
//   render() {
//     const { model } = this.props;
//     return (
//       <ul>
//         <ListItem name={model.id} subfields={null} />
//       </ul>
//     );
//   }
// }

const mapStateToProps = state => {
  return { data: state.dataTreeSlice.data };
};

export default connect(mapStateToProps, null)(ListProjectItem);
