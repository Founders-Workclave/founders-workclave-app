import AgencyLayout from "@/layout/agency";
// import CalendarComponent from "@/components/agencyCalender";
import ComingSoon from "@/components/comingSoon";

const AdminClient = () => {
  return (
    <>
      <AgencyLayout pageTitle="Calender" pageText="">
        <ComingSoon />
        {/* <CalendarComponent /> */}
      </AgencyLayout>
    </>
  );
};

export default AdminClient;
