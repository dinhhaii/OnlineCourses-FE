import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../../actions/user';
import { PATH, TAB } from '../../utils/constant';

const Menu = ({ isDisplayedMenu, userState, showMenuContent }) => {
  return (
    <div
      id="main_menu"
      className={isDisplayedMenu ? 'show' : ''}
      style={{ zIndex: 997, fontSize: `${15}pt` }}>

      <div className="container">
        <div className="row">
          <h2 style={{ color: 'white' }}>
            {userState.user && `Hi ${userState.user.firstName} ${userState.user.lastName},`}
          </h2>
        </div>
        <nav className="version_2">
          <div className="row">
            {userState.user && (
              <div className="col-md-4">
                <h3>Profile</h3>
                <ul>
                  <li>
                    <Link to={`${PATH.PROFILE}?tab=${TAB.PERSONAL_INFORMATION}`} onClick={showMenuContent}>
                      Information
                    </Link>
                  </li>
                  <li>
                    <Link to={`${PATH.PROFILE}?tab=${TAB.CHANGE_PASSWORD}`} onClick={showMenuContent}>
                      Change Password
                    </Link>
                  </li>
                  {userState.user.role === 'learner' && (
                  <li>
                    <Link to={`${PATH.PROFILE}?tab=${TAB.INVOICES}`} onClick={showMenuContent}>
                      My Invoices
                    </Link>
                  </li>
                  )}

                </ul>

              </div>
            )}
            <div className="col-md-4">
              <h3>Courses</h3>
              <ul>
                {userState.user && userState.user.role === 'lecturer' && (
                <>
                  <li>
                    <Link
                      to={`${PATH.LECTURER_COURSE}`}
                      onClick={showMenuContent}>
                      My Courses
                    </Link>
                    <span className="badge_info">Lecturer</span>
                  </li>
                  <li>
                    <Link to={PATH.COURSE_EDIT} onClick={showMenuContent}>
                      Courses Management
                    </Link>
                    <span className="badge_info">Lecturer</span>
                  </li>
                </>
                )}

                <li>
                  <Link to={PATH.COURSES} onClick={showMenuContent}>
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link to={PATH.LECTURERS} onClick={showMenuContent}>
                    All Teachers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <h3>UDEMA</h3>
              <ul>
                <li>
                  <Link to={PATH.CHAT} onClick={showMenuContent}>
                    <i className="icon-chat-empty" /> Messenger
                  </Link>
                </li>
                <li>
                  <Link to={PATH.CONTACT} onClick={showMenuContent}>
                    <i className="icon-contacts" /> Contact
                  </Link>
                </li>
                <li>
                  <Link to={PATH.ABOUT} onClick={showMenuContent}>
                    <i className="icon-home" /> About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="follow_us">
          <ul>
            <li>Follow us</li>
            <li>
              <a href="https://www.facebook.com/Hacademy-103199398091895/" rel="noopener noreferrer" target="_blank">
                <i className="ti-facebook" />
              </a>
            </li>
          </ul>
          {userState.isLogin && (
            <Link
              to={PATH.LOGOUT}
              className="btn btn-danger"
              onClick={showMenuContent}>
              <i className="icon-logout-1" /> Log Out
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userState: state.userState,
    generalState: state.generalState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserAction: bindActionCreators(fetchUser, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
