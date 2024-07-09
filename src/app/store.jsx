import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { loadingSlice } from '../features/loading/loadingSlice';

const rootReducer = combineReducers({
  loading: loadingSlice.reducer
});

export const makeStore = (preloadedState) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat();
    },
    preloadedState
  });

  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();

// Infer the type of `store`
// export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
// export type AppDispatch = AppStore["dispatch"];
// export type AppThunk<ThunkReturnType = void> = ThunkAction<
//   ThunkReturnType,
//   RootState,
//   unknown,
//   Action
// >;
