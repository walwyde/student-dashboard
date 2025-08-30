import StudentIDCard from '@/src/components/StudentIdCard';
import * as React from 'react';

const StudentID = () => {
  return  (<StudentIDCard student={{
        study_year: 5,
        full_name: "Yobe Auwal",
        program: "Computer Science",
        student_id: "12223425",
        profile_image_url: "https:picsum.com/computer/200"
    }} profile={{
        user_id: "12223425",
        email: "walwyde@gmail.com",

    }} />)
}

export default StudentID;