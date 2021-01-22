/*
 *  Power BI Visualizations
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

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
  public textSettings: TextSettings = new TextSettings();
  public staticText: StaticText = new StaticText();
  public dynamicSettings: Settings = new Settings();
  public errorMessage: ErrorMessage = new ErrorMessage();
}

export class TextSettings {
  //Default color
  public color: string = "#777777";
  //Text size
  public fontSize: number = 18;
  //Alignment
  public alignment: string = "left";
  //Line break
  public lineBreak: string = "";
}

export class StaticText {
  //Show colon
  public showColon: boolean = true;
  // Text position
  public textPosition: string = "suffix";
  //Show text highlight
  public showTextHiglighted: boolean = true;
  //Background color
  public backgroundcolor: string = "#ffffff";
  //Static text
  public postText: string = "";
  //Font family
  public fontFamily: string = "Segoe UI Semibold";
  //Bold font style
  public boldStyle: boolean = false;
  //Italic font style
  public italicStyle: boolean = false;
  //Underline font style
  public underlineStyle: boolean = false;
}

export class Settings {
  //Show text highlight
  public showTextHiglighted: boolean = true;
  //Background color
  public backgroundcolor: string = "#ffffff";
  //Font family
  public fontFamily: string = "Segoe UI Semibold";
  //Bold font style
  public boldStyle: boolean = false;
  //Italic font style
  public italicStyle: boolean = false;
  //Underline font style
  public underlineStyle: boolean = false;
}

export class ErrorMessage {
  //Error message when there is no content
  public blankValue: string = "Query contains null value";
}