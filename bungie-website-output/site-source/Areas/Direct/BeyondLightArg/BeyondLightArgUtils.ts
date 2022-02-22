const sm: any = require("./sm");

export interface ArgData {
  Image: string;
  Exception: string;
}

const possible = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%&"
  .toUpperCase()
  .split("");

export class BeyondLightArgUtils {
  public static async doFetch(
    input: string,
    decodedInput: string
  ): Promise<ArgData> {
    const response = await fetch(
      `/en/Content/ArgData?page=wqarg&multiInput=${input}_${decodedInput}`
    );
    const json = (await response.json()) as ArgData;

    return json;
  }

  public static hash(input: string) {
    return new Promise<string>((resolve) => {
      sm(input).then((hash: any) => resolve(hash));
    });
  }

  public static getRandomLetters(length: number) {
    return new Array(length)
      .fill(0)
      .map((_) => possible[Math.floor(Math.random() * possible.length)])
      .join("");
  }
}
