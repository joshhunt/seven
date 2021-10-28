// Created by larobinson, 2021
// Copyright Bungie, Inc.

export class Queue {
  public static Instance = new Queue();

  private functionList: (() => Promise<any>)[] = [];

  private readonly continue = async (): Promise<boolean> => {
    if (this.functionList.length !== 0) {
      const funcToRun = this.functionList.shift();
      await this.runFunction(funcToRun).finally(() => this.continue());
    } else {
      // returns true when finished running all functions
      return true;
    }
  };

  protected readonly runFunction = async (
    func: () => Promise<void>
  ): Promise<void> => {
    await func();
  };

  public all = (functions: (() => Promise<any>)[]) => {
    this.functionList = [...functions];

    return this.continue();
  };
}
