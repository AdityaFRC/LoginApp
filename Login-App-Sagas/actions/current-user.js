// @flow

export const updateEmail = (email: string) => (
  {type: "UPDATE_EMAIL", email}
); // What this does is that when "change email is called" it takes they
// entered parameters of email and then returns the type and value of email

export const updatePassword = (password: string) => (
  {type: "UPDATE_PASSWORD", password}
);

export const toggleWantsRemembered = () => ({type: "TOGGLE_WANTS_REMEMBERED"});

export const login = () => ({type: "LOGIN"});

export const loginSuccess = (userId: number) => ({type: "LOGIN_SUCCESS", userId});

export const setCreating = (creating: (string|boolean)) => ({type: "SET_CREATING", creating});

export const logout = (force = false) => ({type: "LOGOUT", force});

export const logoutSuccess = () => ({type: "LOGOUT_SUCCESS"});

export const signUp = (accountType, email, password, firstName, lastName, university) =>
  ({type: "SIGN_UP", accountType, email, password, firstName, lastName, university});

// Used for change account info
export const changeAccountInfo =
  (firstName, lastName, email, university, accountType,
  school, department, yearOfGraduation, id) =>
    ({
      type: "CHANGE_ACCOUNT_INFO",
      firstName,
      lastName,
      email,
      university,
      accountType,
      school,
      department,
      yearOfGraduation,
      id
    });

export const updateUserAccountInfo =
(firstName, lastName, email, university, universityName, accountType,
  school, schoolName, department, departmentName, yearOfGraduation, id) =>
  ({
    type: "UPDATE_USER_ACCOUNT_INFO",
    firstName,
    lastName,
    email,
    university,
    universityName,
    accountType,
    school,
    schoolName,
    department,
    departmentName,
    yearOfGraduation,
    id
  });

export const requestPasswordChange = (email: string) => ({type: "FORGOT_PASSWORD_REQUEST", email});

export const resetPassword = (key: string, password: string) =>
  ({type: "RESET_PASSWORD", key, password});

export const startUploadingPicture = () => ({type: "START_UPLOADING_PICTURE"});

export const uploadProfilePicture = (picture, name) =>
  ({type: "UPLOAD_PROFILE_PICTURE", picture, name});

export const finishedUploadPicture = (picture) =>
  ({type: "FINISHED_UPLOAD_PICTURE", picture});

export const resetAccountSettingFlashMessageStatus = (hasMadeSuccessfulCall, hasMadeRequest) =>
  ({type: "RESET_ACCOUNT_SETTING_FLASH_MESSAGE_STATUS", hasMadeSuccessfulCall, hasMadeRequest});

export const hasMadeSuccessfulUserRequest = (hasMadeSuccessfulCall, hasMadeRequest) =>
  ({type: "HAS_MADE_SUCCESSFUL_USER_REQUEST", hasMadeSuccessfulCall, hasMadeRequest
  });

export const resetErrorMessage = () => ({type: "RESET_ERROR_MESSAGE"});

export const addNewTags = (id: number, tag: string) => ({type: "ADD_NEW_TAGS", id, tag});

export const addNewAreaOfStudy = (id: number, tag: string) => ({type: "ADD_NEW_AREA_OF_STUDY", id, tag});

export const changeGraduationYear = (year: number) => ({type: "CHANGE_GRAD_YEAR"});

export const changeAreaOfStudy = (areaOfStudy: string) => ({type: "CHANGE_AREA_OF_STUDY"});

export const changeCurrentSessionExpired = () => ({type: "CHANGE_CURRENT_SESSION_EXPIRED"});

export const refreshSchoolSuggestionList = (id: number) =>
  ({type: "REFRESH_SCHOOL_SUGGESTION_LIST", id});

export const closeSchoolSuggestionList = () => setSchoolSuggestionList(null);

export const setSchoolSuggestionList = (list: Array<School>) =>
  ({type: "SET_SCHOOL_SUGGESTION_LIST", list});

export const refreshDepartmentSuggestionList = (id: number) =>
  ({type: "REFRESH_DEPARTMENT_SUGGESTION_LIST", id});

export const closeDepartmentSuggestionList = () => setDepartmentSuggestionList(null);

export const setDepartmentSuggestionList = (list: Array<Department>) =>
  ({type: "SET_DEPARTMENT_SUGGESTION_LIST", list});
