import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
	sortComparer: (a, b) =>
		a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});
// get normalized state
const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotes: builder.query({
			query: () => "/notes",
			validateStatus: (response, result) => {
				return response.status === 2000 && !result.isError;
			},
			keepUnusedDataFor: 5, // default is 60 sec
			// working with mongoDB
			transformResponse: (responseData) => {
				const loadedoNtes = responseData.map((user) => {
					user.id = user._id;
					return user;
				});
				return notesAdapter.setAll(initialState, loadedoNtes);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Note", id: "LIST" },
						...result.ids.map((id) => ({ type: "Note", id })),
					];
				} else {
					return [{ type: "Note", id: "LIST" }];
				}
			},
		}),
	}),
});

export const { useGetNotesQuery } = notesApiSlice;

// return the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// create memoized selector
const selectNotesData = createSelector(
	selectNotesResult,
	(notesResult) => notesResult.data // normalized state object with ids and entities
);

// getSelectors create these selectors and we rename them with alias
export const {
	selectAll: selectAllNotes,
	selectById: selectNoteById,
	selectIds: selectNoteIds,
	// pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
	(state) => selectNotesData(state) ?? initialState
);
