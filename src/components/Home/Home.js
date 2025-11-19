import './Home.scss';
import 'animate.css';
import { WOW } from 'wowjs';
import { useEffect, useState } from 'react';
import PromoVideo from "./PromoVideo";
import CoursesContaner from '../Courses/CoursesCont';
import { NavLink } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux';
import { useBetween } from 'use-between';
import image from '../../images/img.jpg';
import waving from '../../images/waving.gif'

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    new WOW({ live: false }).init(); 
  }, []);

  const [showVideo, setShowVideo] = useState(false);
  const state = useSelector((state) => state.data);
  const { pageDescription, pageKeٍywords, HomePageKeyWords, websiteTitle } = useBetween(state.useShareState);

  const contentPoints = [
    { title: "Youth & Students — Confidence for every stage.", desc: "We help young people develop social awareness, communication skills, and self-assurance — preparing them for interviews, internships, and new experiences." },
    { title: "Professionals & Entrepreneurs — Presence that supports ambition.", desc: "Learn to communicate with clarity and confidence, refine your image, and represent your brand or career with authenticity." },
    { title: "International Etiquette — Confidence across cultures.", desc: "Navigate professional and social settings globally with ease, cultural awareness, and composure." },
    { title: "Private Coaching — Personalised refinement.", desc: "One-to-one sessions designed to enhance posture, presence, and communication in a way that feels natural and authentic." }
  ];

  return (
    <div className="Home">
      <Helmet>
        <link rel="canonical" href="https://madeformanners.com" />
        <title>Home | {websiteTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${pageKeٍywords} ${HomePageKeyWords}`} />
        <meta property="og:title" content={`Home - ${websiteTitle}`} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      {/* --- 1. Hero Section --- */}
      <section className="hero wow animate__animated animate__fadeInDown">
        <h1>Authenticity refined. Confidence reimagined.</h1>
        <p className="subheading">Where etiquette becomes empowerment.</p>
      </section>

      {/* --- 2. Intro Text + Video --- */}
      <section className="intro wow animate__animated animate__fadeInRight">
        <div className="recommended">
          <p className="topic">Welcome to Made for Manners </p>
          <div className="line-container">
            <span className="line"></span>
            <i ><img src={waving} alt="waving " /></i>
          </div>
        </div>
        <div className='introCont'>
         
          <p>Welcome to Made for Manners, where timeless refinement meets real-world confidence. Here, etiquette isn’t about rules — it’s about freedom and expression.</p>
          <p>Our approach transforms etiquette into a tool for confidence, communication, and grace.</p>
          <p>Watch how modern manners can empower you to connect and carry yourself with ease.</p>
        </div>
        <button className="cta-btn" onClick={() => setShowVideo(!showVideo)}>▶ Watch the Video</button>
        {showVideo && <PromoVideo />}
      </section>

      {/* --- Recommended Section --- */}
      <div className='recommended wow animate__animated animate__fadeInUp'>
        <p className="topic">Recommended</p>
        <div className="line-container">
          <span className="line"></span>
          <i className="fas fa-star"></i>
        </div>
        <NavLink className='all-courses' to='/Courses'>all courses</NavLink>
        <div className='noti'>
          Please be advised that once the payment for the course has been completed, cancellations and refunds are not permitted.
        </div>
        <CoursesContaner type="recommended" />
      </div>

      {/* --- What We Offer --- */}
      <div className="recommended what-we-offer wow animate__animated animate__fadeIn">
        <p className="topic">Online Videos We Offer</p>
        <div className="line-container">
          <span className="line"></span>
          <i className="fas fa-gem"></i>
        </div>
        <div className="offer-wrapper">
          <div className="offer-image wow animate__animated animate__fadeInLeft">
            <img src={image} alt="What We Offer" />
          </div>
          <div className="offer-text wow animate__animated animate__fadeInRight">
            <ul>
              {contentPoints.map((point, index) => (
                <li key={index}>
                  <strong>{point.title}</strong><br />
                  <span>{point.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- Follow Us Section --- */}
      <div className="recommended follow-us wow animate__animated animate__fadeInUp">
        <p className="topic">Follow Us on Social Media</p>
        <div className="line-container">
          <span className="line"></span>
          <i className="fas fa-heart"></i>
        </div>
        <section className="philosophy wow animate__animated animate__fadeIn">
          <p>Grace isn’t something you’re born with — it’s something you practise. When etiquette becomes natural, confidence follows.</p>
          <p>At Made for Manners, refinement is not about appearing polished; it’s about feeling prepared and confident in every moment.</p>
        </section>
        <div className="social-icons wow animate__animated animate__fadeInUp">
          <a href="https://www.instagram.com/madeformanners/" target="_blank" rel="noopener noreferrer" aria-label="instagram" title='instagram'><i className="fab fa-instagram"></i></a>
          <a href="https://x.com/MannersFor79214" target="_blank" rel="noopener noreferrer" aria-label="x-twitter" title='twitter'><i className="fab fa-x-twitter"></i></a>
          <a href="https://www.tiktok.com/@user1742031833181" target="_blank" rel="noopener noreferrer" aria-label="tiktok" title='tiktok'><i className="fab fa-tiktok"></i></a>
          <a href="http://www.linkedin.com/in/made-for-manners" target="_blank" rel="noopener noreferrer" aria-label="linkedin" title='linkedin'><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </div>
  );
};

export default Home;
