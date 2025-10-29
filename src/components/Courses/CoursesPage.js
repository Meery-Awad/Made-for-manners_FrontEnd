

import CourseModal from './Modal';
import CoursesContaner from './CoursesCont';
import SortAndFilter from './SortAndFilter';
import SearchBox from './Search';

const CoursesPage = () => {
  return (
    <div className="PageContaner">
      <>
        <div className="recommended">
          <p className="topic">Courses</p>
          <div className="line-container">
            <span className="line"></span>
            <i className="fas fa-play-circle"></i>
          </div>
           <div className='noti'>Please be advised that once the payment for the course has been completed, cancellations and refunds are not permitted.</div>
     
        </div>

        <div className="row1">
          <SortAndFilter/>     
          <SearchBox />
          <CourseModal />
          
        </div>

        <CoursesContaner type="all" />
         
      </>
    </div>
  );
};

export default CoursesPage;
