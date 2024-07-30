// Created by atseng, 2020
import { ConvertToPlatformError } from "@ApiIntermediary";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import {
  ForumFlagsEnum,
  IgnoredItemType,
  IgnoreLength,
  ReportResolutionStatus,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Contract, Contracts, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React, { useState } from "react";
import styles from "./ReportItem.module.scss";

interface ReportItemJudgementProps {
  report: Contracts.ReportedItemResponse;
  judgementMade(): void;
  updateReportCount(): void;
}

export const ReportItemJudgement: React.FC<ReportItemJudgementProps> = (
  props
) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [banHistory, setBanHistory] = useState(null);

  const getLocalizedReportResult = (reportResult: ReportResolutionStatus) => {
    switch (reportResult) {
      case ReportResolutionStatus.Unresolved:
        return Localizer.Helptext.reportresolutionstatusunresolved;

      case ReportResolutionStatus.Innocent:
        return Localizer.Helptext.reportresolutionstatusinnocent;

      case ReportResolutionStatus.GuiltyBan:
        return Localizer.Helptext.reportresolutionstatusguiltyban;

      case ReportResolutionStatus.GuiltyBlastBan:
        return Localizer.Helptext.reportresolutionstatusguiltyblastban;

      case ReportResolutionStatus.GuiltyWarn:
        return Localizer.Helptext.reportresolutionstatusguiltywarn;

      case ReportResolutionStatus.GuiltyAlias:
        return Localizer.Helptext.reportresolutionstatusguiltyalias;

      case ReportResolutionStatus.ResolveNoAction:
        return Localizer.Helptext.reportresolutionstatusresolvenoaction;

      default:
        return Localizer.Helptext.reportresolutionstatusunknown;
    }
  };

  const getLocalizedReportItemType = (itemType: IgnoredItemType) => {
    switch (itemType) {
      case IgnoredItemType.Post:
        return Localizer.Helptext.ignoreditemtypepost;

      case IgnoredItemType.Group:
        return Localizer.Helptext.ignoreditemtypegroup;

      case IgnoredItemType.User:
        return Localizer.Helptext.ignoreditemtypeuser;

      case IgnoredItemType.Tag:
        return Localizer.Helptext.ignoreditemtypetag;

      case IgnoredItemType.GroupProfile:
        return Localizer.Helptext.ignoreditemtypegroupprofile;

      case IgnoredItemType.UserProfile:
        return Localizer.Helptext.ignoreditemtypeuserprofile;

      case IgnoredItemType.UserPrivateMessage:
        return Localizer.Helptext.ignoreditemtypeuserprivatemessage;

      case IgnoredItemType.GroupWallPost:
        return Localizer.Helptext.ignoreditemtypegroupwallpost;

      case IgnoredItemType.PrivateMessage:
        return Localizer.Helptext.ignoreditemtypeprivatemessage;

      case IgnoredItemType.Fireteam:
        return Localizer.Helptext.ignoreditemtypefireteam;

      default:
        return Localizer.HelpText.ignoreditemtypeunknown;
    }
  };

  const getBanHistory = (membershipId: string) => {
    setBanHistory(Localizer.Helptext.adminloadingdisciplinehistory);

    Platform.AdminService.GetRecentDisciplineAndFlagHistoryForMember(
      membershipId,
      7
    )
      .then((response) => {
        let dHistory = "";

        for (const reportItem of response.results) {
          const rDate = new Date(reportItem.dateResolved);

          dHistory += `<strong>${rDate.toLocaleDateString()} ${rDate.toLocaleTimeString()}</strong>: ${getLocalizedReportResult(
            reportItem.result
          )} on a ${getLocalizedReportItemType(
            reportItem.reportedItemType
          )} for ${Localizer.Mute[reportItem.reason]}`;

          if (
            reportItem.banDurationInDays > 0 &&
            reportItem.banDurationInDays < 1000000
          ) {
            dHistory += ` (${reportItem.banDurationInDays} day ban).<br />`;
          } else {
            dHistory += `.<br />`;
          }
        }

        if (dHistory === "") {
          dHistory = Localizer.Helptext.adminnodisciplinehistoryfound;
        }

        setBanHistory(dHistory);
      })
      .catch(ConvertToPlatformError)
      .catch((error) => {
        setBanHistory(
          `${Localizer.Helptext.adminerrordisciplinehistory} ${error.errorMessage}`
        );
      });
  };

  const report = props.report;

  let isCommunityContent = false;
  let membershipIdResponsible: string = null;

  switch (report.reportedItemType) {
    case IgnoredItemType.Post:
      const post: Contract.Post = report.entity;
      isCommunityContent =
        (post.flags & ForumFlagsEnum.CommunityContent) ===
        ForumFlagsEnum.CommunityContent;
      membershipIdResponsible = post.authorMembershipId;

      break;

    case IgnoredItemType.UserPrivateMessage:
    case IgnoredItemType.UserProfile:
      membershipIdResponsible = report.reportedItem;
      break;
  }

  console.log(report.entity.flags);

  if (banHistory === null) {
    getBanHistory(membershipIdResponsible);
  }

  const relevantReportHistory = `Relevant Report History`;
  const passJudgement = `Pass Judgment`;
  const moderatorJudgement = `Moderator Judgement:`;
  const selectBanDuration = `Select Ban Duration (When Relevant):`;

  const sevenDayBan = `7 Day Ban`;
  const thirtyDayBan = `30 Day Ban`;
  const permBan = `Permanent Ban`;
  const notifyBungieEmployee = `Notify Bungie Employee for Escalation`;
  const optionalComments = `Optional Comments (never visible to users):`;

  const commentsAreaRef = React.createRef<HTMLTextAreaElement>();
  const modJudgement = React.createRef<HTMLSelectElement>();
  const modPunishment = React.createRef<HTMLSelectElement>();

  const reportInstructions = (ignoreType: IgnoredItemType) => {
    const instructions1 = `Instructions: Moderators are to determine Guilt or Innocence of this tag violating the`;
    const codeOfConduct = `Code of Conduct`;

    const instructionsCommon = (
      <>
        {instructions1}{" "}
        <Anchor
          url={RouteHelper.LegalPage({ pageName: "codeofconduct" })}
          target={"_blank"}
        >
          {codeOfConduct}
        </Anchor>
      </>
    );
    let instructionsSpecial = "";

    switch (ignoreType) {
      case IgnoredItemType.Tag:
        instructionsSpecial = `. Please only consider the tag itself, not what posts it may be attached to or who created it or is using it. See sidebar for additional information.`;
        break;

      case IgnoredItemType.GroupProfile:
        instructionsSpecial = `. Please limit consideration to group name and profile text. If the the group is a clan, finding them guilty will also ban them from Guided Games in game.`;
        break;

      case IgnoredItemType.UserProfile:
        instructionsSpecial = `. Please limit consideration to user display name, unique name, status text, and motto, as a guilty judgement will only affect those fields of the user's profile.`;
        break;

      case IgnoredItemType.UserPrivateMessage:
        instructionsSpecial = `via private messages. If found guilty, users will lose private message, invitation, and group wall permissions for the duration of their ban.`;
        break;

      case IgnoredItemType.PrivateMessage:
        instructionsSpecial = `via private messages. If found guilty, users will lose private message and invitation permissions for the duration of their ban.`;
        break;

      case IgnoredItemType.GroupWallPost:
        instructionsSpecial = `via group wall posts. If found guilty, users will lose group wall permissions for the duration of their ban.`;
        break;

      case IgnoredItemType.Fireteam:
        instructionsSpecial = `via fireteam descriptions. If found guilty, users will lose fireteam permissions for the duration of their ban.`;
        break;

      default:
        instructionsSpecial = `. Please alter the Reason for Report if necessary. See sidebar for additional instructions.`;
    }

    return (
      <div className={styles.reportInstructions}>
        {instructionsCommon}
        {instructionsSpecial}
      </div>
    );
  };

  const reportButtons = (reportItem: Contracts.ReportedItemResponse) => {
    const ignoreType = report.reportedItemType;
    const guiltyWarn = `Guilty: Clear but do not lock group profile fields and reset to system defaults and Issue Warning`;

    let buttons = null;

    switch (ignoreType) {
      case IgnoredItemType.Post:
        const guiltyPostBan = `Guilty: Remove Content Permanently and Issue Ban`;
        const guiltyBlastBan = `Guilty: Remove Content Permanently and Issue 1 hour Blast Radius Ban For Spam`;

        buttons = (
          <>
            <button
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyBan)
              }
              className={styles.Ban}
            >
              {guiltyPostBan}
            </button>
            <br />
            {!isCommunityContent && (
              <>
                <button
                  onClick={() =>
                    sendReport(
                      report.reportId,
                      ReportResolutionStatus.GuiltyBlastBan
                    )
                  }
                  className={styles.BlastBan}
                >
                  {guiltyBlastBan}
                </button>
                <br />
              </>
            )}
            <button
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyWarn)
              }
              className={styles.Warn}
            >
              {guiltyWarn}
            </button>
            <br />
          </>
        );

        break;

      case IgnoredItemType.GroupProfile:
        const guiltyGroupProfileBan = `Guilty: Lock group profile fields and reset to system defaults`;

        buttons = (
          <>
            <button
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyBan)
              }
              className={styles.Ban}
            >
              {guiltyGroupProfileBan}
            </button>
            <br />
            <button
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyWarn)
              }
              className={styles.Warn}
            >
              {guiltyWarn}
            </button>
            <br />
          </>
        );

        break;

      case IgnoredItemType.UserProfile:
        const userProfileBan = `Guilty: Temporarily lock user profile fields and reset to system defaults.`;

        buttons = (
          <>
            <button
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyBan)
              }
              className={styles.Ban}
              data-report="reportId"
            >
              {userProfileBan}
            </button>
            <br />
          </>
        );

        break;

      case IgnoredItemType.UserPrivateMessage:
        const userPrivateMessage = `Guilty: Temporarily block the user from sending private messages, group wall posts, and invitations.`;

        buttons = (
          <>
            <button
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyBan)
              }
              className={styles.Ban}
            >
              {userPrivateMessage}
            </button>
            <br />
          </>
        );

        break;

      case IgnoredItemType.PrivateMessage:
        const privateMessage = `Guilty: Temporarily block the user from sending private messages and invitations.`;

        buttons = (
          <>
            <button
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyBan)
              }
              className={styles.Ban}
            >
              {privateMessage}
            </button>
            <br />
          </>
        );

        break;

      case IgnoredItemType.GroupWallPost:
        const groupWallPost = `Guilty: Temporarily block the user from making group wall posts.`;

        buttons = (
          <>
            <button
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyBan)
              }
              className={styles.Ban}
            >
              {groupWallPost}
            </button>
            <br />
          </>
        );

        break;

      case IgnoredItemType.Tag:
        const tagGuilty = `Guilty: Alias all past and future uses of tag`;

        buttons = (
          <>
            <button
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyBan)
              }
              className={styles.Alias}
            >
              {tagGuilty}
            </button>
            <br />
          </>
        );

        break;

      case IgnoredItemType.Fireteam:
        const fireteamGuiltyBan = `Guilty: Remove Content Permanently and Issue Fireteam Ban`;
        const fireteamBlastBan = `Guilty: Remove Content Permanently and Issue 1 hour Blast Radius Fireteam Ban For Spam`;
        const fireteamWarn = `Guilty: Remove Content Permanently and Issue Warning`;

        buttons = (
          <>
            <button
              className={styles.Ban}
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyBan)
              }
            >
              {fireteamGuiltyBan}
            </button>
            <br />
            <button
              className={styles.BlastBan}
              onClick={() =>
                sendReport(
                  report.reportId,
                  ReportResolutionStatus.GuiltyBlastBan
                )
              }
            >
              {fireteamBlastBan}
            </button>
            <br />
            <button
              className={styles.Warn}
              onClick={() =>
                sendReport(report.reportId, ReportResolutionStatus.GuiltyWarn)
              }
            >
              {fireteamWarn}
            </button>
            <br />
          </>
        );

        break;
    }

    const reject = `Innocent: Reject Report`;
    const noAction = `Resolve No Action: Reject Report but do not punish those who reported`;

    return (
      <>
        {buttons}
        <button
          onClick={() =>
            sendReport(report.reportId, ReportResolutionStatus.Innocent)
          }
          className={styles.Innocent}
        >
          {reject}
        </button>
        <br />
        {!isCommunityContent && (
          <>
            <button
              onClick={() =>
                sendReport(
                  report.reportId,
                  ReportResolutionStatus.ResolveNoAction
                )
              }
              className={styles.ResolveNoAction}
            >
              {noAction}
            </button>
            <br />
          </>
        )}
      </>
    );
  };

  const sendReport = (reportId: string, actionType: ReportResolutionStatus) => {
    const ninjaJusticeApplied = `Ninja Justice Has Been Applied.`;

    const resolveInput: Contracts.ReportResolution = {
      reportId: reportId,
      comments: commentsAreaRef.current.value,
      reason: modJudgement.current.value,
      result: actionType,
      banLength:
        IgnoreLength[modPunishment.current.value as keyof typeof IgnoreLength],
    };

    Platform.AdminService.ResolveReport(resolveInput)
      .then((responseObject) => {
        //decrement the report count
        props.updateReportCount();

        Modal.open(ninjaJusticeApplied);
      })
      .catch(ConvertToPlatformError)
      .catch((error) => {
        Modal.error(error);
      });
  };

  const sendEmail = (reportId: string) => {
    const success = `'Employees have been notified'`;

    Platform.AdminService.SendReportEmail(reportId)
      .then(() => {
        Modal.open(success);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  return (
    <React.Fragment>
      {membershipIdResponsible !== null && (
        <>
          <br />
          <h4>{relevantReportHistory}</h4>
          <div className={styles.adminBanHistory} />
        </>
      )}
      <br />
      <div>
        <h4>{passJudgement}</h4>
        {reportInstructions(report.reportedItemType)}
        <div>
          {moderatorJudgement}
          <select className={styles.modJudgement} ref={modJudgement}>
            {globalState.coreSettings.ignoreReasons.map((item, index) => {
              return (
                <option
                  value={item.identifier}
                  key={index}
                  role={"option"}
                  aria-selected={report.reason === item.identifier}
                  selected={report.reason === item.identifier}
                >
                  {item.displayName}
                </option>
              );
            })}
          </select>
        </div>
        {report.reportedItemType !== IgnoredItemType.Tag ? (
          <div>
            {selectBanDuration}
            <select className={styles.modPunishment} ref={modPunishment}>
              <option
                value={IgnoreLength.Week}
                selected={true}
                role={"option"}
                aria-selected={true}
              >
                {sevenDayBan}
              </option>
              <option
                value={IgnoreLength.ThirtyDays}
                role={"option"}
                aria-selected={false}
              >
                {thirtyDayBan}
              </option>
              <option
                value={IgnoreLength.Forever}
                role={"option"}
                aria-selected={false}
              >
                {permBan}
              </option>
            </select>
          </div>
        ) : (
          <input type="hidden" className="modPunishment" value="0" />
        )}
        <p>
          <button
            className={styles.employee}
            onClick={() => sendEmail(report.reportId)}
          >
            {notifyBungieEmployee}
          </button>
          <br />
          <br />
        </p>
        <div>{optionalComments}</div>
        <div>
          <textarea
            ref={commentsAreaRef}
            className={styles.optionalComments}
            defaultValue={""}
            placeholder={""}
          />
        </div>
        <br />
        {reportButtons(report)}
      </div>
    </React.Fragment>
  );
};
