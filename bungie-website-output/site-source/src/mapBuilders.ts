import { formatProdErrorMessage as _formatProdErrorMessage6 } from "@reduxjs/toolkit";
import { formatProdErrorMessage as _formatProdErrorMessage5 } from "@reduxjs/toolkit";
import { formatProdErrorMessage as _formatProdErrorMessage4 } from "@reduxjs/toolkit";
import { formatProdErrorMessage as _formatProdErrorMessage3 } from "@reduxjs/toolkit";
import { formatProdErrorMessage as _formatProdErrorMessage2 } from "@reduxjs/toolkit";
import { formatProdErrorMessage as _formatProdErrorMessage } from "@reduxjs/toolkit";
import type { Action } from "redux";
import type {
  CaseReducer,
  CaseReducers,
  ActionMatcherDescriptionCollection,
} from "./createReducer";
import type { TypeGuard } from "./tsHelpers";
export interface TypedActionCreator<Type extends string> {
  (...args: any[]): Action<Type>;
  type: Type;
}
/**
 * A builder for an action <-> reducer map.
 *
 * @public
 */

export interface ActionReducerMapBuilder<State> {
  /**
   * Adds a case reducer to handle a single exact action type.
   * @remarks
   * All calls to `builder.addCase` must come before any calls to `builder.addMatcher` or `builder.addDefaultCase`.
   * @param actionCreator - Either a plain action type string, or an action creator generated by [`createAction`](./createAction) that can be used to determine the action type.
   * @param reducer - The actual case reducer function.
   */
  addCase<ActionCreator extends TypedActionCreator<string>>(
    actionCreator: ActionCreator,
    reducer: CaseReducer<State, ReturnType<ActionCreator>>
  ): ActionReducerMapBuilder<State>;
  /**
   * Adds a case reducer to handle a single exact action type.
   * @remarks
   * All calls to `builder.addCase` must come before any calls to `builder.addMatcher` or `builder.addDefaultCase`.
   * @param actionCreator - Either a plain action type string, or an action creator generated by [`createAction`](./createAction) that can be used to determine the action type.
   * @param reducer - The actual case reducer function.
   */

  addCase<Type extends string, A extends Action<Type>>(
    type: Type,
    reducer: CaseReducer<State, A>
  ): ActionReducerMapBuilder<State>;
  /**
   * Allows you to match your incoming actions against your own filter function instead of only the `action.type` property.
   * @remarks
   * If multiple matcher reducers match, all of them will be executed in the order
   * they were defined in - even if a case reducer already matched.
   * All calls to `builder.addMatcher` must come after any calls to `builder.addCase` and before any calls to `builder.addDefaultCase`.
   * @param matcher - A matcher function. In TypeScript, this should be a [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
   *   function
   * @param reducer - The actual case reducer function.
   *
   * @example
  ```ts
  import {
  createAction,
  createReducer,
  AsyncThunk,
  UnknownAction,
  } from "@reduxjs/toolkit";
  type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
  type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
  type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
  type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;
  const initialState: Record<string, string> = {};
  const resetAction = createAction("reset-tracked-loading-state");
  function isPendingAction(action: UnknownAction): action is PendingAction {
  return typeof action.type === "string" && action.type.endsWith("/pending");
  }
  const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(resetAction, () => initialState)
    // matcher can be defined outside as a type predicate function
    .addMatcher(isPendingAction, (state, action) => {
      state[action.meta.requestId] = "pending";
    })
    .addMatcher(
      // matcher can be defined inline as a type predicate function
      (action): action is RejectedAction => action.type.endsWith("/rejected"),
      (state, action) => {
        state[action.meta.requestId] = "rejected";
      }
    )
    // matcher can just return boolean and the matcher can receive a generic argument
    .addMatcher<FulfilledAction>(
      (action) => action.type.endsWith("/fulfilled"),
      (state, action) => {
        state[action.meta.requestId] = "fulfilled";
      }
    );
  });
  ```
   */

