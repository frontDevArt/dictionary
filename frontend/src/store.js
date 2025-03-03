import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import dictionaryReducer from "./features/dictionary/dictionarySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dictionary: dictionaryReducer,
  },
});

export default store;
