// Created by atseng, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";

export class BBCodeUtils {
  public static get bbCodes() {
    return {
      // simple parsing, deliberately not fancy

      //This regex won't read in IE8.
      quoteRegex: new RegExp(
        "\\[quote\\]((?:(?!\\[quote\\])[^](?!\\[quote\\]))*?)\\[\\/quote\\]",
        "gi"
      ),
      boldRegex: /\[b\]([\s\S]+?)\[\/b\]/gi,
      underlineRegex: /\[u\]([\s\S]+?)\[\/u\]/gi,
      italicsRegex: /\[i\]([\s\S]+?)\[\/i\]/gi,
      spoilerRegex: /\[spoiler\]([\s\S]+?)\[\/spoiler\]/gi,
      urlRegex: /\[url\](\/[^\s'"<>\[]*?)\[\/url\]/gi,
      namedUrlRegex: /\[url\=(\/[^\s'"<>\[]*?)\]((?!.*?\[spoiler\])?[\s\S]+?)\[\/url\]/gi,
      externalUrlRegex: /\[url\](https?:\/\/[^\s'"<>\[]+?)\[\/url\]/gi,
      externalNamedUrlRegex: /\[url\=(https?:\/\/[^\s'"<>\[]+?)\]((?!.*?\[spoiler\])?[\s\S]+?)\[\/url\]/gi,
      googleUrlRegex: /\[google\]([\s\S]+?)\[\/google]/gi,
      newlineRegex: /\r?\n/gi,
      armory: /\[armory\]([^'"<>\[]+?)\[\/armory]/gi,
    };
  }

  public static injectSpans(data: string): string {
    const hashRegex = new RegExp(
      /(\#([a-zA-Z\u00C0-\u017F\u01FA-\u0217][a-zA-Z\u00C0-\u017F\u01FA-\u0217_0-9]{2,29}))(?!.*?\[\/(url|google)\])/gi
    );

    return data.replace(hashRegex, '<span data-tag="$2">$1</span>');
  }

  public static parseBBCode(
    inputText: string,
    convertNewLinesToBr: boolean,
    injectTagSpans: boolean,
    restrictedBBCode: RegExp[] = [],
    openLinksInNewWindow = false
  ) {
    if (inputText) {
      // deal with all the bbcode, and also translate \n into <br/>.
      let newInputText = inputText;
      if (
        convertNewLinesToBr &&
        restrictedBBCode.indexOf(this.bbCodes.newlineRegex) === -1
      ) {
        newInputText = newInputText.replace(
          this.bbCodes.newlineRegex,
          "<br />"
        );
      }

      let target = "";
      if (openLinksInNewWindow) {
        target = 'target="_blank"';
      }

      //convert ' to &#39;, so that bbcodes will behave correctly
      newInputText = newInputText.replace(/'/gi, "&#39;");

      if (restrictedBBCode.indexOf(this.bbCodes.quoteRegex) === -1) {
        //blockquotes can be nested so this is a little different
        const maxQuotes = 7;

        //For all the quotes before the max, nest as normal
        let i: number;
        for (i = 0; i < maxQuotes - 1; i++) {
          newInputText = newInputText.replace(
            this.bbCodes.quoteRegex,
            "<blockquote>$1</blockquote>"
          );
        }

        //Once we hit one before the max, we'll put the rest inside one wrapper quote
        const matches = newInputText.match(/\[quote\]/gi);
        let remainingQuoteCount = 0;

        if (matches) {
          remainingQuoteCount = matches.length;
        }

        //Loop through all the quotes and remove them all except the outer-most
        for (i = 0; i < remainingQuoteCount; i++) {
          newInputText =
            i + 1 === remainingQuoteCount
              ? newInputText.replace(
                  this.bbCodes.quoteRegex,
                  "<blockquote>$1</blockquote>"
                )
              : newInputText.replace(this.bbCodes.quoteRegex, "$1");
        }
      }

      if (restrictedBBCode.indexOf(this.bbCodes.boldRegex) === -1) {
        newInputText = newInputText.replace(
          this.bbCodes.boldRegex,
          "<strong>$1</strong>"
        );
      }

      if (restrictedBBCode.indexOf(this.bbCodes.underlineRegex) === -1) {
        newInputText = newInputText.replace(
          this.bbCodes.underlineRegex,
          "<span class='underline'>$1</span>"
        );
      }

      if (restrictedBBCode.indexOf(this.bbCodes.italicsRegex) === -1) {
        newInputText = newInputText.replace(
          this.bbCodes.italicsRegex,
          "<em>$1</em>"
        );
      }

      if (restrictedBBCode.indexOf(this.bbCodes.armory) === -1) {
        newInputText = newInputText.replace(
          this.bbCodes.armory,
          `<a href="/${Localizer.CurrentCultureName}/Search?query=$1&type=Items" class="armoryLink" ${target}><i class="fa-th-list fa" />&nbsp;$1</a>`
        );
      }

      if (injectTagSpans) {
        newInputText = BBCodeUtils.injectSpans(newInputText);
      }

      // urls, so we they may have "#" in them that aren't tags.  So we do the span injection above here.
      if (restrictedBBCode.indexOf(this.bbCodes.urlRegex) === -1) {
        newInputText = newInputText.replace(
          this.bbCodes.urlRegex,
          `<a href="https://${window.location.host}$1" rel="nofollow noopener" class="bungieLink" ${target}>$1</a>`
        );
      }

      if (restrictedBBCode.indexOf(this.bbCodes.namedUrlRegex) === -1) {
        newInputText = newInputText.replace(
          this.bbCodes.namedUrlRegex,
          `<a href="https://${window.location.host}$1" rel="nofollow noopener" class="bungieLink" ${target}>$2</a>`
        );
      }

      if (restrictedBBCode.indexOf(this.bbCodes.externalUrlRegex) === -1) {
        newInputText = newInputText.replace(/(\[url\](?!http))/gi, "$1http://");

        newInputText = newInputText.replace(
          this.bbCodes.externalUrlRegex,
          `<a href="$1" rel="nofollow noopener" class="externalLink" ${target}>$1</a>`
        );
      }

      if (restrictedBBCode.indexOf(this.bbCodes.externalNamedUrlRegex) === -1) {
        newInputText = newInputText.replace(
          this.bbCodes.externalNamedUrlRegex,
          `<a href="$1" rel="nofollow noopener" class="externalLink" ${target}>$2</a>`
        );
      }

      if (restrictedBBCode.indexOf(this.bbCodes.googleUrlRegex) === -1) {
        newInputText = newInputText.replace(
          this.bbCodes.googleUrlRegex,
          `<a href="http://www.google.com/#q=$1" rel="nofollow noopener" class="externalLink" ${target}>$1</a>`
        );
      }

      if (restrictedBBCode.indexOf(this.bbCodes.spoilerRegex) === -1) {
        // must be after url parsing
        newInputText = newInputText.replace(
          this.bbCodes.spoilerRegex,
          `<div class="spoiler contentHide">$1</div>`
        );
      }

      //undo convert ' to &#39;, so that bbcodes will behave correctly
      newInputText = newInputText.replace(/&#39;/gi, "'");

      return newInputText;
    }

    return inputText;
  }
}
