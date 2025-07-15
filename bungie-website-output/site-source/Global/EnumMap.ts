// Generic class for mapping enum keys to values
export class EnumMap<TKey extends string | number, TValue> {
  private map: Partial<Record<TKey, TValue>>;

  // On construction, pass in the enum type and a map using the enum string or num
  constructor(
    enumObj: Record<string, TKey>,
    data: Partial<Record<TKey, TValue>>
  ) {
    this.map = { ...data };
    // Validate that keys in data are valid enum values
    for (const key of Object.keys(data)) {
      if (
        !(key in enumObj) &&
        !Object.values(enumObj).includes(data[key as keyof typeof data] as any)
      ) {
        throw new Error(`Invalid enum key: ${key}`);
      }
    }
  }

  // Get value by string or enum key
  get(key: TKey | string): TValue | undefined {
    const enumKey =
      typeof key === "string" ? (this.enumValueFromString(key) as TKey) : key;
    return this.map[enumKey];
  }

  // Get all entries as an array
  getAll(): Array<[TKey, TValue]> {
    return Object.entries(this.map) as Array<[TKey, TValue]>;
  }

  // Helper to convert string to enum value
  private enumValueFromString(key: string): TKey | undefined {
    const enumObj = Object.keys(this.map).reduce((acc, k) => {
      acc[k] = (this.map as any)[k];
      return acc;
    }, {} as Record<string, TKey>);
    return enumObj[key];
  }
}
