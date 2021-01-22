/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";
import * as React from "react";
import 'regenerator-runtime/runtime';
import * as ReactDOM from "react-dom";
import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import * as d3 from 'd3';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import ReactTextWrapper from "./ReactTextWrapper";
import { IDynamicTextContainer, IDynamicTextSettings, IErrorMessageSettings, IStaticTextSettings, ITextSettings } from "./interfaces";
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";
import { VisualSettings } from "./settings";
import { IValueFormatter } from "powerbi-visuals-utils-formattingutils/lib/src/valueFormatter";
import { createTooltipServiceWrapper, ITooltipServiceWrapper } from "powerbi-visuals-utils-tooltiputils";
import { Constants } from "./constants";

export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: VisualSettings;
    private events: IVisualEventService;
    private reactRoot: React.ComponentElement<any, any>;
    private selectionManager: ISelectionManager;
    private tooltipServiceWrapper: ITooltipServiceWrapper;
    private constants = new Constants();
    private tooltipText: string;
    private getTooltipData(value: string): VisualTooltipDataItem[] {
        return [{
            displayName: '',
            value: value
        }];
    }

    /**
     * Represents visual
     * @constructor
     */
    constructor(options: VisualConstructorOptions) {
        this.events = options.host.eventService;
        this.reactRoot = React.createElement(ReactTextWrapper, {});
        this.target = options.element;
        this.target.setAttribute("style", "overflow-y:auto; cursor: default;");
        ReactDOM.render(this.reactRoot, this.target);
        this.selectionManager = options.host.createSelectionManager();
        this.tooltipServiceWrapper = createTooltipServiceWrapper(options.host.tooltipService, options.element);
    }

    /**
     * Represents update function of Visual update options
     * @param options 
     */
    public update(options: VisualUpdateOptions) {
        try {
            this.events.renderingStarted(options);
            const dataView: DataView = options && options.dataViews[0];
            this.settings = VisualSettings.parse<VisualSettings>(dataView);
            let textValDynamicInput: string;
            let valueLength: number = 0;
            let classes: string = "";
            const valuesContainer: IDynamicTextContainer = this.getDynamicTextValue(dataView);
            const errorMessageSettings: IErrorMessageSettings = this.settings.errorMessage;
            const textSettings: ITextSettings = this.settings.textSettings;
            const staticTextSettings: IStaticTextSettings = this.settings.staticText;
            const dynamicTextSettings: IDynamicTextSettings = this.settings.dynamicSettings;
            let staticShowColon: boolean = staticTextSettings.showColon;
            let staticPostText: string = staticTextSettings.postText;
            textValDynamicInput = valuesContainer.textContainer;
            valueLength = valuesContainer.lengthContainer;
            if (valueLength === 1) {
                classes = "tw_value tw_finalText";
            } else if (valueLength > 1) {
                classes = "tw_value errormsg";
                staticShowColon = false;
                staticPostText = null;
                textValDynamicInput = this.constants.errorMessage;
            } else if (valueLength === 0) {
                classes = "tw_value errormsg";
                staticShowColon = false;
                staticPostText = null;
                textValDynamicInput = errorMessageSettings.blankValue;
            }
            /**
             * The below condition will be executed only when custom word wrap is present
             * It will break the words on the basis of the text field
             */
            let finalString = textValDynamicInput;
            if (textSettings.lineBreak.length) {
                finalString = textValDynamicInput.split(textSettings.lineBreak).join(textSettings.lineBreak + "\n");
                let regex = new RegExp(textSettings.lineBreak, "g");
                finalString = finalString.replace(regex, "");
            }
            ReactTextWrapper.UPDATE({
                classes: classes,
                textValDynamic: finalString,
                textFontSize: this.pointToPixel(textSettings.fontSize),
                textAlignment: this.convertToAlignment(textSettings.alignment),
                textColor: textSettings.color,
                staticShowColon: staticShowColon,
                staticTextPosition: staticTextSettings.textPosition,
                staticShowTextHiglighted: staticTextSettings.showTextHiglighted,
                staticBackgroundcolor: staticTextSettings.backgroundcolor,
                staticFontFamily: staticTextSettings.fontFamily,
                staticBoldStyle: staticTextSettings.boldStyle,
                staticItalicStyle: staticTextSettings.italicStyle,
                staticUnderlineStyle: staticTextSettings.underlineStyle,
                staticPostText: staticPostText,
                dynamicShowTextHiglighted: dynamicTextSettings.showTextHiglighted,
                dynamicBackgroundcolor: dynamicTextSettings.backgroundcolor,
                dynamicFontFamily: dynamicTextSettings.fontFamily,
                dynamicBoldStyle: dynamicTextSettings.boldStyle,
                dynamicItalicStyle: dynamicTextSettings.italicStyle,
                dynamicUnderlineStyle: dynamicTextSettings.underlineStyle,
                selectionManager: this.selectionManager
            });
            this.tooltipText = this.getTooltipValue(finalString, staticPostText, staticTextSettings.textPosition, staticShowColon);
            this.tooltipServiceWrapper.addTooltip(d3.select(".mainDiv"), () =>
                this.getTooltipData(this.tooltipText));

            this.events.renderingFinished(options);
        } catch (e) {
            this.events.renderingFailed(options);
        }
    }

    /**
     * This function will give the tooltip value as per the static text position
     * @param textValDynamicInput 
     * @param staticPostText 
     * @param textPosition 
     * @param staticShowColon 
     */
    public getTooltipValue(textValDynamicInput: string, staticPostText: string, textPosition: string, staticShowColon: boolean): string {
        const colon = staticShowColon && staticPostText.length ? ": " : " ";
        if (textPosition === this.constants.suffix) {
            return textValDynamicInput + colon + staticPostText;
        } else {
            return staticPostText + colon + textValDynamicInput;
        }
    }

    public convertToAlignment(alignment: string) {
        let textAlignment;
        switch (alignment) {
            case "center": textAlignment = "center"
                break;
            case "left": textAlignment = "left"
                break;
            case "right": textAlignment = "right"
                break;
        }
        return textAlignment;
    }

    /**
     * This function will convert point to pixel string
     * @param point 
     */
    public pointToPixel(point: number): string {

        return (point * this.constants.pxPtRatio) + this.constants.pixelString;
    }

    /**
     * This function will convert value to decimal places value
     * @param value 
     */
    public getDecimalPlacesCount(value: any): number {
        let decimalPlaces: number = 0;
        if (value > 0) {
            const arr: string[] = value.toString().split(".");
            if (!arr[1] && parseFloat(arr[1]) > 0) {
                decimalPlaces = arr[1].length;
            }
        }

        return decimalPlaces;
    }

    /**
     * This function will get the dynamic text value from the settings
     * @param dataView 
     */
    public getDynamicTextValue(dataView: DataView): IDynamicTextContainer {
        let textValDynamicInput: any;
        let valueLength: number = 0;
        if (dataView?.categorical) {
            let dataViewCategories = dataView.categorical;
            if (dataViewCategories?.categories?.[0]?.values) {
                let dataViewCategoriesFirst = dataViewCategories.categories[0];
                valueLength = dataViewCategoriesFirst.values.length;
                textValDynamicInput = valueLength ?
                    dataViewCategoriesFirst.values[0] :
                    this.constants.blank;
                if (dataViewCategoriesFirst?.source?.format) {
                    const formatter: IValueFormatter = valueFormatter.create({
                        format: dataViewCategoriesFirst.source.format
                    });
                    textValDynamicInput = formatter.format(textValDynamicInput);
                }
            } else if (dataViewCategories?.values?.[0]?.values) {
                let dataViewCategoriesFirst = dataViewCategories.values[0];
                valueLength = dataViewCategoriesFirst.values.length;
                textValDynamicInput = dataViewCategoriesFirst.values[0] ? dataViewCategoriesFirst
                    .values[0] : 0;
                if (dataViewCategoriesFirst?.source?.format) {

                    let decimalPlaces: number = this.getDecimalPlacesCount(textValDynamicInput);
                    decimalPlaces = decimalPlaces > 4 ? 4 : decimalPlaces;
                    const formatter: IValueFormatter = valueFormatter.create({
                        format: dataViewCategoriesFirst.source.format,
                        precision: decimalPlaces,
                        value: 1
                    });
                    textValDynamicInput = formatter.format(textValDynamicInput);
                }
            }

            return {
                textContainer: textValDynamicInput,
                lengthContainer: valueLength
            };
        }
    }

    /**
     * To parse the settings
     * @param dataView 
     */
    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        const settings: VisualSettings = this.settings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings || VisualSettings.getDefault(), options);
    }
}