  addMatcher<A>(
    matcher: TypeGuard<A> | ((action: any) => boolean),
    reducer: CaseReducer<State, A extends Action ? A : A & Action>
  ): Omit<ActionReducerMapBuilder<State>, "addCase">;
  /**
   * Adds a "default case" reducer that is executed if no case reducer and no matcher
   * reducer was executed for this action.
   * @param reducer - The fallback "default case" reducer function.
   *
   * @example
  ```ts
  import { createReducer } from '@reduxjs/toolkit'
  const initialState = { otherActions: 0 }
  const reducer = createReducer(initialState, builder => {
  builder
    // .addCase(...)
    // .addMatcher(...)
    .addDefaultCase((state, action) => {
      state.otherActions++
    })
  })
  ```
   */

  addDefaultCase(reducer: CaseReducer<State, Action>): {};
}
export function executeReducerBuilderCallback<S>(
  builderCallback: (builder: ActionReducerMapBuilder<S>) => void
): [
  CaseReducers<S, any>,
  ActionMatcherDescriptionCollection<S>,
  CaseReducer<S, Action> | undefined
] {
  const actionsMap: CaseReducers<S, any> = {};
  const actionMatchers: ActionMatcherDescriptionCollection<S> = [];
  let defaultCaseReducer: CaseReducer<S, Action> | undefined;
  const builder = {
    addCase(
      typeOrActionCreator: string | TypedActionCreator<any>,
      reducer: CaseReducer<S>
    ) {
      if (process.env.NODE_ENV !== "production") {
        /*
         to keep the definition by the user in line with actual behavior,
         we enforce `addCase` to always be called before calling `addMatcher`
         as matching cases take precedence over matchers
         */
        if (actionMatchers.length > 0) {
          throw new Error(
            process.env.NODE_ENV === "production"
              ? _formatProdErrorMessage(26)
              : "`builder.addCase` should only be called before calling `builder.addMatcher`"
          );
        }

        if (defaultCaseReducer) {
          throw new Error(
            process.env.NODE_ENV === "production"
              ? _formatProdErrorMessage2(27)
              : "`builder.addCase` should only be called before calling `builder.addDefaultCase`"
          );
        }
      }

      const type =
        typeof typeOrActionCreator === "string"
          ? typeOrActionCreator
          : typeOrActionCreator.type;

      if (!type) {
        throw new Error(
          process.env.NODE_ENV === "production"
            ? _formatProdErrorMessage3(28)
            : "`builder.addCase` cannot be called with an empty action type"
        );
      }

      if (type in actionsMap) {
        throw new Error(
          process.env.NODE_ENV === "production"
            ? _formatProdErrorMessage4(29)
            : "`builder.addCase` cannot be called with two reducers for the same action type " +
              `'${type}'`
        );
      }

      actionsMap[type] = reducer;
      return builder;
    },

    addMatcher<A>(
      matcher: TypeGuard<A>,
      reducer: CaseReducer<S, A extends Action ? A : A & Action>
    ) {
      if (process.env.NODE_ENV !== "production") {
        if (defaultCaseReducer) {
          throw new Error(
            process.env.NODE_ENV === "production"
              ? _formatProdErrorMessage5(30)
              : "`builder.addMatcher` should only be called before calling `builder.addDefaultCase`"
          );
        }
      }

      actionMatchers.push({
        matcher,
        reducer,
      });
      return builder;
    },

    addDefaultCase(reducer: CaseReducer<S, Action>) {
      if (process.env.NODE_ENV !== "production") {
        if (defaultCaseReducer) {
          throw new Error(
            process.env.NODE_ENV === "production"
              ? _formatProdErrorMessage6(31)
              : "`builder.addDefaultCase` can only be called once"
          );
        }
      }

      defaultCaseReducer = reducer;
      return builder;
    },
  };
  builderCallback(builder);
  return [actionsMap, actionMatchers, defaultCaseReducer];
}
