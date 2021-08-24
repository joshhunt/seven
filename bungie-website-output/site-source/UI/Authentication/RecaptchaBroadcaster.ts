// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { Broadcaster } from "@bungie/datastore/Broadcaster";

type RecaptchaActions = "EXECUTE_ASYNC";

class RecaptchaBroadcasterClass extends Broadcaster<RecaptchaActions> {
  public static Instance = new RecaptchaBroadcasterClass();

  /** Calling this function will broadcast the "executeRecaptchaAsync" action. All instances of a Recaptcha component listen for this broadcast to know when to call the execute method */
  public executeAsync = () => {
    this.broadcast("EXECUTE_ASYNC");
  };
}

export const RecaptchaBroadcaster = RecaptchaBroadcasterClass.Instance;
