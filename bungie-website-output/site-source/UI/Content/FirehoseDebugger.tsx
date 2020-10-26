import React from "react";
import styles from "./FirehoseDebugger.module.scss";
import { Anchor } from "@UI/Navigation/Anchor";
import { IFirehoseDebuggerItemData } from "Platform/FirehoseDebuggerDataStore";

// Created by a-larobinson, 2020
// Copyright Bungie, Inc.

interface IFirehoseDebuggerProps {
  contentItems: IFirehoseDebuggerItemData[];
}

/**
 * FirehoseDebugger - Shows which firehose content items are on the page.
 *  *
 * @param {IFirehoseDebuggerProps} props
 * @returns
 */
export const FirehoseDebugger = (props: IFirehoseDebuggerProps) => {
  return (
    <div className={styles.container}>
      {props.contentItems.map((c) => {
        return (
          <div key={c.contentId}>
            <a href={`/Firehose/Content/EditWithNewPackage/${c}`}>
              <span>{`${c.contentId}: ${c.cmsPath} (type: ${c.cType})`}</span>
            </a>
            <br />
            {c.children.length > 0
              ? c.children.map((child) => {
                  return (
                    <div key={child.contentId}>
                      <a
                        className={styles.childContentItem}
                        href={`/Firehose/Content/EditWithNewPackage/${c.contentId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>{`${child.contentId}: ${child.cmsPath} (type: ${child.cType})`}</span>
                      </a>
                    </div>
                  );
                })
              : null}
          </div>
        );
      })}
    </div>
  );
};
