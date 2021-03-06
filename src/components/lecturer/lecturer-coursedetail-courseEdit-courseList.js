/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Input } from 'antd';
import 'antd/dist/antd.css';

const { Search } = Input;

const LecturerCourseDetailCourseList = (props) => {
  const { courseLecturerList, setSelect, select, choosePage, currentPage, handleChangeFilter } = props;

  return (
    <div className="col-lg-4">
      <Search
        className="mb-4"
        placeholder="Enter Course's name"
        onChange={(e) => {
          handleChangeFilter(e.target.value);
        }}
      />
      {courseLecturerList.map((course, index) => {
        return (
          <div
            key={index.toString()}
            className={`kt-portlet kt-callout 
            ${course.status === 'denied' ? 'kt-callout--danger' : ''} 
            ${course.status === 'approved' ? 'kt-callout--success' : ''} 
            ${course.status === 'pending' ? 'kt-callout--warning' : ''} 
            kt-callout--diagonal-bg`}
            style={
              select === index
                ? {
                  pointerEvents: 'none',
                  opacity: 0.5,
                  border: 'black 4px solid',
                  background: 'gray',
                }
                : { cursor: 'pointer' }
            }
            onClick={() => setSelect(index)}>
            <div className="kt-portlet__body">
              <div className="kt-callout__body">
                <div className="kt-callout__content">
                  <h4 className="kt-callout__title">{course.name}</h4>
                  <p
                    className="kt-callout__desc"
                    style={{ height: 50, overflow: 'hidden' }}>
                    {course.description}
                  </p>
                </div>
                <div className="kt-callout__action">
                  <button
                    className={`btn btn-custom btn-bold btn-upper btn-font-sm w-100
                      ${course.status === 'denied' ? 'btn-danger' : ''} 
                      ${course.status === 'approved' ? 'btn-success' : ''} 
                      ${course.status === 'pending' ? 'btn-warning' : ''}`}>
                    {course.status}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <button
        className="btn btn-primary w-100 mt-4 mb-5"
        onClick={() => choosePage(currentPage + 1)}>
        Load More
      </button>
    </div>
  );
};

export default LecturerCourseDetailCourseList;
