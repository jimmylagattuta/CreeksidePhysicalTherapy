import React from 'react';
import './helpers/AppointmentInfo.css';

const AppointmentInfo = () => {
  return (
    <div className="appointment-info">
      <article id="appointment-form-article">
        <div className="appointment-form">
     
          <section className="for-your-appointment">
            <h2>For Your Appointment</h2>
            <p>Please call the office to make an appointment in advance. If you are unable to keep your appointment, please call us as far in advance as possible so we may use that time to see another patient in need of care. We make a sincere effort to adhere to our appointment schedule and appreciate your patience if we are late due to emergencies or hospital surgery.</p>
          </section>

          <section className="new-patients">
            <h3>NEW PATIENTS</h3>
            <p>Electronic Pre-Registration is available on our Patient Portal. The utilization of this feature will expedite your check-in process at the time of your appointment. To receive access to the Patient Portal, please call the office, and a member of our staff will assist you.</p>
            <p>If you have already completed electronic pre-registration on the Patient Portal, please arrive to your appointment five minutes early to complete the check-in process. Please bring the items listed in the side column to your appointment.</p>
            <p>If you have not completed electronic pre-registration on the Patient Portal, please arrive to your appointment thirty minutes early to complete the check-in process. Medical forms are available for download for your convenience. Please print, complete, and bring all forms to your appointment, along with the items listed.</p>
          </section>

          <section className="follow-up-patients">
            <h3>FOLLOW UP PATIENTS</h3>
            <p>We ask that you please arrive five minutes early to your scheduled appointment time to complete the check-in process. We will always do our best to accommodate our patients; however, we cannot guarantee appointments outside of your scheduled appointment time. Please bring the items listed below to every appointment.</p>
          </section>

          <section className="follow-up-patients">
            <h3>Foot And Ankle Physical Therapy FAQs</h3>
            <h3>How many therapy visits will I need to get better?</h3>
            <p>The number of therapy sessions is usually dependent on the diagnosis (what is physically wrong), the doctors' recommendations, your personal healing ability, and your schedule. Patients who are able to contribute to the therapeutic process often find themselves improving faster than planned!</p>
            <h3>What can I expect at a typical therapy session?</h3>
            <p>While this is highly dependent on the goals of the patient and doctor, most therapy sessions include a combination of manual work, physical modalities, and specifically directed exercise(s).</p>
            <h3>How do you communicate with my doctor?</h3>
            <p>While progress notes are regularly faxed to referring providers, Creekside therapists often enjoy direct communication with surgeons, GPs, and other health professionals.</p>
            <h3>What should I wear to a therapy session?</h3>
            <p>Patients should wear comfortable, loose clothing that allows the therapist access to injuries or areas of concern. Shorts and tank tops are appropriate wear for knee/shoulder rehab, biomechanical assessments and bike evaluations.</p>
            <h3>What insurances do you accept?</h3>
            <p>We accept most major insurance plans and offer cash and multiple payment options (see insurance section for complete list).</p>
            <h3>How do you protect my medical information? Your Rights & Our Responsibilities.</h3>
            <p>Please click here to read a full description of how we protect your medical information and utilize it to help you in your recovery.</p>
          </section>
        </div>
      </article>
    </div>
  );
};

export default AppointmentInfo;
