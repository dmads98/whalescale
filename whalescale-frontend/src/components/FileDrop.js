import React, { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'
import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import {Container} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import TagsInput from './TagsInput';


const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 10,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 300,
  height: 250,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function FileDrop(props) {

  const [files, setFiles] = useState([]);
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const onDrop = useCallback(acceptedFiles => {
    const newF = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    props.fileDropUpdate(newF);
    setFiles(files.concat(newF))
  }, [])
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({noClick: false, accept: 'image/jpeg, image/png', onDrop})

  return (
    <a {...getRootProps()} className="card-drop">
      {files.length < 1 ? (<h3>&rarr; Drag 'n' drop images, or <a>click to browse</a></h3>) : (<h3>&rarr; Drag 'n' drop more images</h3>)}


      <input {...getInputProps()} />
      {
        isDragActive ? <p> ✅ Drop files here ... </p> : <p>🏞️ JPG, PNG supported</p>
      }
      <p>(Min. Size: 1000 x 666)</p>
      {isDragReject && (<p>Some files will be rejected</p>)}

      {files.length < 1 ? ("") : (<h4># of images: {files.length}</h4>)}

      {/* {files.length > 0 ? (<aside style={thumbsContainer}>
        {thumbs}
      </aside>) : ("")} */}

    </a>
  )
}

export default FileDrop;
