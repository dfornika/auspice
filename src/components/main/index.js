import React, {lazy, Suspense } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { ThemeProvider } from 'styled-components';
import SidebarToggle from "../framework/sidebar-toggle";
import Info from "../info/info";
import Tree from "../tree";
import Map from "../map/map";
import { controlsHiddenWidth } from "../../util/globals";
import Footer from "../framework/footer";
import FinePrint from "../framework/fine-print";
import DownloadModal from "../download/downloadModal";
import { analyticsNewPage } from "../../util/googleAnalytics";
import handleFilesDropped from "../../actions/filesDropped";
import { TOGGLE_SIDEBAR } from "../../actions/types";
import { numberOfGridPanels } from "../../actions/panelDisplay";
import AnimationController from "../framework/animationController";
import { calcUsableWidth } from "../../util/computeResponsive";
import { renderNarrativeToggle } from "../narrative/renderNarrativeToggle";
import { Sidebar } from "./sidebar";
import { calcPanelDims, calcStyles } from "./utils";
import { PanelsContainer, sidebarTheme } from "./styles";
import ErrorBoundary from "../../util/errorBoundary";
import Spinner, { PanelSpinner } from "../framework/spinner";
import MainDisplayMarkdown from "../narrative/MainDisplayMarkdown";
import MobileNarrativeDisplay from "../narrative/MobileNarrativeDisplay";

const Entropy = lazy(() => import("../entropy"));
const Frequencies = lazy(() => import("../frequencies"));
const Measurements = lazy(() => import("../measurements"));


