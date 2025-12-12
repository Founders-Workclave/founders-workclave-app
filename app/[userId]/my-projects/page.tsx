import MyProjects from "@/components/myProjectComponents";
import FounderLayout from "@/layout/founder";

const MyProjectComp = () => {
  return (
    <>
      <FounderLayout pageTitle="My Projects" pageText="">
        <MyProjects />
      </FounderLayout>
    </>
  );
};

export default MyProjectComp;
