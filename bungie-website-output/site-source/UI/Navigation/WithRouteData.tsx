import { RouteDataStore } from "@Global/DataStore/RouteDataStore";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import isEqual from "react-fast-compare";

export const WithRouteData = <TParams, S>(
  BoundComponent: React.ComponentClass<RouteComponentProps<TParams>, S>
) =>
  class extends React.Component<RouteComponentProps<TParams>, S> {
    public componentDidMount() {
      this.updateRouteData(this.props.match.path);
    }

    public shouldComponentUpdate(nextProps: RouteComponentProps<TParams>) {
      const different =
        !isEqual(this.props.match, nextProps.match) ||
        !isEqual(this.props.location, nextProps.location);

      if (different) {
        this.updateRouteData(nextProps.match.path);
      }

      return different;
    }

    public render() {
      return <BoundComponent {...this.props} />;
    }

    private updateRouteData(path: string) {
      RouteDataStore.Instance.update({
        currentPath: path,
      });
    }
  };
