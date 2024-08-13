import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './reducers/eventSlice';
// import settingsReducer from './settingsSlice';

const store = configureStore({
  reducer: {
    events: eventsReducer,
    // settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
