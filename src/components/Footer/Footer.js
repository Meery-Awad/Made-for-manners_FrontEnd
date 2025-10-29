import { Link, NavLink } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        We offer online etiquette lessons for all ages, guided by an experienced instructor.  
        Our affordable courses cover various styles and approaches, with free videos from Ms. Julie to help everyone practice proper etiquette.
      </p>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Etiquette Academy. All rights reserved.</p>
        <NavLink to="/policy" className="policy-link">
          Policies & Terms
        </NavLink> 
      </div>
    </footer>
  );
};

export default Footer;
