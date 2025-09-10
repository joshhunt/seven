import React, { useState } from "react";
import styles from "./PassToggle.module.scss";
import { RouteHelper } from "@Routes/RouteHelper";
import { Select } from "plxp-web-ui/components/base";
import { SelectChangeEvent } from "@mui/material";
import { UrlUtils } from "@Utilities/UrlUtils";
import { useHistory } from "react-router-dom";

interface IPassToggleProps {
  isCurrent?: boolean;
}

/**
 * PassSelect - Dropdown to move between current and previous pass views
 *  *
 * @param {IPassSelectProps} props
 * @returns {React.ReactElement}
 */
const PassToggle: React.FC<IPassToggleProps> = ({ isCurrent }) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    isCurrent ? "current" : "previous"
  );

  const history = useHistory();

  const handleChange = (e: SelectChangeEvent<{ value: string }>) => {
    const value = e?.target?.value as string;
    setSelectedOption(value);

    if (value === "previous") {
      history.push(
        UrlUtils.resolveUrlFromMultiLink(RouteHelper.PreviousPass())
      );
    } else {
      history.push(UrlUtils.resolveUrlFromMultiLink(RouteHelper.CurrentPass()));
    }
  };

  const options = [
    { value: "previous", label: "Previous Pass" },
    { value: "current", label: "Current Pass" },
  ];

  return (
    <div className={styles.passTabsContainer || "passTabsContainer"}>
      <Select
        menuOptions={options}
        selectProps={{
          value: selectedOption,
          onChange: handleChange,
          displayEmpty: true,
        }}
        labelArea={{ labelString: "Pass", screenReaderOnly: true }}
      />
    </div>
  );
};

export default PassToggle;
