import * as React from "react";
import "../style/visual.less";
import { State } from "./interfaces";
import powerbi from "powerbi-visuals-api";
import { Constants } from "./constants";
import ISelectionManager = powerbi.extensibility.ISelectionManager;

export const initialState: State = {
    classes: "",
    textValDynamic: "",
    textFontSize: "",
    textColor: "",
    staticShowColon: false,
    staticTextPosition: "",
    staticBackgroundcolor: "",
    staticFontFamily: "",
    staticBoldStyle: false,
    staticItalicStyle: false,
    staticUnderlineStyle: false,
    staticPostText: "",
    dynamicBackgroundcolor: "",
    dynamicFontFamily: "",
    dynamicBoldStyle: false,
    dynamicItalicStyle: false,
    dynamicUnderlineStyle: false
}

/**
 * TextWrapper React component
 */
export class ReactTextWrapper extends React.Component<{}>{
    constructor(props: any) {
        super(props);
        this.state = initialState;
        this.ref = React.createRef();
        this.showContextMenuInVisual = this.showContextMenuInVisual.bind(this);
    }
    private static updateCallback: (data: object) => void = null;
    public selectionManager: ISelectionManager;
    private constants = new Constants();
    public state: State = initialState;
    public ref = null;

    /**
     * UPDATE function to set the state
     * @param newState 
     */
    public static UPDATE(newState: State) {
        ReactTextWrapper.updateCallback?.(newState);
    }

    /**
     * Life cycle method of React componentWillUnmount
     */
    public componentWillUnmount() {
        ReactTextWrapper.updateCallback = null;
    }

    /**
     * Life cycle method of React componentDidMount
     */
    public componentDidMount() {
        ReactTextWrapper.updateCallback = (newState: State): void => {
            this.setState(newState);
            this.selectionManager = newState.selectionManager;
        }
    }

    /**
     * This is a function which returns JSX element when static text is present as suffix
     * @param stylesForDynamicSpan 
     */
    staticSuffix = (stylesForDynamicSpan): JSX.Element => {
        return (
            <>
                <span className="dynamicText"
                    style={stylesForDynamicSpan}>
                    {this.state.textValDynamic}
                </span>
                {this.state.staticShowColon && this.state.staticPostText &&
                    <span className="dynamicpluscolon"
                        style={{
                            fontSize: this.state.textFontSize,
                            color: this.state.textColor
                        }}>
                        :
                </span>}
                <span className="space"> </span>
                <span className="dynamicText"
                    style={{
                        fontSize: this.state.textFontSize,
                        color: this.state.textColor,
                        backgroundColor: this.state.staticShowTextHiglighted ? this.state.staticBackgroundcolor : "transparent",
                        fontFamily: this.state.staticFontFamily,
                        fontWeight: this.state.staticBoldStyle ? "bold" : "normal",
                        fontStyle: this.state.staticItalicStyle ? "italic" : "normal",
                        textDecoration: this.state.staticUnderlineStyle ? "underline" : "none"
                    }}>
                    {this.state.staticPostText}
                </span>
            </>
        )
    }

    /**
     * This is a function which returns JSX element when static text is present as prefix
     * @param stylesForDynamicSpan 
     */
    staticPrefix = (stylesForDynamicSpan): JSX.Element => {
        return (
            <>
                <span className="dynamicText"
                    style={{
                        fontSize: this.state.textFontSize,
                        color: this.state.textColor,
                        backgroundColor: this.state.staticShowTextHiglighted ? this.state.staticBackgroundcolor : "transparent",
                        fontFamily: this.state.staticFontFamily,
                        fontWeight: this.state.staticBoldStyle ? "bold" : "normal",
                        fontStyle: this.state.staticItalicStyle ? "italic" : "normal",
                        textDecoration: this.state.staticUnderlineStyle ? "underline" : "none"
                    }}>
                    {this.state.staticPostText}
                </span>
                {this.state.staticShowColon &&
                    this.state.staticPostText &&
                    <span className="dynamicpluscolon"
                        style={{
                            fontSize: this.state.textFontSize,
                            color: this.state.textColor
                        }}>
                        :
                </span>}
                <span className="space"> </span>
                <span className="dynamicText"
                    style={stylesForDynamicSpan}>
                    {this.state.textValDynamic}
                </span>
            </>
        )
    }
    /**
     * This function return styles for dynamic span
     */
    stylesForDynamicSpan = (): React.CSSProperties => {
        return ({
            fontSize: this.state.textFontSize,
            color: this.state.textColor,
            backgroundColor: this.state.dynamicShowTextHiglighted ? this.state.dynamicBackgroundcolor : "transparent",
            fontFamily: this.state.dynamicFontFamily,
            fontWeight: this.state.dynamicBoldStyle ? "bold" : "normal",
            fontStyle: this.state.dynamicItalicStyle ? "italic" : "normal",
            textDecoration: this.state.dynamicUnderlineStyle ? "underline" : "none"
        });
    }

    /**
     * This function return styles for error
     */
    stylesForError = (): React.CSSProperties => {
        return ({
            fontSize: this.state.textFontSize,
            color: "#777777",
            fontFamily: "Segoe UI Semibold"
        });
    }

    /**
     * This function will show context menu for the visual
     * @param e 
     */
    showContextMenuInVisual = (e) => {
        e.preventDefault();
        this.selectionManager.showContextMenu(this.ref.currentTarget, {
            x: e.clientX,
            y: e.clientY
        });
    }

    render(): JSX.Element {
        
        const staticContentStyle = this.state.classes.includes("errormsg") ?
            this.stylesForError() : this.stylesForDynamicSpan();

        const mainDivClass = this.state.classes + " mainDiv";

        return (
            <div className={mainDivClass}
                ref={this.ref}
                onContextMenu={this.showContextMenuInVisual}
                style={{
                    fontSize: this.state.textFontSize,
                    textAlign: this.state.textAlignment
                }}>
                {
                    this.state.staticTextPosition === this.constants.suffix ?
                        this.staticSuffix(staticContentStyle) :
                        this.staticPrefix(staticContentStyle)
                }
            </div >
        )
    }
}

export default ReactTextWrapper;