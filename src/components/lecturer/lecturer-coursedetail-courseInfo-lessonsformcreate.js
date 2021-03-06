/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import {
  Upload, Button, Progress, Tooltip, 
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
import 'antd/dist/antd.css';
import '../../utils/css/lecturer-coursedetail-lessonform.css';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';
import { createLesson } from '../../actions/lesson';
import { fetchCourseLecturerList } from '../../actions/course';

const STATUS = {
  SAVED: 1,
  LOADING: 2,
  UNSAVED: 3,
};

const LecturerCourseDetailLessonFormCreate = (props) => {
  const {
    lessonFormCreateList, setLessonFormCreateList, index, pos, selectedCourse,
  } = props;
  const [state, setState] = useState({
    name: '',
    description: '',
    lectureURL: '',
    files: [],
  });

  const [save, setSave] = useState(STATUS.SAVED);
  const [fileList, setFileList] = useState([]);
  const [videoData, setVideoData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const viewAttachment = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const attachment = {
        file,
        blobData: e.target.result,
      };
      if (file.type.includes('video')) {
        setVideoData(attachment);
      }
    };
    reader.readAsDataURL(file);
  };

  const propsUpload = {
    onRemove: file => {
      const key = fileList.indexOf(file);
      setFileList([...fileList].splice(key, 1));
    },
    beforeUpload: file => {
      setSave(STATUS.UNSAVED);
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const putStorageItem = (directoryName, file) => {
    return new Promise((resolve, reject) => {
      const task = firebase.storage().ref(`${directoryName}/${file.name}`).put(file);
      task.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(percent);
          setFileName(percent === 100 ? '' : file.name);
        },
        (error) => {
          toast.error(error.message);
          reject(error);
        },
        () => {
          firebase.storage().ref(directoryName).child(file.name).getDownloadURL()
            .then(fileURL => {
              const fileInfo = {
                name: file.name,
                type: file.type,
                fileURL,
              };
              resolve(fileInfo);
            });
        },
      );
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSave(STATUS.LOADING);
    const newState = { ...state, _idCourse: selectedCourse._id };
    const videoFile = videoData ? videoData.file : null;

    const videoItem = videoFile ? [putStorageItem('videos', videoFile)] : [];
    const storageItems = fileList ? [...videoItem, ...fileList.map(file => putStorageItem('docs', file))] : videoItem;
    Promise.all(storageItems)
      .then((files) => {
        setFileList([]);
        files.forEach(element => {
          if (element.type.includes('video')) {
            const updatedState = { ...newState, lectureURL: element.fileURL };
            props.createLessonAction(updatedState);
            setState(updatedState);
          } else {
            const updatedState = {
              ...state,
              files: [...newState.files, element], 
            };
            props.createLessonAction(updatedState);
            setState(updatedState);
          }
        });
        setSave(STATUS.SAVED);
        lessonFormCreateList.splice(pos, 1);
        setLessonFormCreateList([...lessonFormCreateList]);
      })
      .catch((error) => toast.error(error.message));
    
    if (!videoFile && fileList.length === 0) {
      props.createLessonAction(newState);
      setSave(STATUS.SAVED);
      lessonFormCreateList.splice(pos, 1);
      setLessonFormCreateList([...lessonFormCreateList]);
    }
  };

  const handleChange = e => {
    setSave(STATUS.UNSAVED);
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <div className="kt-portlet" data-ktportlet="true" style={{ border: '1px black solid' }}>
      <div className="kt-portlet__head bg-light" style={{ borderBottom: '1px black solid' }}>
        <div className="kt-portlet__head-label">
          CREATE NEW LESSON
        </div>
        <div className="kt-portlet__head-toolbar">
          <div className="kt-portlet__head-group">
            <button
              type="submit"
              form={`lessonForm${index}`}
              className={`btn 
                ${save === STATUS.SAVED && 'btn-info'} 
                ${save === STATUS.LOADING && 'btn-warning'} 
                ${save === STATUS.UNSAVED && 'btn-info'} btn-icon btn-pill`}
              disabled={save === STATUS.SAVED}>
              {save === STATUS.SAVED && <i className="icon-paper-plane" />}
              {save === STATUS.UNSAVED && <i className="icon-paper-plane" />}
              {save === STATUS.LOADING && <i className="icon-spin6 animate-spin" />}
            </button>
          </div>
        </div>
      </div>
      <div className="kt-portlet__body position-relative">
        <Progress
          percent={progress}
          showInfo={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            marginTop: '-8px',
          }}
        />
        <small
          style={{
            position: 'absolute',
            top: 0,
            left: 5,
            marginTop: '-3px',
            fontSize: '7pt',
          }}>
          {fileName} 
        </small>
        <form
          className="kt-form kt-form--label-right"
          id={`lessonForm${index}`}
          onSubmit={handleSubmit}>
          <div className="kt-portlet__body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  <div>
                    <Upload
                      className="mr-2"
                      name="video"
                      multiple={false}
                      beforeUpload={(e) => false}
                      showUploadList={false}
                      onChange={(info) => {
                        setSave(STATUS.UNSAVED);
                        viewAttachment(info.file);
                      }}>
                      <Button>
                        <UploadOutlined /> Upload Video
                      </Button>
                    </Upload>
                    <Button onClick={() => setVideoData(null)}>
                      <i className="icon-trash-1" />
                    </Button>
                  </div>
                  <div>
                    <ReactPlayer
                      url={videoData ? videoData.blobData : state.lectureURL}
                      controls
                      height="300"
                      width="100%"
                      className="react-player-custom"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="lessonName">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lessonName"
                      name="name"
                      value={state.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lessonDescription">Description:</label>
                    <textarea
                      className="form-control"
                      id="lessonDescription"
                      name="description"
                      value={state.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="attachments" className="mr-3">
                      Attachments:{' '}
                    </label>
                    <Upload {...propsUpload} name="files" id="attachments">
                      <Button>
                        <UploadOutlined /> Select File
                      </Button>
                    </Upload>
                    <hr />
                    <div className="mt-4">
                      {state.files.map((value, i) => {
                        return (
                          <div style={{ cursor: 'pointer' }} key={i.toString()}>
                            <Tooltip placement="topLeft" title={value.name}>
                              <i className="icon-upload-1 float-left" />
                              <span
                                className="w-75 overflow-hidden"
                                style={{
                                  display: 'inline-block',
                                  height: 22,
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}>
                                {value.name}
                              </span>
                              <span
                                style={{ cursor: 'pointer', float: 'right', color: 'red' }}
                                onClick={() => {
                                  const newFiles = state.files.slice();
                                  newFiles.splice(i, 1);
                                  setState({
                                    ...state,
                                    files: newFiles,
                                  });
                                  setSave(STATUS.UNSAVED);
                                }}>
                                <i className="icon-trash-1" />
                              </span>
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    lessonState: state.lessonState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createLessonAction: bindActionCreators(createLesson, dispatch),
    fetchCourseLecturerListAction: bindActionCreators(fetchCourseLecturerList, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LecturerCourseDetailLessonFormCreate));
