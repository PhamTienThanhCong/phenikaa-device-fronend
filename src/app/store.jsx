import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { loadingSlice } from "../features/loading/loadingSlice";
import { demoSlice } from "@/pages/demo/BasicSlice";
import { authSlice } from "@/features/auth/authSlice";
import { deviceSlice } from "@/pages/DeviceManage/DeviceSlice";
import { customerSlice } from "@/pages/manageCutome/CustomerSlice";
import { roomSlice } from "@/pages/RoomLoan/RoomSlice";
import { device_repair_Slice } from "@/pages/MaintenanceSchedulePage/device_repair_Slice";
import { maintenanceSlice } from "@/pages/IssueHistoryPage/maintanceSlice";
import { notifySlice } from "@/pages/ErrorReportsPage/errorReportSlice";
import { deviceCategorySlice } from "@/pages/EquipmentManagementPage/EquipmaintManagementSlice";
import { profileSlice } from "@/pages/profile/profileSlice";

const rootReducer = combineReducers({
  loading: loadingSlice.reducer,
  demo: demoSlice.reducer,
  auth: authSlice.reducer,
  device: deviceSlice.reducer,
  customer: customerSlice.reducer,
  room: roomSlice.reducer,
  device_repair: device_repair_Slice.reducer,
  maintenance: maintenanceSlice.reducer,
  notify: notifySlice.reducer,
  deviceCategory: deviceCategorySlice.reducer,
  profile: profileSlice.reducer
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
