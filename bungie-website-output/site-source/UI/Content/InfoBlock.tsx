import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import * as React from "react";
import possibleStyles from "./InfoBlock.module.scss";
import { Platform, Renderable } from "@Platform";
import { Localizer } from "@bungie/localization";
import { PageDoesNotExistError, NotFoundError } from "@CustomErrors";

interface IContentItemProps {
  /** The ID of the article to display. Must specify either articleId or tagAndType */
  articleId?: number;
  /** The tag and type of the article to display. Must specify either articleId or tagAndType */
  tagAndType?: { tag: string; type: string };
  /** If true, hit Renderer and get fully rendered HTML */
  preRenderOpts?: {
    propertyName: string;
  };
}

interface DefaultProps {
  hideTitle: boolean;
  ignoreStyles: boolean;
}

interface IContentItemState {
  contentRenderable: Renderable.ContentItemRenderable;
  contentRendered: string;
  hasError: boolean;
}

/**
 * Renders a content item either by ID or tag and type
 *  *
 * @param {IContentItemProps} props
 * @returns
 */
export class InfoBlock extends React.Component<
  IContentItemProps & DefaultProps,
  IContentItemState
> {
  constructor(props: IContentItemProps & DefaultProps) {
    super(props);

    if (props.articleId === undefined && props.tagAndType === undefined) {
      throw new Error("articleId or tagAndType must be defined");
    }

    this.state = {
      contentRenderable: null,
      contentRendered: "",
      hasError: false,
    };
  }

  public static defaultProps = {
    hideTitle: false,
    ignoreStyles: false,
  };

  private preRenderPromise() {
    const url =
      this.props.articleId !== undefined
        ? `/${
            Localizer.CurrentCultureName
          }/Content/GetContentById?id=${encodeURIComponent(
            String(this.props.articleId)
          )}&propertyName=${encodeURIComponent(
            String(this.props.preRenderOpts.propertyName)
          )}`
        : `/${
            Localizer.CurrentCultureName
          }/Content/GetContentByTagAndType?tag=${encodeURIComponent(
            String(this.props.tagAndType.tag)
          )}&type=${encodeURIComponent(
            String(this.props.tagAndType.type)
          )}&propertyName=${encodeURIComponent(
            String(this.props.preRenderOpts.propertyName)
          )}`;

    return fetch(url);
  }

  public componentDidMount() {
    if (this.props.preRenderOpts) {
      this.preRenderPromise()
        .then((data) => data.text())
        .then((data) => {
          this.setState({
            contentRendered: data,
          });
        })
        .catch(() => {
          this.setState({
            hasError: true,
          });
        });
    } else {
      const promise: Promise<Renderable.ContentItemRenderable> =
        this.props.articleId !== undefined
          ? Platform.RendererService.ContentItemRenderableById(
              this.props.articleId
            )
          : Platform.RendererService.ContentItemRenderableByTagAndType(
              this.props.tagAndType.tag,
              this.props.tagAndType.type
            );

      promise
        .then((vm) =>
          this.setState({
            contentRenderable: vm,
          })
        )
        .catch(() => {
          this.setState({
            hasError: true,
          });
        });
    }
  }

  public render() {
    if (this.state.hasError) {
      //	throw new NotFoundError();
    }

    let renderable = null,
      rendered = null,
      title = null,
      lastUpdated = null;

    const styles = this.props.ignoreStyles ? {} : possibleStyles;

    if (this.state.contentRendered) {
      rendered = (
        <div
          dangerouslySetInnerHTML={sanitizeHTML(this.state.contentRendered)}
        />
      );
    } else {
      if (
        this.state.contentRenderable &&
        this.state.contentRenderable &&
        this.state.contentRenderable.Content &&
        "CustomHTML" in this.state.contentRenderable.Content.properties
      ) {
        const content = this.state.contentRenderable.Content;

        renderable = (
          <div
            dangerouslySetInnerHTML={sanitizeHTML(
              content.properties["CustomHTML"]
            )}
          />
        );

        title = content.properties.Title;
        lastUpdated = content.properties.LastUpdated;
      }

      rendered = (
        <React.Fragment>
          <h3>
            <span dangerouslySetInnerHTML={sanitizeHTML(title)} />
            <time
              dangerouslySetInnerHTML={sanitizeHTML(lastUpdated)}
              style={{ marginLeft: "1rem" }}
            />
          </h3>
          <div>{renderable}</div>
        </React.Fragment>
      );
    }

    return (
      <SpinnerContainer
        loading={
          this.state.contentRenderable === null && !this.state.contentRendered
        }
      >
        <div className={styles.infoBlockContainer}>
          {rendered}
          {this.props.children}
        </div>
      </SpinnerContainer>
    );
  }
}
