import { WithRouteData } from "@UI/Navigation/WithRouteData";
import * as Mustache from "mustache";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";

interface IStaticAreaState {
  renderableHtml: string;
}

interface IStaticParams {
  page: string;
}

class StaticArea extends React.Component<
  RouteComponentProps<IStaticParams>,
  IStaticAreaState
> {
  constructor(props: RouteComponentProps<IStaticParams>) {
    super(props);

    this.state = {
      renderableHtml: "",
    };
  }

  public componentDidMount() {
    const pageName = this.props.match.params.page;
    const locale = LocalizerUtils.currentCultureName;

    const pageRootFolder = `/7/StaticPages/${pageName}`;
    const requireHtml = location.origin + `${pageRootFolder}/${pageName}.html`;
    const enStrings =
      location.origin + `/7/StaticPages/localized/${pageName}.json`;
    let requireStrings = enStrings;
    if (locale !== "en") {
      requireStrings =
        location.origin + `/7/StaticPages/localized/${locale}/${pageName}.json`;
    }

    const promises = [
      fetch(requireHtml).then((response) => response.text()),
      fetch(requireStrings).then((response) => response.json()),
      fetch(enStrings).then((response) => response.json()),
    ];

    Promise.all(promises).then((data) => {
      const html = data[0];
      const strings = data[1] || data[2];

      let htmlBody = html.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im)[1];

      const cssRegexp = /href=\"(.*\.css)\"/gim;
      htmlBody = htmlBody.replace(cssRegexp, `href=\"${pageRootFolder}/$1\"`);

      const jsRegexp = /src=\"(.*\.js)\"/;

      const jsExec = jsRegexp.exec(htmlBody);
      const scriptSrcs = jsExec.slice(1, jsExec.length);

      const result = Mustache.render(htmlBody, strings);
      this.setState(
        {
          renderableHtml: result,
        },
        () => {
          scriptSrcs.forEach((toLoad) => {
            const script = document.createElement("script");
            const prior = document.getElementsByTagName("script")[0];
            script.async = true;

            script.src = `${pageRootFolder}/${toLoad}`;
            prior.parentNode.insertBefore(script, prior);
          });
        }
      );
    });
  }

  public render() {
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: this.state.renderableHtml }} />
      </div>
    );
  }
}

export default WithRouteData(StaticArea);
