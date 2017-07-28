// @flow

export const addUsers = (users: Array<Object>) => ({type: "ADD_USERS", users});

export const addUser = (user) => ({type: "ADD_USER", user});

export const addNewTagsSuccessfully = (id: number, tagId: number, tag: string) =>
  ({type: "ADD_NEW_TAGS_SUCCESSFULLY", id, tagId, tag});

export const addNewAreaOfStudySuccessfully = (id: number, tagId: number, tag: string) =>
  ({type: "ADD_NEW_AREA_OF_STUDY_SUCCESSFULLY", id, tagId, tag});

export const changeFirstName = (id: number, firstName: string) =>
  ({type: "CHANGE_FIRST_NAME", id, firstName});

export const changeYearOfGraduation = (id: number, yearOfGraduation: string) =>
  ({type: "CHANGE_YEAR_OF_GRADUATION", id, yearOfGraduation});
