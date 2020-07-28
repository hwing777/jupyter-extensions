import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DataTree,
  Project,
  Dataset,
} from '../components/list_items_panel/service/list_items';

export interface DataTreeState {
  data: { projects: {}; projectIds: string[] };
}

const initialState: DataTreeState = {
  data: {
    projects: JSON.parse(localStorage.getItem('projects')) || [],
    projectIds: JSON.parse(localStorage.getItem('projectIds')) || [],
  },
};

const dataTreeSlice = createSlice({
  name: 'dataTree',
  initialState,
  reducers: {
    updateDataTree(state, action: PayloadAction<DataTree>) {
      const dataTreeResult = action.payload;
      if (initialState.data.projectIds.length === 0) {
        state.data.projects = dataTreeResult.projects;
        state.data.projectIds = dataTreeResult.projectIds;
        localStorage.setItem(
          'projects',
          JSON.stringify(dataTreeResult.projects)
        );
        localStorage.setItem(
          'projectIds',
          JSON.stringify(dataTreeResult.projectIds)
        );
      }

      console.log('start state:');
      console.log(initialState);
    },
    updateProject(state, action: PayloadAction<Project>) {
      const projectResult = action.payload;
      const projectId = projectResult.id;
      state.data.projects = {
        ...state.data.projects,
        [projectId]: projectResult,
      };
    },
    addProject(state, action: PayloadAction<Project>) {
      const projectResult = action.payload;
      const projectId = projectResult.id;
      if (!state.data.projects[projectId]) {
        state.data.projects = {
          ...state.data.projects,
          [projectId]: projectResult,
        };
        state.data.projectIds.push(projectId);

        // Update local storage
        // eslint-disable-next-line prefer-const
        let newProjects = JSON.parse(localStorage.getItem('projects')) || [];
        newProjects[projectId] = projectResult;
        // eslint-disable-next-line prefer-const
        let newProjectIds =
          JSON.parse(localStorage.getItem('projectIds')) || [];
        newProjectIds.push(projectId);
        newProjectIds[projectId] = projectResult;
        console.log('curr state:');
        console.log(newProjects, newProjectIds);
        localStorage.setItem('projects', JSON.stringify(newProjects));
        localStorage.setItem('projectIds', JSON.stringify(newProjectIds));
      }
    },
    updateDataset(state, action: PayloadAction<Dataset>) {
      const datasetResult = action.payload;
      const datasetId = datasetResult.id;
      const projectId = datasetResult.projectId;
      state.data.projects[projectId].datasets = {
        ...state.data.projects[projectId].datasets,
        [datasetId]: datasetResult,
      };
    },
  },
});

export const {
  updateDataTree,
  updateProject,
  updateDataset,
  addProject,
} = dataTreeSlice.actions;

export default dataTreeSlice.reducer;
