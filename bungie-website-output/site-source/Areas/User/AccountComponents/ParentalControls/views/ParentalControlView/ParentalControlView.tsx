import React, { ReactNode } from "react";
import { PnP } from "@Platform";
import { AgeCategoriesEnum } from "@Enum";
import { SpinnerContainer, SpinnerDisplayMode } from "@UIKit/Controls/Spinner";
import { usePlayerContext } from "@Areas/User/AccountComponents/ParentalControls/lib/usePlayerContext";
import { ChildView, TeenView, ParentView } from "../../views";

interface ParentalControlViewProps {}

const ParentalControlView: React.FC<ParentalControlViewProps> = (props) => {
  const { playerContext, loading } = usePlayerContext();

  const renderByAgeCategory = (
    playerContext: PnP.GetPlayerContextResponse["playerContext"]
  ): ReactNode => {
    switch (playerContext?.ageCategory) {
      case AgeCategoriesEnum.Child:
        return <ChildView />;
      case AgeCategoriesEnum.Teen:
        return <TeenView />;
      case AgeCategoriesEnum.Adult:
        return <ParentView />;
      default:
        return null;
    }
  };

  return (
    <>
      {loading ? (
        <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
      ) : (
        renderByAgeCategory(playerContext)
      )}
    </>
  );
};

export default ParentalControlView;