@connect((state) => ({
  panelsToDisplay: state.controls.panelsToDisplay,
  panelLayout: state.controls.panelLayout,
  displayNarrative: state.narrative.display,
  narrativeIsLoaded: state.narrative.loaded,
  narrativeTitle: state.narrative.title,
  browserDimensions: state.browserDimensions.browserDimensions,
  frequenciesLoaded: state.frequencies.loaded,
  metadataLoaded: state.metadata.loaded,
  treeLoaded: state.tree.loaded,
  sidebarOpen: state.controls.sidebarOpen,
  showOnlyPanels: state.controls.showOnlyPanels,
  treeName: state.tree.name,
  secondTreeName: state.controls.showTreeToo
}))
class Main extends React.Component {
  constructor(props) {
    super(props);
    /* window listener employed to toggle switch to mobile display.
    NOTE: this used to toggle sidebar open boolean when that was stored
    as state here, but his has since ben moved to redux state. The mobile
    display should likewise be lifted to redux state */
    const mql = window.matchMedia(`(min-width: ${controlsHiddenWidth}px)`);
    mql.addListener(() => this.setState({
      mobileDisplay: !this.state.mql.matches
    }));
    this.state = {
      mql,
      mobileDisplay: !mql.matches,
      showSpinner: !(this.props.metadataLoaded && this.props.treeLoaded)
    };
    analyticsNewPage();
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.eventListenerForFilesDropped = (e) => {
      e.preventDefault();
      return this.props.dispatch(handleFilesDropped(e.dataTransfer.files));
    };
    this.eventListenerForFilesDragged = (e) => {
      e.preventDefault();
    };
  }
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.showSpinner && nextProps.metadataLoaded && nextProps.treeLoaded) {
      this.setState({showSpinner: false});
    }
  }
  componentDidMount() {
    document.addEventListener("dragover", this.eventListenerForFilesDragged, false);
    document.addEventListener("drop", this.eventListenerForFilesDropped, false);
  }
  componentWillUnmount() {
    document.removeEventListener("dragover", this.eventListenerForFilesDragged);
    document.removeEventListener("drop", this.eventListenerForFilesDropped);
  }
  toggleSidebar() {
    this.props.dispatch({type: TOGGLE_SIDEBAR, value: !this.props.sidebarOpen});
  }

  inGrid() {
    return this.props.panelLayout === "grid";
  }

  shouldShowMeasurementsLegend() {
    const showingTree = this.props.panelsToDisplay.includes("tree");
    return !showingTree || !this.inGrid();
  }

  shouldMapBeInGrid() {
    const evenNumberOfGridPanels = numberOfGridPanels(this.props.panelsToDisplay) % 2 === 0;
    return this.inGrid() && evenNumberOfGridPanels;
  }

  shouldShowMapLegend() {
    return !this.shouldMapBeInGrid();
  }

  render() {
    if (this.state.showSpinner) {
      return (<Spinner/>);
    }

    /* for mobile narratives we use a custom component as the nesting of view components is different */
    /* TODO - the breakpoint for `mobileDisplay` needs testing */
    if (this.state.mobileDisplay && this.props.displayNarrative) {
      return (
        <>
          <AnimationController/>
          <ThemeProvider theme={sidebarTheme}>
            <MobileNarrativeDisplay/>
          </ThemeProvider>
        </>
      );
    }

    /* The following code is employed for:
     * (a) all non-narrative displays (including on mobile)
     * (b) narrative display for non-mobile (i.e. display side-by-side)
     */
    const {availableWidth, availableHeight, sidebarWidth, overlayStyles} =
      calcStyles(this.props.browserDimensions, this.props.displayNarrative, this.props.sidebarOpen, this.state.mobileDisplay);
    const overlayHandler = () => {this.props.dispatch({type: TOGGLE_SIDEBAR, value: false});};
    const {full, grid, chart} =
      calcPanelDims(this.props.panelsToDisplay, this.props.displayNarrative, availableWidth, availableHeight);
    /* We use tree name(s) as a react key so that components remount when datasets change */
    const keyName = `${this.props.treeName}${this.props.secondTreeName ? `:${this.props.secondTreeName}` : ''}`;
    return (
      <span>
        <AnimationController/>
        <ErrorBoundary showNothing>
          <ThemeProvider theme={sidebarTheme}>
            <DownloadModal/>
          </ThemeProvider>
        </ErrorBoundary>
        <SidebarToggle
          sidebarOpen={this.props.sidebarOpen}
          mobileDisplay={this.state.mobileDisplay}
          handler={this.toggleSidebar}
        />
        <Sidebar
          sidebarOpen={this.props.sidebarOpen}
          width={sidebarWidth}
          height={availableHeight}
          displayNarrative={this.props.displayNarrative}
          panelsToDisplay={this.props.panelsToDisplay}
          narrativeTitle={this.props.narrativeTitle}
          mobileDisplay={this.state.mobileDisplay}
          navBarHandler={this.toggleSidebar}
        />
        <PanelsContainer width={availableWidth} height={availableHeight} left={this.props.sidebarOpen ? sidebarWidth : 0}>
          {this.props.narrativeIsLoaded && !this.props.panelsToDisplay.includes("MainDisplayMarkdown") ?
            renderNarrativeToggle(this.props.dispatch, this.props.displayNarrative) : null
          }
          {this.props.displayNarrative || this.props.showOnlyPanels ? null : <Info width={calcUsableWidth(availableWidth, 1)} />}
          {this.props.panelsToDisplay.includes("tree") ?
            <Tree
              width={this.inGrid() ? grid.width : full.width}
              height={this.inGrid() ? grid.height : full.height}
              key={keyName}
            /> :
            null
          }
          {this.props.panelsToDisplay.includes("measurements") ?
            <Suspense
              fallback={
                <PanelSpinner
                  width={this.inGrid() ? grid.width : full.width}
                  height={this.inGrid() ? grid.height : full.height}
                  key={keyName + "_measurements_spinner"}
                />
              }
            >
              <Measurements
                width={this.inGrid() ? grid.width : full.width}
                height={this.inGrid() ? grid.height : full.height}
                key={keyName+"_measurements"}
                showLegend={this.shouldShowMeasurementsLegend()}
              />
            </Suspense> :
            null
          }
          {this.props.panelsToDisplay.includes("map") ?
            <Map
              width={this.shouldMapBeInGrid() ? grid.width : full.width}
              height={this.shouldMapBeInGrid() ? grid.height : full.height}
              key={keyName+"_map"}
              justGotNewDatasetRenderNewMap={false}
              legend={this.shouldShowMapLegend()}
            /> :
            null
          }
          {this.props.panelsToDisplay.includes("entropy") ?
            (<Suspense fallback={null}>
              <Entropy width={chart.width} height={chart.height} key={keyName+"_entropy"}/>
            </Suspense>) :
            null
          }
          {this.props.panelsToDisplay.includes("frequencies") && this.props.frequenciesLoaded ?
            (<Suspense fallback={null}>
              <Frequencies width={chart.width} height={chart.height} key={keyName+"_frequencies"}/>
            </Suspense>) :
            null
          }
          {this.props.displayNarrative || this.props.showOnlyPanels ? null : <Footer width={calcUsableWidth(availableWidth, 1)} />}
          {this.props.displayNarrative ? null : <FinePrint width={calcUsableWidth(availableWidth, 1)} />}
          {this.props.displayNarrative && this.props.panelsToDisplay.includes("MainDisplayMarkdown") ?
            <MainDisplayMarkdown width={calcUsableWidth(availableWidth, 1)}/> :
            null
          }
        </PanelsContainer>
        {/* overlay (used for mobile to open / close sidebar) */}
        {this.state.mobileDisplay ?
          <div style={overlayStyles} onClick={overlayHandler} onTouchStart={overlayHandler}/> :
          null
        }
      </span>
    );
  }
}

export default Main;
