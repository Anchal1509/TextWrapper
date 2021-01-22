import powerbi from "powerbi-visuals-api";
import ISelectionManager = powerbi.extensibility.ISelectionManager;

export interface ITextSettings {
    color: string;
    fontSize: number;
    alignment: string;
    lineBreak: string;
}

export interface IStaticTextSettings {
    showColon: boolean;
    textPosition: string;
    showTextHiglighted: boolean;
    backgroundcolor: string;
    fontFamily: string;
    boldStyle: boolean;
    italicStyle: boolean;
    underlineStyle: boolean;
    postText: string;
}

export interface IDynamicTextSettings {
    showTextHiglighted: boolean;
    backgroundcolor: string;
    fontFamily: string;
    boldStyle: boolean;
    italicStyle: boolean;
    underlineStyle: boolean;
}

export interface IDynamicTextContainer {
    textContainer: string;
    lengthContainer: number;
}

export interface IErrorMessageSettings {
    blankValue: string;
}

export interface State {
    classes?: string,
    textValDynamic?: string,
    textFontSize?: string,
    textAlignment?: "center" | "left" | "right",
    textColor?: string,
    staticShowColon?: boolean;
    staticTextPosition?: string;
    staticShowTextHiglighted?: boolean;
    staticBackgroundcolor?: string;
    staticFontFamily?: string;
    staticBoldStyle?: boolean;
    staticItalicStyle?: boolean;
    staticUnderlineStyle?: boolean;
    staticPostText?: string;
    dynamicShowTextHiglighted?: boolean;
    dynamicBackgroundcolor?: string;
    dynamicFontFamily?: string;
    dynamicBoldStyle?: boolean;
    dynamicItalicStyle?: boolean;
    dynamicUnderlineStyle?: boolean;
    selectionManager?: ISelectionManager;
}
