import ComingSoon from "@/components/comingSoon";
// import AllPRDsPage from "@/components/agencyPRD";
// import ProjectStart from "@/components/projectStart";
import FounderLayout from "@/layout/founder";

const PrdComp = () => {
  return (
    <FounderLayout pageTitle="My AI PRDs (Bridge AI)" pageText="">
      {/* <ProjectStart />
      <AllPRDsPage /> */}
      <ComingSoon />
    </FounderLayout>
  );
};

export default PrdComp;
