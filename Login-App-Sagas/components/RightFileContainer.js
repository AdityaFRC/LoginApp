import React, {PropTypes} from "react";
import styles from "../styles/RightPanel.css";
import cssModules from "react-css-modules";

const propTypes = {
  renderFileList: PropTypes.func.isRequired,
  clickFileUpload: PropTypes.func.isRequired
};

function RightFileContainer({renderFileList, clickFileUpload, currentUserIsAdmin, isClass}) {
  if (isClass && !currentUserIsAdmin) {
    return (
      <div styleName="right-file-container">
        <div styleName="file-container">
          {renderFileList()}
        </div>
      </div>
    );
  } else {
    return(
      <div styleName="right-file-container">
        <div styleName="add-container">
          <img
              styleName="add-icon"
              src="img/right_panel/add-people.svg"
              alt="Upload file"
              title="Upload file"
              onClick={clickFileUpload}
              onKeyDown={clickFileUpload}
              role="button"
              tabIndex="0"
          />
          <div styleName="add-text">Upload</div>
        </div>

        <div styleName="file-container">
          {renderFileList()}
        </div>
      </div>
    );
  }
}

RightFileContainer.propTypes = propTypes;

export default cssModules(RightFileContainer, styles);

