// @flow

export const setError = (key: string, error: any) => ({type: "SET_ERROR", key, error});

export const addError = (key: string, error: any) => ({type: "ADD_ERROR", key, error});

export const deleteError = (key: string) => ({type: "DELETE_ERROR", key});
