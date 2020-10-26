import { IContentfulEntryProps } from "../ContentfulUtils";
import { IButtonItemFields } from "../Contracts/BasicContracts";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import React from "react";

export const ButtonEntry: React.FC<IContentfulEntryProps<
  IButtonItemFields
>> = ({ entry }) => {
  const { buttonText, buttonUrl, color } = entry.fields;

  return (
    <Button url={buttonUrl} buttonType={color}>
      {buttonText}
    </Button>
  );
};

export default ButtonEntry;
