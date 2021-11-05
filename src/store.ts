import { configureStore } from '@reduxjs/toolkit';

import testSlice from './features/testSlice';

const store = configureStore({
  reducer: { test: testSlice },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;