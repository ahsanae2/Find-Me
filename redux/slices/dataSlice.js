import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
  chats: [],
  records: [],
  lists: [],
  add: [],
  groups: [],
  notify: [],
  name: [],
  location: [],
  users: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateContacts: (state, action) => {
      state.contacts = action.payload;
    },
    updateChats: (state, action) => {
      state.chats = action.payload;
    },
    updateRecords: (state, action) => {
      state.records = action.payload;
    },
    updateLists: (state, action) => {
      state.lists = action.payload;
    },
    updateAdd: (state, action) => {
      state.add = action.payload;
    },
    updateGroups: (state, action) => {
      state.groups = action.payload;
    },
    updateNotify: (state, action) => {
      state.notify = action.payload;
    },
    updateName: (state, action) => {
      state.name = action.payload;
    },
    updateLocation: (state, action) => {
      state.location = action.payload;
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const {
  updateContacts,
  updateChats,
  updateRecords,
  updateLists,
  updateAdd,
  updateGroups,
  updateNotify,
  updateLocation,
  updateName,
  updateUsers,
} = dataSlice.actions;

export const selectContacts = (state) => state.data.contacts;
export const selectChats = (state) => state.data.chats;
export const selectRecords = (state) => state.data.records;
export const selectLists = (state) => state.data.lists;
export const selectAdd = (state) => state.data.add;
export const selectGroups = (state) => state.data.groups;
export const selectNotify = (state) => state.data.notify;
export const selectName = (state) => state.data.name;
export const selectLocation = (state) => state.data.location;
export const selectUsers = (state) => state.data.users;
export default dataSlice.reducer;
