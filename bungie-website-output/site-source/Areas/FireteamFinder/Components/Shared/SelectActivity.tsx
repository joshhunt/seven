import styles from "@Areas/FireteamFinder/Components/Shared/SelectActivity.module.scss";
import { FireteamFinderColors } from "@Areas/FireteamFinder/Constants/FireteamFinderColors";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { FireteamFinder, Platform } from "@Platform";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import { Accordion } from "@UIKit/Layout/Accordion";
import { BasicSize } from "@UIKit/UIKitUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";

export enum SelectActivityType {
  CREATE,
  BROWSE,
}

interface characterAccessDataReasons {
  failedLeaderRequirementLabelIndex: number;
  failedFireteamRequirementLabelIndex: number;
}

interface FireteamGraphExplorerNode {
  title: string;
  graphDefinition: DestinyDefinitions.DestinyFireteamFinderActivityGraphDefinition;
  parentGraphDefinition: DestinyDefinitions.DestinyFireteamFinderActivityGraphDefinition | null;
  allGraphDefinitions: DestinyDefinitions.DestinyFireteamFinderActivityGraphDefinition[];
  applicableSets: DestinyDefinitions.DestinyFireteamFinderActivitySetDefinition[];
  children: FireteamGraphExplorerNode[];
  error: string | null;
}

interface SelectActivityProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderActivitySetDefinition"
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderOptionDefinition"
    | "DestinyActivityDefinition"
  > {
  className?: string;
  updateStep?: (step: number) => void;

  linkClick: (
    activityGraphIdHash: number,
    activityIdHash: number
  ) => IMultiSiteLink;
  activityType: SelectActivityType;
}

enum ItemTemplateEnum {
  PRIMARY,
  SECONDARY,
}

export interface ActivityItemProps {
  itemTemplate: ItemTemplateEnum;
  node: FireteamGraphExplorerNode;
  foundActivity: boolean;
  color: string;
  defaultIcon?: string;
}

