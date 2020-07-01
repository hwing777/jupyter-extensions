import { LinearProgress, withStyles } from '@material-ui/core';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import * as csstips from 'csstips';
// import React, { useState } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import { stylesheet } from 'typestyle';

// import { DataTree, Project, Dataset, Table, Model } from './service/list_items';
import { DataTree } from './service/list_items';
import { Context } from './list_tree_item_widget';
import { DatasetDetailsWidget } from '../details_panel/dataset_details_widget';
import { DatasetDetailsService } from '../details_panel/service/list_dataset_details';
import { TableDetailsWidget } from '../details_panel/table_details_widget';
import { TableDetailsService } from '../details_panel/service/list_table_details';

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
  // project: Project;
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

export function BuildTree(project, context) {
  const openDatasetDetails = dataset => {
    const service = new DatasetDetailsService();
    const widgetType = DatasetDetailsWidget;
    context.manager.launchWidgetForId(
      dataset.id,
      widgetType,
      service,
      dataset.id,
      dataset.name
    );
  };

  const openTableDetails = table => {
    const service = new TableDetailsService();
    const widgetType = TableDetailsWidget;
    context.manager.launchWidgetForId(
      table.id,
      widgetType,
      service,
      table.id,
      table.name
    );
  };

  const renderTables = table => (
    <TreeItem key={table.id} nodeId={table.id} label={table.name} />
  );

  const renderModels = model => (
    <TreeItem key={model.id} nodeId={model.id} label={model.name} />
  );

  const renderDatasets = dataset => (
    <div onDoubleClick={() => openDatasetDetails(dataset)}>
      <TreeItem key={dataset.id} nodeId={dataset.id} label={dataset.name}>
        {Array.isArray(dataset.tables)
          ? dataset.tables.map(table => renderTables(table))
          : null}
        {Array.isArray(dataset.models)
          ? dataset.models.map(model => renderModels(model))
          : null}
      </TreeItem>
    </div>
  );

  const renderProjects = (id, name, datasets) => (
    <TreeItem key={id} nodeId={id} label={name}>
      {Array.isArray(datasets)
        ? datasets.map(dataset => renderDatasets(dataset))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      className={localStyles.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderProjects(project.id, project.name, project.datasets)}
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
  constructor(props: ProjectProps) {
    super(props);
  }

  render() {
    const { data, context } = this.props;
    if (data.projects.length > 0) {
      console.log(context);
      return data.projects.map(p => (
        <div key={p.id}>{BuildTree(p, context)}</div>
      ));
    } else {
      console.log('not loaded yet!');
      return <LinearProgress />;
    }
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
  const data = state.dataTree.data;
  return { data };
};

export default connect(mapStateToProps, null)(ListProjectItem);
