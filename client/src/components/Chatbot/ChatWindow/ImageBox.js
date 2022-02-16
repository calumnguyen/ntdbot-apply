import React from "react";

function ImageBox({ src, alt, isAvailable }) {
  return (
    <div className="chatUserImage">
      <div className="position-relative">
        <img src={src} alt={alt} className="chatApp__convMessageAvatar" />
        <span className="isAvailable_yellow">
          {isAvailable ? (
            <i className="fa fa-circle" aria-hidden="true" />
          ) : null}
        </span>
      </div>
    </div>
  );
}

export default ImageBox;
