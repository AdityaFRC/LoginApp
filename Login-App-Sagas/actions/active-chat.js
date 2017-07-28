// @flow

export const requestLoadChat = (id: number, parentId: ?number, onlyParentChatUser: boolean) =>
  ({type: "REQUEST_LOAD_CHAT", id, parentId, onlyParentChatUser});

export const startLoadChat = (id: number, parentId: ?number) =>
  ({type: "START_LOAD_CHAT", id, parentId});

export const loadMessagesPage = (chatId: number, messages: Array<Object>) =>
  ({type: "LOAD_MESSAGES_PAGE", chatId, messages});

export const requestPageMessages = () => ({type: "REQUEST_PAGE_MESSAGES"});

export const sendMessage = (text: string) => ({type: "SEND_MESSAGE", text});

export const addPendingMessage = (id: string, message: Object) =>
  ({type: "ADD_PENDING_MESSAGE", id, message});

export const confirmPendingMessage = (id: string, message: Object) =>
  ({type: "CONFIRM_PENDING_MESSAGE", id, message});

export const cancelPendingMessage = (id: string) => ({type: "CANCEL_PENDING_MESSAGE", id});

export const receiveMessage = (message: Object) => ({type: "RECEIVE_MESSAGE", message});

export const requestLoadComments = (messageId: number) =>
  ({type: "REQUEST_LOAD_COMMENTS", messageId});

export const loadComments = (chatId: number, messageId: number, comments: Iterable<Object>) =>
  ({type: "LOAD_COMMENTS", chatId, messageId, comments});

export const sendComment = (messageId: number, text: string) =>
  ({type: "SEND_COMMENT", messageId, text});

export const addPendingComment = (messageId: number, commentId: number, comment: Object) =>
  ({type: "ADD_PENDING_COMMENT", messageId, commentId, comment});

export const confirmPendingComment = (messageId: number, commentId: number, comment: Object) =>
  ({type: "CONFIRM_PENDING_COMMENT", messageId, commentId, comment});

export const cancelPendingComment = (messageId, commentId) =>
  ({type: "CANCEL_PENDING_COMMENT", messageId, commentId});

export const receiveComment = (comment: Object) => ({type: "RECEIVE_COMMENT", comment});

export const loadResourcesPage = (chatId: number, resources: Array<Object>) =>
  ({type: "LOAD_RESOURCES_PAGE", chatId, resources});

export const requestPageResources = () => ({type: "REQUEST_PAGE_RESOURCES"});

export const addResource = (message: Object) => ({type: "ADD_RESOURCE", message});

export const loadUsersPage = (chatId: number, users: Array<number>) =>
  ({type: "LOAD_USERS_PAGE", chatId, users});

export const requestPageUsers = () => ({type: "REQUEST_PAGE_USERS"});

export const requestLoadSubchats = () => ({type: "REQUEST_LOAD_SUBCHATS"});

export const loadAdmins = (chatId: number, admins: Iterable<number>) =>
  ({type: "LOAD_ADMINS", chatId, admins});

export const loadTas = (chatId: number, tas: Iterable<number>) => ({type: "LOAD_TAS", chatId, tas});

export const setFilePreview = (data: Object) => ({type: "SET_FILE_PREVIEW", data});

export const sendFile = (file: File, title: string, extension: string, text: string) =>
  ({type: "SEND_FILE", file, title, extension, text});

export const invite = (users) => ({type: "INVITE", users});

export const activateBot = () => ({type: "ACTIVATE_BOT"});

export const sendFileComment = (messageId, file, title, extension, text) =>
  ({type: "SEND_FILE_COMMENT", messageId, file, title, extension, text});

export const changeIfExistsUnsentFile = (hasUnsentFile: boolean) =>
  ({type: "CHANGE_IF_EXISTS_UNSENT_FILE", hasUnsentFile});

export const changeIfAllFilesLoaded = (allFilesLoaded: boolean) =>
  ({type: "CHANGE_IF_ALL_FILES_LOADED", allFilesLoaded});

export const changeIfAllSubchatsLoaded = (allSubchatsLoaded:boolean) =>
  ({type: "CHANGE_IF_ALL_SUBCHATS_LOADED", allSubchatsLoaded});

export const allMessagesLoaded = (allMessagesLoaded: boolean) =>
  ({type: "ALL_MESSAGES_HAVE_BEEN_LOADED"});

export const uploadChatPicture = (picture, name) =>
  ({type: "UPLOAD_CHAT_PICTURE", picture, name});

export const startUploadingChatPicture = () =>
  ({type: "START_UPLOADING_CHAT_PICTURE"});

export const finishedUploadChatPicture = (picture) =>
  ({type: "FINISHED_UPLOAD_CHAT_PICTURE", picture});

export const isFirstTimeLoadingMessages = (isFirstTimeLoadingMessages: boolean) =>
  ({type: "FIRST_TIME_LOADING_MESSAGES"});

export const inviteNewFromParent = (inviteNewFromParent: boolean) =>
  ({type: "CHECK_INVITE_NEW", inviteNewFromParent});

export const updateCounter = () => ({type: "UPDATE_COUNTER"});

export const pickUpCounter = (message) => ({type: "PICK_COUNTER", message});
