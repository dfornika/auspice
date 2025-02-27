import React from "react";
import { useTranslation } from 'react-i18next';

import ColorBy, {ColorByInfo} from "./color-by";
import DateRangeInputs, {DateRangeInfo} from "./date-range-inputs";
import AnimationControls from "./animation-controls";
import ChooseExplodeAttr from "./choose-explode-attr";
import ChooseBranchLabelling from "./choose-branch-labelling";
import ChooseLayout from "./choose-layout";
import ChooseDataset from "./choose-dataset";
import ChooseSecondTree from "./choose-second-tree";
import ChooseTipLabel from "./choose-tip-label";
import ChooseMetric from "./choose-metric";
import PanelLayout from "./panel-layout";
import GeoResolution from "./geo-resolution";
import TransmissionLines from './transmission-lines';
import NormalizeFrequencies from "./frequency-normalization";
import AnimationOptions from "./animation-options";
import PanelToggles from "./panel-toggles";
import ToggleTangle from "./toggle-tangle";
import Language from "./language";
import { ControlsContainer } from "./styles";
import FilterData, {FilterInfo} from "./filter";
import {TreeOptionsInfo, MapOptionsInfo, AnimationOptionsInfo, PanelOptionsInfo,
  ExplodeTreeInfo, FrequencyInfo, MeasurementsOptionsInfo} from "./miscInfoText";
import { AnnotatedHeader } from "./annotatedHeader";
import MeasurementsOptions from "./measurementsOptions";

type Props = {
  mapOn: boolean
  frequenciesOn: boolean
  measurementsOn: boolean
  mobileDisplay: boolean
}

function Controls({ mapOn, frequenciesOn, measurementsOn, mobileDisplay }: Props) {
  const { t } = useTranslation();

  return (
    <ControlsContainer>
      <ChooseDataset />

      <AnnotatedHeader title={t("sidebar:Date Range")} tooltip={DateRangeInfo} mobile={mobileDisplay}/>
      <DateRangeInputs />
      <AnimationControls />

      <AnnotatedHeader title={t("sidebar:Color By")} tooltip={ColorByInfo} mobile={mobileDisplay}/>
      <ColorBy />

      <AnnotatedHeader title={t("sidebar:Filter Data")} tooltip={FilterInfo} mobile={mobileDisplay}/>
      <FilterData measurementsOn={measurementsOn} />

      <AnnotatedHeader title={t("sidebar:Tree Options")} tooltip={TreeOptionsInfo} mobile={mobileDisplay}/>
      <ChooseLayout />
      <ChooseMetric />
      <ChooseBranchLabelling />
      <ChooseTipLabel />
      <ChooseSecondTree />
      <ChooseExplodeAttr tooltip={ExplodeTreeInfo} mobile={mobileDisplay} />
      <ToggleTangle />

      {measurementsOn ? (
        <span style={{ marginTop: "10px" }}>
          <AnnotatedHeader title={t("sidebar:Measurements Options")} tooltip={MeasurementsOptionsInfo} mobile={mobileDisplay}/>
          <MeasurementsOptions />
        </span>
      ) : null}

      {mapOn ? (
        <span style={{ marginTop: "10px" }}>
          <AnnotatedHeader title={t("sidebar:Map Options")} tooltip={MapOptionsInfo} mobile={mobileDisplay}/>
          <GeoResolution />
          <TransmissionLines />
        </span>
      ) : null}

      {frequenciesOn ? (
        <span style={{ marginTop: "10px" }}>
          <AnnotatedHeader title={t("sidebar:Frequency Options")} tooltip={FrequencyInfo} mobile={mobileDisplay}/>
          <NormalizeFrequencies />
        </span>
      ) : null}

      <span style={{ marginTop: "10px" }}>
        <AnnotatedHeader title={t("sidebar:Animation Options")} tooltip={AnimationOptionsInfo} mobile={mobileDisplay}/>
        <AnimationOptions />
      </span>

      <span style={{ paddingTop: "10px" }} />
      <AnnotatedHeader title={t("sidebar:Panel Options")} tooltip={PanelOptionsInfo} mobile={mobileDisplay}/>
      <PanelLayout />
      <PanelToggles />
      <Language />
    </ControlsContainer>
  );
}

export default Controls;
