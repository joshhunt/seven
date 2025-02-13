/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
export default function isPlainObject(obj: unknown) {
  if (typeof obj !== "object" || obj === null) return false;

  const proto = Object.getPrototypeOf(obj);
  if (proto === null) return true;

  let baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
}
