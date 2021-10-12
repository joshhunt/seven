import { DataStore } from "@bungie/datastore";
import { Content } from "@Platform";

export interface IFirehoseDebuggerItemData
  extends Pick<
    Content.ContentItemPublicContract,
    "cmsPath" | "contentId" | "cType"
  > {
  children: IFirehoseDebuggerItemData[];
}

export interface IFirehoseDebuggerState {
  contentItems: IFirehoseDebuggerItemData[];
}

class FirehoseDebuggerDataStoreInternal extends DataStore<
  IFirehoseDebuggerState
> {
  public static Instance = new FirehoseDebuggerDataStoreInternal({
    contentItems: [],
  });

  public actions = this.createActions({
    /**
     * Clear the content items in the debugger
     */
    clear: () => ({ contentItems: [] }),
    /**
     * Add a Firehose item
     * @param contract
     */
    add: (state, contract: Content.ContentItemPublicContract) => {
      let children: IFirehoseDebuggerItemData[] = [];
      /* There can be multiple values inside the contract.properties that are lists, 
			so we look for lists where the items in the list have their own contentId 
			then add each of those items to the children array */
      Object.values(contract.properties).forEach(
        (v) =>
          Array.isArray(v) && v.forEach((c) => c.contentId && children.push(c))
      );

      const newContentItem: IFirehoseDebuggerItemData = {
        cmsPath: contract.cmsPath,
        contentId: contract.contentId,
        cType: contract.cType,
        children: children,
      };

      const contentItems = [newContentItem, ...this.state.contentItems];

      return {
        contentItems,
      };
    },
  });
}

export const FirehoseDebuggerDataStore =
  FirehoseDebuggerDataStoreInternal.Instance;
