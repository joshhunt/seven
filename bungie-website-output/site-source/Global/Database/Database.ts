import Dexie from "dexie";
import { DestinyWorldDefinitionsTypeNameList } from "@Definitions";

export const BnetDatabaseTableNames = {
  Destiny2Manifest: "d2Manifest",
};

export const GenerateDestinyDatabaseSchema = () => {
  // Loop through every type of definition and make a table for it, with the columns "hash" and "def"
  const schema = DestinyWorldDefinitionsTypeNameList.reduce((acc, val) => {
    acc[val] = "hash";

    return acc;
  }, {} as Record<string, string>);

  // Also create a table for the manifest version
  schema["manifest"] = "version";

  return schema;
};

/**
 * Handles Destiny IndexedDB interactions
 * Docs available here for Dexie: https://dexie.org/
 * */
class DestinyDatabaseInitializer {
  public static Instance = new DestinyDatabaseInitializer();

  private schema: { [key: string]: string };

  private createSchema() {
    this.schema = GenerateDestinyDatabaseSchema();
  }

  /** Creates the Dexie database schema (basically, create the list of tables and define the 'key' for each) */
  public generateSchema() {
    // Loop through every type of definition and make a table for it, with the columns "hash" and "def"
    const schema = DestinyWorldDefinitionsTypeNameList.reduce((acc, val) => {
      acc[val] = "hash";

      return acc;
    }, {} as Record<string, string>);

    // Also create a table for the manifest version
    schema["manifest"] = "version";

    return schema;
  }

  public async createDb() {
    this.createSchema();

    const db = new Dexie("Destiny");

    db.version(1).stores(this.schema);

    return db;
  }
}

export const DestinyDatabase = DestinyDatabaseInitializer.Instance.createDb();
