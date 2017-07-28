// @flow

export const createClass = (className: string, classCode: string, ifSearchable: boolean, pictureObject: number) =>
  ({type: "CREATE_CLASS", className, classCode, ifSearchable, pictureObject});

export const resetClassName = () => ({type: "RESET_CLASS_NAME"});

export const resetClassCode = () => ({type: "RESET_CLASS_CODE"});
