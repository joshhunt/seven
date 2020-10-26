import isEqual from "react-fast-compare";
import { useEffect, useState, useRef } from "react";
import { DataStore } from "@Global/DataStore";

export class ReactUtils {
  /**
   * Easy way to fast compare
   * @param c The instance of the current component (usually 'this')
   * @param args Pass 'arguments' here
   */
  public static shouldComponentUpdate(c: React.Component, args: IArguments) {
    return ReactUtils.haveChangedMulti([c.props, args[0]], [c.state, args[1]]);
  }

  /**
   * Returns true if o1 and o2 are equal. Uses react-fast-compare.
   * @param o1
   * @param o2
   */
  public static haveChanged<PorS>(o1: PorS, o2: PorS) {
    return !isEqual(o1, o2);
  }

  /**
   * Returns true if each item in every pair are equal. Useful for comparing both state and props.
   * @param pairs
   */
  public static haveChangedMulti(...pairs: [any, any][]) {
    return !pairs.every((pair) => isEqual(pair[0], pair[1]));
  }
}

/**
 * A hook for React FCs that gives you the current DataStore state at all times
 * e.g. {
 *		const globalState = useDataStore(GlobalStateDataStore);
 * }
 * @param ds The DataStore in question
 */
export const useDataStore = <T extends object>(ds: DataStore<T>) => {
  // create get/set DataStore state
  const [state, setState] = useState(ds.state);

  // Observe the DataStore, and destroy when useEffect is destroyed
  useEffect(() => {
    const destroy = ds.observe(setState);

    return () => destroy();
  });

  // Return the current state
  return state;
};

/**
 * A hook for using the previous value of a variable.
 *
 * e.g. {
 *		const [someState, setSomeState] = useState();
 *		const prevState = usePrev(someState);
 * }
 * */
export const usePrevious = <T extends any>(value: T) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};
