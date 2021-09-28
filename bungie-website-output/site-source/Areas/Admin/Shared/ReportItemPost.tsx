// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ReportGroupContext } from "@Areas/Admin/Shared/ReportGroupContext";
import { ReportReason } from "@Areas/Admin/Shared/ReportReason";
import { ForumFlagsEnum } from "@Enum";
import { Contract, Contracts } from "@Platform";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { Anchor } from "@UI/Navigation/Anchor";
import { BBCodeUtils } from "@Utilities/BBCodeUtils";
import React from "react";
import styles from "./ReportItem.module.scss";

interface ReportItemPostProps {
  report: Contracts.ReportedItemResponse;
}

export const ReportItemPost: React.FC<ReportItemPostProps> = (props) => {
  const reportedPost = `Reported Post`;
  const reportedOn = `Reported On:`;
  const postCreatedOn = `Post Created On:`;
  const postLastModifiedOn = `Post Last Modified On:`;
  const notice = `NOTICE:`;
  const communityPost = `This is an approved community content post, moderation generally only valid if source url now contains CoC violating content.`;
  const topicBanned = `This post has already been manually moderated. You should probably mark this as Resolve No Action.`;
  const subject = `Subject:`;
  const body = `Body:`;
  const locale = `Locale:`;
  const asset = `Asset:`;
  const postContext = `Click for Post Context`;
  const topicContext = `Click for Topic Context`;
  const singlePostView = `Click for Single Post View`;

  const report = props.report;
  const post: Contract.Post = report.entity;

  return (
    <React.Fragment>
      <h3>{reportedPost}</h3>
      <ReportReason report={props.report} />
      <div>
        <strong>{reportedOn}</strong> <span>{report.dateCreated}</span>
        <br />
        <strong>{postCreatedOn}</strong> <span>{post.creationDate}</span>
      </div>
      {post.lastModified && (
        <div>
          <strong>{postLastModifiedOn}</strong>{" "}
          <span data-reportTime={post.lastModified}>{post.lastModified}</span>
        </div>
      )}
      {(post.flags & ForumFlagsEnum.CommunityContent) ===
        ForumFlagsEnum.CommunityContent && (
        <div>
          <strong>
            <span className={styles.red}>{notice}</span> {communityPost}
          </strong>
        </div>
      )}
      {post.isTopicBanned && (
        <div>
          <strong>
            <span className={styles.red}>{notice}</span> {topicBanned}
          </strong>
        </div>
      )}
      <div>
        {post.topicId?.length > 0 && (
          <React.Fragment>
            <strong>{subject}</strong>
            <div>{post.subject}</div>
            <br />
          </React.Fragment>
        )}
        <strong>{body}</strong>
        <div data-postId={post.postId}>
          <SafelySetInnerHTML
            html={BBCodeUtils.parseBBCode(post.body, true, false)}
          />
        </div>
        <br />
        <div>
          <strong>{locale}</strong>
          <div>{post.locale}</div>
        </div>
        <br />
        {post.urlLinkOrImage !== "" && (
          <div>
            <strong>
              {asset}{" "}
              <Anchor url={post.urlLinkOrImage} target="_blank">
                {post.urlLinkOrImage}
              </Anchor>
            </strong>
          </div>
        )}
      </div>
      <div className={styles.contextButtons}>
        <Anchor
          target="_blank"
          url={`/en/Forums/Post/${report.reportedItem}?showBanned=1&path=1`}
        >
          {postContext}
        </Anchor>
        {post.topicId?.length && (
          <Anchor
            target="_blank"
            url={`/en/Forums/Post/${post.topicId}?showBanned=1`}
          >
            {topicContext}
          </Anchor>
        )}
        <Anchor
          target="_blank"
          url={`/en/Forums/MyPost/1/${report.reportedItem}`}
        >
          {singlePostView}
        </Anchor>
        <ReportGroupContext report={report} />
      </div>
    </React.Fragment>
  );
};
