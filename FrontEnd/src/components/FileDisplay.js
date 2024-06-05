import React from 'react';

const FileDisplay = ({ url, nombre }) => {
  return (
    <div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {nombre}
      </a>
    </div>
  );
}

export default FileDisplay;
