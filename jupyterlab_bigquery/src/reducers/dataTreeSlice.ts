import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataTree } from '../components/list_items_panel/service/list_items';

export interface DataTreeState {
  data: DataTree;
  currentProject: string;
}

const initialState: DataTreeState = {
  data: {
    projects: [],
  },
  currentProject: '',
};

const dataTreeSlice = createSlice({
  name: 'dataTree',
  initialState,
  reducers: {
    updateDataTree(state, action: PayloadAction<DataTree>) {
      const dataTreeResult = action.payload;
      state.data = dataTreeResult;
      state.currentProject = dataTreeResult.projects[0].name;
    },
  },
});

export const { updateDataTree } = dataTreeSlice.actions;

export default dataTreeSlice.reducer;
