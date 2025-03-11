import React, { FC, ReactNode } from "react";
import HelpIcon from "@mui/icons-material/Help";
import { FaQuestion } from "@react-icons/all-files/fa/FaQuestion";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Localizer } from "@bungie/localization";
import styles from "./AuthRightRailWrapper.module.scss";

interface RightRailProps {
  /* the views in auth */
  children: ReactNode;
  /* optional offset image */
  offsetImage?: ReactNode;
}

const AuthRightRailWrapper: FC<RightRailProps> = ({
  children,
  offsetImage,
}) => {
  const WebAuthLoc = Localizer.Webauth;
  const BungieHelpLabel = WebAuthLoc.BungieHelp;

  return children ? (
    <div className={styles.container}>
      {offsetImage && <div className={styles.offsetImage}>{offsetImage}</div>}
      <div className={styles.childSpacing}>{children}</div>
      <Anchor
        aria-labelledby={"help-label"}
        url={RouteHelper.Help()}
        className={styles.fixedButtonContainer}
      >
        <FaQuestion />
      </Anchor>
    </div>
  ) : null;
};

export default AuthRightRailWrapper;
