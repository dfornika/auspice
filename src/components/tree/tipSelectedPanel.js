/*eslint-env browser*/
import React from "react";
import {infoPanelStyles} from "../../globalStyles";
import {prettyString, authorString} from "./treeViewFunctions";

const TipSelectedPanel = ({tip, goAwayCallback}) => {
  const styles = {
    container: {
      backgroundColor: "rgba(80, 80, 80, .20)",
      position: "absolute",
      width: "100%",
      height: "100%",
      pointerEvents: "all",
      top: 0,
      left: 0,
      zIndex: 2000,
      /* FLEXBOX */
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      wordWrap: "break-word",
      wordBreak: "break-word"
    }
  };

  const stopProp = (e) => {
    if (!e) {e = window.event;}
    e.cancelBubble = true;
    if (e.stopPropagation) {e.stopPropagation();}
  };

  const makePanel = () => {
    if (!tip) {return null;}
    let url = tip.n.attr.url;
    if (url !== undefined && url.startsWith("https_")) {
      url = url.replace("https_", "https:");
    } else if (url !== undefined && url.startsWith("http_")) {
      url = url.replace("http_", "http:");
    }
    return (
      <div style={styles.container} onClick={() => goAwayCallback(tip)}>
        <div className={"panel"} style={infoPanelStyles.panel} onClick={(e) => stopProp(e)}>
          <p style={infoPanelStyles.modalHeading}>
            {`${tip.n.strain}`}
          </p>
          <table>
            <tbody>
              <tr>
                <th width={130}>Region</th>
                <td>{prettyString(tip.n.attr.region)}</td>
              </tr>
              <tr>
                <th>Country</th>
                <td>{prettyString(tip.n.attr.country)}</td>
              </tr>
              <tr>
                <th>Division</th>
                <td>{prettyString(tip.n.attr.division)}</td>
              </tr>
              <tr>
                <th>Collection date</th>
                <td>{prettyString(tip.n.attr.date)}</td>
              </tr>
              <tr>
                <th>Authors</th>
                <td>{authorString(tip.n.attr.authors)}</td>
              </tr>
              {/* todo: check if both URL && accession exist */}
              <tr>
                <th>Accession</th>
                <td><a href={url} target="_blank">{tip.n.attr.accession}</a></td>
              </tr>
            </tbody>
          </table>
          <p style={infoPanelStyles.comment}>
            Click outside this box to go back to the tree
          </p>
        </div>
      </div>
    );
  };

  return (
    makePanel()
  );
};

export default TipSelectedPanel;
