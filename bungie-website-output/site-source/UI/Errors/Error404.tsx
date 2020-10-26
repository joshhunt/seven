import * as React from "react";
import { PageDoesNotExistError } from "./CustomErrors";

interface IError404Props {}

interface IError404State {}

/**
 * This component will display for 404 errors
 *  *
 * @param {IError404Props} props
 * @returns
 */
export class Error404 extends React.Component<IError404Props, IError404State> {
  constructor(props: IError404Props) {
    super(props);

    this.state = {};
  }

  public componentDidMount() {
    throw new PageDoesNotExistError();
  }

  public render() {
    return null;
  }
}
