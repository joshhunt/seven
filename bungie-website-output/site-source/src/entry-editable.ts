import { EntryModel } from ".";

export function addTags(
  entry: EntryModel,
  contentTypeUid: string,
  tagsAsObject: boolean,
  locale: string = "en-us"
): void {
  if (entry)
    entry.$ = getTag(
      entry,
      `${contentTypeUid}.${entry.uid}.${locale}`,
      tagsAsObject,
      locale
    );
}

function getTag(
  content: object,
  prefix: string,
  tagsAsObject: boolean,
  locale: string
): object {
  const tags: any = {};
  Object.entries(content).forEach(([key, value]) => {
    switch (typeof value) {
      case "object":
        if (Array.isArray(value)) {
          value.forEach((obj, index) => {
            if (
              (typeof obj !== "undefined" || obj !== null) &&
              obj._content_type_uid !== undefined &&
              obj.uid !== undefined
            ) {
              value[index].$ = getTag(
                obj,
                `${obj._content_type_uid}.${obj.uid}.${obj.locale || locale}`,
                tagsAsObject,
                locale
              );
            } else {
              if (typeof obj === "object") {
                obj.$ = getTag(
                  obj,
                  `${prefix}.${key}.${index}`,
                  tagsAsObject,
                  locale
                );
              } else {
                tags[key] = getTagsValue(`${prefix}.${key}`, tagsAsObject);
              }
            }
          });
        } else {
          if (value) {
            value.$ = getTag(value, `${prefix}.${key}`, tagsAsObject, locale);
          }
        }
        break;
      default:
        tags[key] = getTagsValue(`${prefix}.${key}`, tagsAsObject);
    }
  });
  return tags;
}

function getTagsValue(dataValue: string, tagsAsObject: boolean): any {
  if (tagsAsObject) {
    return { "data-cslp": dataValue };
  } else {
    return `data-cslp=${dataValue}`;
  }
}
