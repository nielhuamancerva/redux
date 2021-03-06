import React from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as ProfessorActions from "../../redux/actions/professorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class CoursesPage extends React.Component {
  state = {
    redirectToAddCoursePage: false
  };

  componentDidMount() {
    const { courses, professors, actions } = this.props;

    if (courses.length === 0) {
      actions.getCourses().catch(error => {
        alert("Loading courses failed" + error);
      });
    }
    var palabra="Proce";
    var regex= new RegExp(`^${palabra}` , 'i');
    /*console.log(this.props.courses.length);*/
    var filtrado = courses.filter(n=>regex.test(n.title));
    /*console.log(filtrado);*/

    if (professors.length === 0) {
      actions.getProfessors().catch(error => {
        alert("Loading professors failed" + error);
      });
    }
  }

  handleDeleteCourse = async course => {
    toast.success("Course deleted");
    try {
      await this.props.actions.deleteCourse(course);
    } catch (error) {
      toast.error("Delete failed. " + error.message, { autoClose: false });
    }
  };
  handleBuscarFiltro = () => {
    var valorBuscar=document.getElementById("BuscarText").value;
    if(valorBuscar=="")
    {
      alert("ingrese el curso a buscar");
      return;
    }

    //alert("hola "+valorBuscar);
    this.props.actions.getCoursesFilter(valorBuscar);
    //this.props.actions.getCourses();
  };

  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
            <>
              <button
                style={{ marginBottom: 20 }}
                className="btn btn-primary add-course"
                onClick={() => this.setState({ redirectToAddCoursePage: true })}
              >
                Add Course
            </button>
            <div className="search">
            <input id="BuscarText" 
                    type="text" 
                />
            <button type="submit" onClick={this.handleBuscarFiltro}>Search</button>
            </div>
              <CourseList
                onDeleteClick={this.handleDeleteCourse}
                courses={this.props.courses}
              />
            </>
          )}
      </>
    );
  }
}

CoursesPage.propTypes = {
  professors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    courses:
      state.professors.length === 0
        ? []
        : state.courses.map(course => {
          return {
            ...course,
            ProfessorName: state.professors.find(a => a.id === course.professorId).name
          };
        }),
    professors: state.professors,
    loading: state.apiCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getCourses: bindActionCreators(courseActions.getCourses, dispatch),
      getProfessors: bindActionCreators(ProfessorActions.getProfessors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
      getCoursesFilter: bindActionCreators(courseActions.getCoursesFilter, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPage);
