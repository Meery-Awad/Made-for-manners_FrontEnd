// file: PolicyPage.jsx
import React, { useEffect } from "react";
import './policy.scss';
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import { Helmet } from "react-helmet";

export default function PolicyPage() {
     const state = useSelector((state) => state.data);
  const {
    pageDescription, pageKeywords, websiteTitle
  } = useBetween(state.useShareState);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="policy-page">
            <Helmet>
                <link rel="canonical" href="https://madeformanners.com/policy" />
                <title>Policies | {websiteTitle}</title>
                <meta name="description" content="made for manners policies and terms " />
                <meta name="keywords" content={`${pageKeywords} policies , condations , terms  `} />
                <meta property="og:title" content={`Courses - ${websiteTitle}`} />
                <meta property="og:description" content={pageDescription} />
            </Helmet>

            <h1>Policies — Made for Manners</h1>

            <section>
                <h2>1. About the Platform</h2>
                <p>Made for Manners is an online learning platform that offers live-streamed video sessions focused on etiquette and manners. Each session is recorded and available for one week after the live broadcast.</p>
            </section>

            <section>
                <h2>2. Access to Sessions</h2>
                <p>Access to each session recording is available for seven (7) days from the date of the live broadcast. After that period, access will automatically expire. Access is personal and may not be shared or transferred.</p>
            </section>

            <section>
                <h2>3. Payment and Refund Policy</h2>
                <p>All sessions must be paid for prior to attendance. Once payment and booking are confirmed, no cancellations, refunds, or changes are allowed under any circumstances.</p>
            </section>

            <section>
                <h2>4. Recording and Content Use</h2>
                <p>All live sessions may be recorded for educational and quality purposes. Participants are not permitted to download, copy, or redistribute any part of the recorded content. All rights to the material belong to Made for Manners.</p>
            </section>

            <section>
                <h2>5. User Conduct</h2>
                <p>Participants are expected to behave respectfully and professionally during all live sessions. Any inappropriate or disruptive behavior may result in removal without refund.</p>
            </section>

            <section>
                <h2>6. Privacy</h2>
                <p>We only collect the necessary information required to process registrations and provide session access. We do not sell or share any user data with third parties.</p>
            </section>

            <section>
                <h2>7. Policy Updates</h2>
                <p>Made for Manners reserves the right to update or modify these policies at any time. Updates will be reflected on this page along with the date of the last revision.</p>
            </section>

            <section>
                <h2>8. Contact</h2>
                <p>For any questions or concerns, please contact us at <a href="mailto:hello@madeformanners.com">hello@madeformanners.com</a>.</p>
            </section>

        </div>
    );
}
