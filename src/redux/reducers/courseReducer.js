import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function courseReducer(state = initialState.courses, action) {
 var flag=0;
  switch (action.type) {
    case types.CREATE_COURSE_SUCCESS:
      return [...state, { ...action.course }];
    case types.UPDATE_COURSE_SUCCESS:
      return state.map(course =>
        course.id === action.course.id ? action.course : course
      );
      case types.LOAD_COURSES_SUCCESS:
        if(action.flag){
          flag=1;
        }
        
        if(flag==0){
          return action.courses;
        }
        else {  
          var palabra=action.data;            
          var regex= new RegExp(`^${palabra}` , 'i');
          return action.courses.filter(n=>regex.test(n.title));   
        }      
    case types.DELETE_COURSE_OPTIMISTIC:
      return state.filter(course => course.id !== action.course.id);
    default:
      return state;
  }
}
