import React, { FC, useEffect, useState } from "react";
import { Button } from "plxp-web-ui/components/base";
import { QRCodeCanvas } from "qrcode.react";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Localizer } from "@bungie/localization";
import { InviteContainer } from "./Components.styled";
import styles from "./GuardianInvite.module.scss";
import { RouteDefs } from "@Routes/RouteDefs";
import { RouteHelper } from "@Routes/RouteHelper";
import { ParentalControls } from "@Platform";

interface GuardianInviteProps {
  childAccount: ParentalControls.ParentalControlsGetPlayerContextResponse["Player"];
}

const GuardianInvite: FC<GuardianInviteProps> = ({ childAccount }) => {
  /*
   * TODO:
   *  - generate link
   *  - install qrcode.react package
   *  - install web UI lib and pull from there
   * */

  /* We will need to generate link but this is just a placeholder*/
  const origin = window?.location?.href;
  //const path = RouteHelper.ParentalControlsWithId(childAccount?.PlayerId);
  const path = "/";
  const composedUrl = `${origin}`;

  /* Copy Link */
  const [invitationLink, setInvitationLink] = useState(composedUrl);
  const inviteLinkContainer = document?.getElementById("invite-link");

  const copyContent = async () => {
    try {
      inviteLinkContainer.classList.add(styles.copiedMessage);
      await navigator?.clipboard?.writeText(invitationLink);

      setTimeout(() => {
        inviteLinkContainer.classList.remove(styles.copiedMessage);
      }, 1000);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.log("Failed to copy", err);
    }
  };

  useEffect(() => {
    if (!origin) {
      setInvitationLink(`${window?.location?.href}`);
    }
  }, []);

  /*Strings*/
  const {
    ParentInviteLink,
    CopyLinkSend,
    CopyLink,
    InviteWarning,
  } = Localizer.parentalcontrols;

  // @ts-ignore
  return (
    <InviteContainer>
      <div className={styles.inviteContent}>
        <div>
          <div className={styles.qrContainer}>
            <QRCodeCanvas
              value={invitationLink}
              bgColor={"#181E24"}
              fgColor={"#F5F5F5"}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>

        <div className={styles.linkContainer}>
          <div>
            <p className={styles.heading}>{ParentInviteLink}</p>
            <p className={styles.copy}>{CopyLinkSend}</p>
          </div>

          <div className={styles.inputWrapper}>
            <div id={"invite-link"} className={styles.mockInput}>
              <p>{invitationLink}</p>
            </div>
            <Button
              themeVariant="bungie-core"
              variant="contained"
              sx={() => ({
                minWidth: "fit-content",
                whitespace: "nowrap",
              })}
              onClick={() => copyContent()}
            >
              {CopyLink}
            </Button>
          </div>
        </div>
      </div>
      <p
        className={styles.warning}
        dangerouslySetInnerHTML={sanitizeHTML(InviteWarning)}
      />
    </InviteContainer>
  );
};

export default GuardianInvite;
