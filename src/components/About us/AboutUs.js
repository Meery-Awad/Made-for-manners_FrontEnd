import React, { useEffect } from "react";
import './AboutUs.scss';
import teacherImg from "../../images/1.jpg";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";

const AboutUs = () => {
    const state = useSelector((state) => state.data);
    const { pageDescription, pageKeywords, aboutUsKeyWords, websiteTitle } = useBetween(state.useShareState);

    useEffect(() => {
        window.scrollTo(0, 0);
        const aboutSection = document.querySelector(".about-us");
        if (!aboutSection) return;

        const elements = aboutSection.querySelectorAll("[data-animate]");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(entry.target.dataset.animate);
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);
    const aboutSections = [
        {
            title: "Who We Are",
            text: "Made for Manners is an international etiquette and lifestyle academy that blends tradition with modern relevance. We teach confidence, communication, and composure as practical life skills — accessible to all, applicable everywhere."
        },
        {
            title: "",
            text: "We believe manners aren’t about status or appearance. They’re about awareness, kindness, and the confidence to be yourself while making others feel at ease."
        },
        {
            title: "Our Vision",
            text: "To make etiquette modern, meaningful, and universal — a pathway to genuine confidence and connection."
        },
        {
            title: "Our Values",
            text: "Grace — Composure and consideration in every action.\nAuthenticity — True elegance begins with being yourself.\nRespect — Courtesy and empathy build lasting connections.\nConfidence — Preparation creates freedom.\nLegacy — Every act of grace leaves an impression."
        },
        {
            title: "Our Promise",
            text: "We make etiquette feel natural, practical, and alive. Our teaching is approachable, intelligent, and warm — focused on confidence that lasts long after the lesson ends."
        }
    ];

    return (
        <div className="about-us">
            <Helmet>
                <link rel="canonical" href="https://madeformanners.com/about" />
                <title>About us | {websiteTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={`${pageKeywords} ${aboutUsKeyWords}`} />
                <meta property="og:title" content={`About Us - ${websiteTitle}`} />
                <meta property="og:description" content={pageDescription} />
            </Helmet>

            <div className="container">
                <h1>About Us</h1>

                <div className="content">
                    <div className="text" data-animate="slide-right">
                        {aboutSections.map((section, index) => (
                            <div key={index} className="about-section">
                                {section.title && <h3>{section.title}</h3>}
                                <p>{section.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

               
                <div className="content founder-message">
                    <div className="image" data-animate="slide-left">
                        <img src={teacherImg} alt="Julia - Founder" />
                    </div>
                    <div className="text" data-animate="slide-right">
                        <h3>Founder’s Message</h3>
                        <p>Welcome to Made for Manners.
                            This company was founded on a simple belief: true confidence and courtesy should empower, not intimidate.
                            Today, good manners are less about formality and more about awareness — of how we make others feel, and how we present ourselves to the world.
                            Our role is to help you refine that awareness, so you feel comfortable, composed, and confident in any environment.
                            Refinement is not about changing who you are — it’s about enhancing the way you move, speak, and connect. Because when you feel at ease, everything else follows naturally.<br />
                            With warmth,<br />
                            Julia <br />
                            Founder, Made for Manners.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;
