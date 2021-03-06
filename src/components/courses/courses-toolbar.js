/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Input } from 'antd';
import 'antd/dist/antd.css';
import { PATH, SEARCH } from '../../utils/constant';

const { Search } = Input;

const CourseToolBar = ({ viewMode, setViewMode, filter, setFilter, handleChangeFilter, history, initFilter }) => {

  return (
    <div className="filters_listing sticky_horizontal">
      <div className="container">
        <ul className="clearfix">
          <li>
            <Search
              placeholder="Search courses, lecturer, ..."
              value={filter.search}
              onPressEnter={(e) => {
                const { value } = e.target;
                if (value) {
                  const searchStorage = localStorage.getItem(SEARCH);
                  const searchArray = JSON.parse(searchStorage);
                  const item = JSON.stringify(searchArray ? [value, ...searchArray].slice(0, 10) : [value]);
                  localStorage.setItem(SEARCH, item);

                  history.push(`/courses?search=${value}`);
                }
              }}
              onChange={e => setFilter({ ...filter, search: e.target.value })}
              style={{ width: 400, marginBottom: 5 }}
            />
          </li>
          <li>
            <div className="layout_view">
              <Link
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'active' : ''}>
                <i className="icon-th" />
              </Link>
              <Link
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'active' : ''}>
                <i className="icon-th-list" />
              </Link>
            </div>
          </li>
          <li>
            <div
              className="layout_view"
              onClick={() => {
                setFilter(initFilter);
                history.push(PATH.COURSES);
                handleChangeFilter(initFilter);
              }}><i className="icon-arrows-cw" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default withRouter(CourseToolBar);
