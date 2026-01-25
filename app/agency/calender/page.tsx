import AgencyLayout from "@/layout/agency";
import CalendarComponent from "@/components/agencyCalender";

const AdminClient = () => {
  return (
    <>
      <AgencyLayout pageTitle="Calender" pageText="">
        <CalendarComponent />
      </AgencyLayout>
    </>
  );
};

export default AdminClient;
