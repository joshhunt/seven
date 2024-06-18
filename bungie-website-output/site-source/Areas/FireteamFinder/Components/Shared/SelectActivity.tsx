import { NoResultsBanner } from "@Areas/FireteamFinder/Components/Shared/NoResultsBanner";
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

interface FireteamGraphExplorerNode {
  title: string;
  graphDefinition: DestinyDefinitions.DestinyFireteamFinderActivityGraphDefinition;
  applicableSets: DestinyDefinitions.DestinyFireteamFinderActivitySetDefinition[];
  children: FireteamGraphExplorerNode[];
}

interface SelectActivityProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderActivitySetDefinition"
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderOptionDefinition"
    | "DestinyActivityDefinition"
    | "DestinyFireteamFinderConstantsDefinition"
  > {
  className?: string;
  updateStep?: (step: number) => void;

  linkClick: (
    activityGraphIdHash: number,
    activityIdHash: number
  ) => IMultiSiteLink;
  activityType: SelectActivityType;
  activityFilterString: string;
  setActivityFilterString: (s: string) => void;
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
  const allFireteamSets = props.definitions?.DestinyFireteamFinderActivitySetDefinition?.all();
  const allFireteamActivityGraphDefs = props.definitions?.DestinyFireteamFinderActivityGraphDefinition?.all();
  const [allNodes, setAllNodes] = useState<
    Record<number, FireteamGraphExplorerNode>
  >({});
  const [rootNodes, setRootNodes] = useState<FireteamGraphExplorerNode[]>([]);
  const [activeActivityAccess, setActiveActivityAccess] = useState<
    FireteamFinder.DestinyFireteamFinderGetCharacterActivityAccessResponse
  >(null);
  const { activityFilterString, setActivityFilterString } = props;

  useEffect(() => {
    if (destinyMembership && !destinyMembership.selectedMembership) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    } else {
      if (destinyMembership?.selectedCharacter?.characterId) {
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
  const fetchCharacterAccess = () => {
    if (destinyMembership?.selectedCharacter?.characterId) {
      Platform.FireteamfinderService.GetCharacterActivityAccess(
        destinyMembership?.selectedMembership?.membershipType,
        destinyMembership?.selectedMembership?.membershipId,
        destinyMembership?.selectedCharacter?.characterId
      ).then((response) => {
        setActiveActivityAccess(response);
      });
    }
  };

  const leafMapToActivitySet: any = {};

  const fetchActivities = () => {
    const updatedNodes: Record<number, FireteamGraphExplorerNode> = {};

    Object.values(allFireteamSets || {}).forEach((set) => {
      set?.activityGraphHashes?.forEach((hash) => {
        if (leafMapToActivitySet?.[hash]) {
          leafMapToActivitySet?.[hash]?.push(set);
        } else {
          leafMapToActivitySet[hash] = [set];
        }
      });
    });

    Object.values(allFireteamActivityGraphDefs || {}).forEach((graphDef) => {
      updatedNodes[graphDef?.hash] = {
        title: graphDef?.displayProperties?.name,
        graphDefinition: graphDef,
        applicableSets: leafMapToActivitySet?.[graphDef?.hash] || [],
        children: [],
      };
    });

    Object.values(allFireteamActivityGraphDefs || {}).forEach((def) => {
      const pointerNode = updatedNodes?.[def.hash];

      pointerNode.children = def?.children?.map(
        (childHash) => updatedNodes?.[childHash]
      );

      updatedNodes[def.hash] = pointerNode;
    });

    let rootNodeHashes = props?.definitions?.DestinyFireteamFinderConstantsDefinition?.all()?.[
      "1"
    ]?.fireteamFinderActivityGraphRootCategoryHashes;

    if (!rootNodeHashes) {
      rootNodeHashes = Object.values(allFireteamActivityGraphDefs || {})
        ?.filter((node) => !node?.parentHash && node?.hash)
        ?.map((node) => node?.hash);
    }

    let updatedRootNodes: FireteamGraphExplorerNode[] = [];

    updatedRootNodes = rootNodeHashes?.map((hash) => {
      return updatedNodes[hash];
    });

    setAllNodes(updatedNodes);
    setRootNodes(updatedRootNodes);
  };

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
    const icon = node?.graphDefinition?.displayProperties?.hasIcon
      ? node?.graphDefinition?.displayProperties?.icon
      : defaultIcon;
    const count =
      node?.children?.filter((thisNode) => nodeIsVisible(thisNode))?.length ??
      0;
    const genericOfPlayerElected = node?.children?.some(
      (child) => child?.graphDefinition?.isPlayerElectedDifficultyNode
    );
    const isRootNode = !node?.graphDefinition?.parentHash;
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

    if (isBrowseView && (genericOfPlayerElected || isRootNode)) {
      actionItem = (
        <div className={styles.flex}>
          <Button
            size={BasicSize.Small}
            url={props.linkClick(
              node?.graphDefinition?.hash,
              firstValidRootActivity?.activityHashes?.[0]
            )}
            buttonType={"clear"}
            disabled={activeActivityAccess && !nodeIsAvailable(node)}
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
          classNameActivityItemTemplate(itemTemplate),
          { [styles.unavailable]: !nodeIsAvailable(node) }
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
  const allItems: any[] = [];
  const parentHashArr: number[] = [];
  const nodeIsVisible = (node: FireteamGraphExplorerNode) => {
    return activeActivityAccess?.fireteamFinderActivityGraphStates?.[
      node?.graphDefinition?.hash
    ]?.isVisible;
  };

  const nodeIsAvailable = (node: FireteamGraphExplorerNode) => {
    return activeActivityAccess?.fireteamFinderActivityGraphStates?.[
      node?.graphDefinition?.hash
    ]?.isAvailable;
  };
  const mapAccordionItems = (
    itemTemplate: ItemTemplateEnum,
    nodes: FireteamGraphExplorerNode[],
    rootNode?: FireteamGraphExplorerNode,
    filterName = ""
  ) => {
    const activeFilter = filterName?.trim() !== "";
    const rootNodeHashArr = rootNodes.map((node) => node.graphDefinition.hash);

    const shouldIncludeNode = (node: FireteamGraphExplorerNode) => {
      if (
        rootNodeHashArr.includes(node.graphDefinition.hash) &&
        !node.children.length
      ) {
        return false;
      }

      if (node) {
        const isSubStr = node?.title
          .toLowerCase()
          .includes(filterName?.toLowerCase());
        const isSelectableChild = parentHashArr?.includes(
          node?.graphDefinition?.hash
        );

        if (nodeIsVisible(node)) {
          if (isSubStr || isSelectableChild) {
            if (node?.graphDefinition?.selfAndAllDescendantHashes) {
              parentHashArr?.push(
                ...node?.graphDefinition?.selfAndAllDescendantHashes
              );

              return true;
            }
          }
        }

        for (const childNode of node.children) {
          if (shouldIncludeNode(childNode)) {
            return true;
          }
        }
      }

      return false;
    };
    const filteredNodes =
      nodes?.filter((node) => shouldIncludeNode(node)) ?? [];
    const accordionItems: {
      triggerElement: JSX.Element;
      collapsibleElement: JSX.Element;
      collapsibleClassName: string;
      defaultOpen: boolean;
      className: string;
      triggerClassName: any;
    }[] = filteredNodes?.map((node) => {
      const icon = node?.graphDefinition?.displayProperties?.hasIcon
        ? node?.graphDefinition?.displayProperties?.icon
        : null;
      allItems.push(node?.children);

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
        triggerClassName: classNames(styles.trigger),
        defaultOpen: activeFilter,
        collapsibleClassName: classNames({
          [styles.collapsible]: node?.children?.length > 0,
        }),
        collapsibleElement: node?.children?.length
          ? mapAccordionItems(
              ItemTemplateEnum.SECONDARY,
              node?.children,
              node,
              filterName?.toLowerCase()
            )
          : null,
      };
    });

    return (
      <>
        {allItems?.length ? (
          <Accordion
            items={accordionItems}
            className={styles.activityAccordion}
            openClassName={styles.open}
            limitOneOpen={false}
            disableAutoscroll={true}
          />
        ) : (
          <NoResultsBanner clearSearch={() => setActivityFilterString("")} />
        )}
      </>
    );
  };

  return (
    <div className={styles.selectActivityContainer}>
      {rootNodes &&
        allNodes &&
        activeActivityAccess &&
        mapAccordionItems(
          ItemTemplateEnum.PRIMARY,
          Object.values(rootNodes ?? {}),
          undefined,
          activityFilterString
        )}
    </div>
  );
};

export default withDestinyDefinitions(SelectActivity, {
  types: [
    "DestinyFireteamFinderActivitySetDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyFireteamFinderOptionDefinition",
    "DestinyActivityDefinition",
    "DestinyFireteamFinderConstantsDefinition",
  ],
});
