import PRDPage from "@/components/prd";
import ProjectStart from "@/components/projectStart";
import FounderLayout from "@/layout/founder";

const PrdComp = () => {
  return (
    <FounderLayout pageTitle="My PRDs" pageText="">
      <ProjectStart />
      <PRDPage />
    </FounderLayout>
  );
};

export default PrdComp;
