import AxiosService from '../utils/axios';
import { SERVER_URL } from '../utils/constant';

export const getCourseList = () => {
  return AxiosService.get(`${SERVER_URL}/course`);
};

export const getCourseLecturerList = (_id) => {
  return AxiosService.get(`${SERVER_URL}/course/${_id}/teaching`);
};

export const getCourse = (_id) => {
  return AxiosService.get(`${SERVER_URL}/course/${_id}`);
};

export const getCourseByLessonId = (_id) => {
  return AxiosService.get(`${SERVER_URL}/course/lesson/${_id}`);
};

export const createCourse = (course) => {
  return AxiosService.post(`${SERVER_URL}/course/create`, { ...course });
}

export const updateCourse = course => {
  return AxiosService.post(`${SERVER_URL}/course/update`, { ...course });
}