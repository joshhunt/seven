import posed from "react-pose";
import React, { HTMLProps, ComponentType } from "react";
import { PoseElementProps } from "react-pose/lib/components/PoseElement/types";

export const PoseDirectionContext = React.createContext<PoseDirection>("left");

export type PoseDirection = "left" | "right";

const delayedPose = (delay: number, initialPose: PoseDirection = "left") =>
  posed.div({
    hideleft: {
      opacity: 0,
      x: 50,
      delay,
      transition: {
        ease: "easeInOut",
        duration: 300,
      },
    },
    hideright: {
      opacity: 0,
      x: -50,
      delay,
      transition: {
        ease: "easeInOut",
        duration: 300,
      },
    },
    show: {
      opacity: 1,
      x: 0,
      delay,
      transition: {
        ease: "easeInOut",
        duration: 300,
      },
    },
    initialPose: `hide${initialPose}`,
  });

interface ICrossSaveStaggerPoseProps {
  /** The higher this number is, the later it will animate. */
  index: number;

  /** If true, will animate immediately instead of using the index */
  instant?: boolean;

  children?: React.ReactNode;
}

interface ICrossSaveStaggerState {
  show: boolean;
}

/** Animates the children of this component in at a staggered rate, based on its index */
export class CrossSaveStaggerPose extends React.Component<
  ICrossSaveStaggerPoseProps,
  ICrossSaveStaggerState
> {
  private static readonly DELAY_FACTOR = 150;
  private readonly pose: ComponentType<PoseElementProps & HTMLProps<any>>;

  constructor(props: ICrossSaveStaggerPoseProps) {
    super(props);

    this.state = {
      show: props.instant,
    };

    this.pose = delayedPose(
      (this.props.index + 1) * CrossSaveStaggerPose.DELAY_FACTOR
    );
  }

  public componentDidMount() {
    if (!this.props.instant) {
      setTimeout(() => {
        this.setState({
          show: true,
        });
      }, 300);
    }
  }

  public render() {
    const Pose = this.pose;

    return (
      <PoseDirectionContext.Consumer>
        {(poseDirection) => (
          <Pose pose={this.state.show ? "show" : `hide${poseDirection}`}>
            {this.props.children}
          </Pose>
        )}
      </PoseDirectionContext.Consumer>
    );
  }
}