const SelectActivity: React.FC<SelectActivityProps> = (props) => {
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const [characterAccess, setCharacterAccess] = useState<
    Record<number, characterAccessDataReasons>
  >({});
  const allFireteamSets = props.definitions?.DestinyFireteamFinderActivitySetDefinition?.all();
  const allFireteamActivityGraphDefs = props.definitions?.DestinyFireteamFinderActivityGraphDefinition?.all();
  const [allNodes, setAllNodes] = useState<
    Record<number, FireteamGraphExplorerNode>
  >({});
  const [rootNodes, setRootNodes] = useState<FireteamGraphExplorerNode[]>([]);

  useEffect(() => {
    if (destinyMembership && !destinyMembership.selectedMembership) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    } else {
      if (destinyMembership?.selectedCharacter?.characterId) {
        Platform.FireteamfinderService.GetPlayerLobbies(
          destinyMembership.selectedMembership.membershipType,
          destinyMembership.selectedMembership.membershipId,
          destinyMembership?.selectedCharacter?.characterId,
          100,
          ""
        ).then((response) => {
          console.log("GetPlayerLobbies", response);
        });

        fetchCharacterAccess();
      }
    }
  }, [destinyMembership]);

  useEffect(() => {
    if (props.definitions) {
      fetchActivities();
    }
  }, [props.definitions]);

  const fireteamsLoc = Localizer.Fireteams;

  const setFailedLeaderRequirementLabelIndexByActivityHash = (access: any) => {
    access?.forEach((activityHash: number) => {
      const newCharacterAccess = { ...characterAccess };

      if (!newCharacterAccess[activityHash]) {
        newCharacterAccess[activityHash] = {
          failedLeaderRequirementLabelIndex: 0,
          failedFireteamRequirementLabelIndex: 0,
        };
      }

      newCharacterAccess[activityHash].failedLeaderRequirementLabelIndex =
        access[activityHash]?.failedLeaderRequirementLabelIndex;
      setCharacterAccess(newCharacterAccess);
    });
  };

  const setFailedFireteamRequirementLabelIndexByActivityHash = (
    access: any
  ) => {
    access?.forEach((activityHash: number) => {
      const newCharacterAccess = { ...characterAccess };
      if (!newCharacterAccess[activityHash]) {
        newCharacterAccess[activityHash] = {
          failedLeaderRequirementLabelIndex: 0,
          failedFireteamRequirementLabelIndex: 0,
        };
      }

      newCharacterAccess[activityHash].failedFireteamRequirementLabelIndex =
        access[activityHash]?.failedFireteamRequirementLabelIndex;
      setCharacterAccess(newCharacterAccess);
    });
  };

  const fetchCharacterAccess = () => {
    if (destinyMembership?.selectedCharacter?.characterId) {
      Platform.FireteamfinderService.GetCharacterActivityAccess(
        destinyMembership.selectedMembership.membershipType,
        destinyMembership.selectedMembership.membershipId,
        destinyMembership?.selectedCharacter?.characterId
      ).then((response) => {
        // this should be replaced by checking activity graph node visibility and availability states
        // setFailedLeaderRequirementLabelIndexByActivityHash(
        // 	Object.keys(response?.failedLeaderRequirementLabelIndexByActivityHash).map(a => Number(a))
        // );
        // setFailedFireteamRequirementLabelIndexByActivityHash(
        // 	Object.keys(response?.failedFireteamRequirementLabelIndexByActivityHash).map(a => Number(a))
        // )
      });
    }
  };

  const leafMapToActivitySet: any = {};

  const fetchActivities = () => {
    const updatedNodes: Record<number, FireteamGraphExplorerNode> = {};
    const updatedRootNodes: FireteamGraphExplorerNode[] = [];

    Object.values(allFireteamSets).forEach((set) => {
      set.activityGraphHashes.forEach((hash) => {
        if (leafMapToActivitySet[hash]) {
          leafMapToActivitySet[hash].push(set);
        } else {
          leafMapToActivitySet[hash] = [set];
        }
      });
    });

    Object.values(allFireteamActivityGraphDefs).forEach((graphDef) => {
      const pointer: FireteamGraphExplorerNode = {
        title: graphDef.displayProperties.name,
        graphDefinition: graphDef,
        parentGraphDefinition: null,
        allGraphDefinitions: [],
        applicableSets: leafMapToActivitySet[graphDef.hash] || [],
        children: [],
        error: null,
      };

      if (
        graphDef.parentHash &&
        Object.keys(allNodes).includes(graphDef.parentHash.toString())
      ) {
        allNodes[graphDef.parentHash]?.children?.push(pointer);
        pointer.parentGraphDefinition =
          allNodes[graphDef.parentHash]?.graphDefinition;
      }

      graphDef.children?.forEach((childHash) => {
        if (Object.keys(allNodes).includes(childHash.toString())) {
          pointer.children.push(allNodes[childHash]);
          allNodes[childHash].parentGraphDefinition = pointer.graphDefinition;
        }
      });

      updatedNodes[graphDef.hash] = pointer;
    });

    Object.values(allFireteamActivityGraphDefs).forEach((def) => {
      const pointerNode = updatedNodes[def.hash];

      let parentageNodeHash = pointerNode.graphDefinition.parentHash;
      let currentChildNodeHash = pointerNode.graphDefinition.hash;

      while (parentageNodeHash) {
        const parentageNode = updatedNodes[parentageNodeHash];
        const currentChildNode = updatedNodes[currentChildNodeHash];
        parentageNodeHash = null;
        currentChildNodeHash = null;

        if (!parentageNode.children.includes(currentChildNode)) {
          parentageNode.children.push(currentChildNode);
        }

        parentageNodeHash = parentageNode.graphDefinition.parentHash;
        currentChildNodeHash = parentageNode.graphDefinition.hash;
      }

      if (!def.parentHash) {
        updatedRootNodes.push(pointerNode);
      }
    });

    setAllNodes(updatedNodes);
    setRootNodes(updatedRootNodes);
  };

  function updateActivityAccess(
    activityAccess: FireteamFinder.DestinyFireteamFinderGetCharacterActivityAccessResponse
  ): void {
    const mapOfActivityToErrorFireteam: Record<number, string> = {};
    const mapOfActivityToErrorLead: Record<number, string> = {};

    // this should be replaced by checking activity graph node visibility and availability states

    // if (activityAccess.failedFireteamRequirementLabelIndexByActivityHash)
    // {
    // 	for (const key in activityAccess.failedFireteamRequirementLabelIndexByActivityHash)
    // 	{
    // 		const activityDef = props.definitions.DestinyActivityDefinition.get(Number(key));
    // 		const value = activityAccess.failedFireteamRequirementLabelIndexByActivityHash[key];
    //
    // 		if (activityDef && value < (activityDef.requirements?.fireteamRequirementLabels?.length ?? 0))
    // 		{
    // 			const errorLabel = activityDef.requirements?.fireteamRequirementLabels[value]?.displayString;
    //
    // 			if (errorLabel && errorLabel.trim() !== "")
    // 			{
    // 				mapOfActivityToErrorFireteam[Number(key)] = errorLabel;
    // 			}
    // 		}
    // 	}
    // }

    // if (activityAccess.failedLeaderRequirementLabelIndexByActivityHash)
    // {
    // 	for (const key in activityAccess.failedLeaderRequirementLabelIndexByActivityHash)
    // 	{
    // 		const activityDef = props.definitions.DestinyActivityDefinition.get(Number(key));
    // 		const value = activityAccess.failedLeaderRequirementLabelIndexByActivityHash[key];
    //
    // 		if (activityDef && value < (activityDef.requirements?.fireteamRequirementLabels?.length ?? 0))
    // 		{
    // 			const errorLabel = activityDef.requirements?.fireteamRequirementLabels[value]?.displayString;
    //
    // 			if (errorLabel && errorLabel.trim() !== "")
    // 			{
    // 				mapOfActivityToErrorLead[Number(key)] = errorLabel;
    // 			}
    // 		}
    // 	}
    // }

    // for (const key in allNodes) {
    //	const node = allNodes[key];
    //
    //	if (node && node.parentGraphDefinition === null) {
    //		for (const child of node.children) {
    //			checkNodesForErrorsRecursive(child, mapOfActivityToErrorFireteam, mapOfActivityToErrorLead);
    // 		}
    // 	}
    // }
  }

  const checkNodesForErrorsRecursive = (
    node: FireteamGraphExplorerNode,
    mapOfActivityToErrorFireteam: Record<number, string>,
    mapOfActivityToErrorLead: Record<number, string>
  ): void => {
    const errorStringForNode: string | null = doesNodeHaveErrors(
      node,
      mapOfActivityToErrorFireteam,
      mapOfActivityToErrorLead
    );

    if (errorStringForNode === null) {
      for (const child of node.children) {
        checkNodesForErrorsRecursive(
          child,
          mapOfActivityToErrorFireteam,
          mapOfActivityToErrorLead
        );
      }
    } else {
      setErrorRecursive(node, errorStringForNode);
    }
  };

  function setErrorRecursive(
    node: FireteamGraphExplorerNode,
    errorString: string
  ): void {
    if (node.graphDefinition.hash !== undefined) {
      allNodes[node.graphDefinition.hash].error = errorString;
    }

    for (const child of node.children) {
      setErrorRecursive(child, errorString);
    }
  }

  function doesNodeHaveErrors(
    node: FireteamGraphExplorerNode,
    mapOfActivityToErrorFireteam: Record<number, string>,
    mapOfActivityToErrorLead: Record<number, string>
  ): string | null {
    let error: string | null = null;

    for (const hash of node.graphDefinition.relatedActivityHashes ?? []) {
      if (
        mapOfActivityToErrorFireteam[hash] &&
        mapOfActivityToErrorFireteam[hash].trim() !== ""
      ) {
        error = mapOfActivityToErrorFireteam[hash];
      }
      if (
        mapOfActivityToErrorLead[hash] &&
        mapOfActivityToErrorLead[hash].trim() !== ""
      ) {
        error = mapOfActivityToErrorLead[hash];
      }
    }

    return error;
  }

  const classNameActivityItemTemplate = (itemTemplate: ItemTemplateEnum) => {
    switch (itemTemplate) {
      case ItemTemplateEnum.PRIMARY:
        return styles.primary;
      case ItemTemplateEnum.SECONDARY:
        return styles.secondary;
      default:
        return null;
    }
  };
  const classNameSectionTemplate = (itemTemplate: ItemTemplateEnum) => {
    switch (itemTemplate) {
      case ItemTemplateEnum.PRIMARY:
        return styles.primarySection;
      case ItemTemplateEnum.SECONDARY:
        return styles.secondarySection;
      default:
        return null;
    }
  };

  const ActivityItem = ({
    itemTemplate,
    node,
    foundActivity,
    defaultIcon,
    color,
  }: ActivityItemProps) => {
    const name = node?.title;
    const icon = node?.graphDefinition.displayProperties.hasIcon
      ? node?.graphDefinition.displayProperties.icon
      : defaultIcon;
    const count = node?.children?.length;
    const genericOfPlayerElected = node?.children?.some(
      (child) => child?.graphDefinition?.isPlayerElectedDifficultyNode
    );
    const isBrowseView = props?.activityType === SelectActivityType.BROWSE;
    const firstValidLeafActivity =
      node?.applicableSets
        ?.filter((set) => set?.activityHashes?.length !== 0)
        .find((subset) => subset?.maximumPartySize !== 0) ?? null;
    const firstValidRootActivity =
      node?.applicableSets
        ?.filter((set) => set?.activityHashes?.length !== 0)
        .find((subset) => subset?.maximumPartySize === 0) ?? null;

    //if browse view, we want to provide a button as well as the arrow down for the generic activity
    let actionItem;

    if (isBrowseView && genericOfPlayerElected) {
      actionItem = (
        <div className={styles.flex}>
          <Button
            size={BasicSize.Small}
            url={props.linkClick(
              node?.graphDefinition?.hash,
              firstValidRootActivity?.activityHashes[0]
            )}
            buttonType={"clear"}
          >
            {fireteamsLoc.SelectActivity}
          </Button>
          <RiArrowDownSLine className={styles.down} />
        </div>
      );
    } else {
      actionItem =
        count > 0 ? (
          <RiArrowDownSLine className={styles.down} />
        ) : (
          foundActivity && (
            <Button
              size={BasicSize.Small}
              url={props.linkClick(
                node?.graphDefinition?.hash,
                firstValidLeafActivity?.activityHashes?.[0]
              )}
              buttonType={"clear"}
            >
              {fireteamsLoc.SelectActivity}
            </Button>
          )
        );
    }

    return (
      <div
        className={classNames(
          styles.activityRow,
          classNameActivityItemTemplate(itemTemplate)
        )}
      >
        {
          <div
            className={styles.activityIcon}
            style={{
              backgroundImage: `url("${icon}")`,
              backgroundColor: color,
            }}
          />
        }
        <div>
          <h3>{name}</h3>
          {count > 0 && <h4>{`${count} ${fireteamsLoc.Activities}`}</h4>}
        </div>
        {actionItem}
      </div>
    );
  };

  const mapAccordionItems = (
    itemTemplate: ItemTemplateEnum,
    nodes: FireteamGraphExplorerNode[],
    rootNode?: FireteamGraphExplorerNode
  ) => {
    const accordionItems = Object.values(nodes)?.map((node) => {
      const icon = node.graphDefinition.displayProperties.hasIcon
        ? node.graphDefinition.displayProperties.icon
        : null;
      const sortedChildren = node?.children.sort((a, b) => {
        if (
          a.graphDefinition.isPlayerElectedDifficultyNode &&
          b.graphDefinition.isPlayerElectedDifficultyNode
        ) {
          const nameA = a.title;
          const nameB = b.title;

          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }

          return 0;
        }
      });

      return {
        className: classNames(
          styles.section,
          classNameSectionTemplate(itemTemplate)
        ),
        triggerElement: (
          <ActivityItem
            itemTemplate={itemTemplate}
            node={node}
            foundActivity={node?.applicableSets?.length > 0}
            defaultIcon={icon}
            color={
              FireteamFinderColors.hexCode[rootNode?.graphDefinition?.hash ?? 0]
            }
          />
        ),
        triggerClassName: styles.trigger,
        collapsibleClassName: classNames({
          [styles.collapsible]: node?.children?.length > 0,
        }),
        collapsibleElement: node.children.length
          ? mapAccordionItems(ItemTemplateEnum.SECONDARY, sortedChildren, node)
          : null,
      };
    });

    return (
      <Accordion
        items={accordionItems}
        className={styles.activityAccordion}
        openClassName={styles.open}
        limitOneOpen={false}
        disableAutoscroll={true}
      />
    );
  };

  return (
    <div className={styles.selectActivityContainer}>
      {rootNodes &&
        allNodes &&
        mapAccordionItems(ItemTemplateEnum.PRIMARY, Object.values(rootNodes))}
    </div>
  );
};

export default withDestinyDefinitions(SelectActivity, {
  types: [
    "DestinyFireteamFinderActivitySetDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyFireteamFinderOptionDefinition",
    "DestinyActivityDefinition",
  ],
});
