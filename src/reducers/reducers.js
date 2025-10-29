import { useEffect, useState } from "react";
import axios from 'axios';


const reminders = (state = [], action) => {

    const useShareState = () => {

        const [editOrAdd, setEditOrAdd] = useState('Add')
        const [courses, setCourses] = useState([])
        const [allCourses, setAllCourses] = useState([])
        const [Loading, setLoading] = useState(false);
        const [reload, setReload] = useState(false);

        //    const serverUrl = 'http://localhost:5000'
          const serverUrl = 'https://madeformanners-backend.onrender.com'
        const courseValid = 'Please note that the course will be available to watch for only one week after the course date'
        // <SEO>
        const websiteTitle = `Made for Manners`
        const pageDescription = `Discover ${websiteTitle} — your destination for online etiquette and social skills courses. Learn professional behavior, confidence, and refined manners through engaging video lessons and expert guidance.`;

        const pageKeywords = `etiquette courses online, social skills training, professional behavior classes, manners lessons, ${websiteTitle}, online etiquette school, learn etiquette, business etiquette, communication skills`;

        const contactUsKeyWords = `${websiteTitle} contact, phone number, email address, get in touch, send a message, customer support`;

        const HomePageKeyWords = `${websiteTitle} homepage, main page, official website, start page, online manners school`;

        const aboutUsKeyWords = `about ${websiteTitle}, what is ${websiteTitle}, ${websiteTitle} overview, our story, mission and values, ${websiteTitle} about us`;

        const coursesKeyWords = `${websiteTitle} courses, online etiquette training, behavioral learning classes, social skills courses, business etiquette lessons, online education`;

        const loginKeyWords = `${websiteTitle} login, sign in, access your account, student login page`;

        const registerKeyWords = `${websiteTitle} registration, create an account, sign up, enroll online`;
        // </SEO>



        const [userDetails, setUserDetails] = useState(() => {
            const stored = localStorage.getItem(`user`);
            return stored ? JSON.parse(stored) : {
                id: '', name: '', email: '', password: '', confirmPassword: '', img: '', courses: []
            };
        });

        const [updatedData, setUpdatedData] = useState(userDetails);
        const [selectedCourse, setSelectedCourse] = useState(0);
        const [showDetails, setShowDetails] = useState(false);
       
        const categories = [
            { id: 0, level: 'Youth', icon: '', color: 'blue' },
            { id: 1, level: 'Student', icon: '', color: 'green' },
            { id: 2, level: 'Professional & Executive', icon: '', color: 'pink' },
            { id: 3, level: 'International Etiquette', icon: '', color: 'gold' },
            { id: 4, level: 'Private Coaching', icon: '', color: 'gold' }
        ]
        const [courseDetails, setCourseDetails] = useState({
            id: '',
            name: '',
            description: '',
            date: '',
            time: '',
            price: Number,
            recommended: false,
            img: null,
            categories: [],
            bookedUsers: [],
            joinedUsers: [],

        })
        const admin = { email: 'iuliana.esanu28@gmail.com', passport: 'julia12345' };

        useEffect(() => {
            setLoading(true)
            const CoursesData = async () => {
                try {
                    const { data } = await axios.get(`${serverUrl}/api/courses`);
                    setCourses(data);
                    setAllCourses(data)
                    setLoading(false)
                } catch (error) {
                    alert(`Error loading the page, please try again`);
                }
            };

            CoursesData();
        }, [reload]);

        useEffect(() => {
            localStorage.setItem(`user`, JSON.stringify(userDetails));
        }, [userDetails]);


        return {
            userDetails, setUserDetails,
            admin,
            courses, setCourses,
            courseDetails, setCourseDetails,
            editOrAdd, setEditOrAdd,
            Loading, setLoading,
            reload, setReload,
            categories,
            allCourses,
            selectedCourse, setSelectedCourse,
            showDetails, setShowDetails,
            updatedData, setUpdatedData,
            courseValid,
            serverUrl,
            pageDescription, pageKeywords,
            contactUsKeyWords, aboutUsKeyWords, HomePageKeyWords, coursesKeyWords,
            loginKeyWords, registerKeyWords,
            websiteTitle

        };
    };

    const data = {
        useShareState,
    };

    return data;
};

export default reminders;
