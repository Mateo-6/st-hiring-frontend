import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { IEvent } from '../../models/event';

const getInitialState = (): IEvent[] => {
  return [{}];
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState: getInitialState(),
  reducers: {
    saveNewEvents(state, action: PayloadAction<IEvent[]>) {
      return action.payload;
    },
  },
});

export default eventsSlice.reducer;

export const { saveNewEvents } = eventsSlice.actions;
