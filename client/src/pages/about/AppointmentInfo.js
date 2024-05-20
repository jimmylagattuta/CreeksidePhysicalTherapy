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
        </div>
      </article>
    </div>
  );
};

export default AppointmentInfo;
