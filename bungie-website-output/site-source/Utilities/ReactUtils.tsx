import isEqual from "react-fast-compare";
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

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

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

/**
 * A hook that allows error boundaries to catch async errors.
 * */
export const useAsyncError = () => {
  const [_, setError] = React.useState();

  return React.useCallback(
    (e: Error) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
};
