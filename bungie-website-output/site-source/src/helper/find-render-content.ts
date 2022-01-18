import { EntryEmbedable } from "../Models/embedded-object";
export function findRenderContent<Type>(
  keyPaths: string,
  entry: EntryEmbedable,
  render: (content: Type) => string | string[]
) {
  getContent(keyPaths.split("."), entry, render);
}

export function getContent<Type>(
  keys: string[],
  object: any,
  render: (content: Type) => string | string[]
) {
  if (keys) {
    const key = keys[0];
    if (keys.length === 1 && object[key]) {
      object[key] = render(object[key]);
    } else if (keys.length > 0) {
      if (object[key]) {
        const newKeys = keys.slice(1);
        if (Array.isArray(object[key])) {
          // tslint:disable-next-line: prefer-for-of
          for (const objKey of object[key]) {
            getContent(newKeys, objKey, render);
          }
        } else if (typeof object[key] === "object") {
          getContent(newKeys, object[key], render);
        }
      }
    }
  }
}
