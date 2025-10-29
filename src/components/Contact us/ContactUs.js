import { useSelector } from "react-redux";
import ContactMessagesAdmin from "./ContactMessagesAdmin";
import ContactUsUser from "./ContactUsUser";
import { useBetween } from "use-between";
import './ContactUs.scss'


const ContactUs = () => {
  const state = useSelector((state) => state.data);
  const { userDetails, admin } = useBetween(state.useShareState);

  return (

    <div className="ContactUs">

      {userDetails.email ==admin.email ? <ContactMessagesAdmin />
        : <ContactUsUser />
      }

    </div >
  );
}

export default ContactUs;
