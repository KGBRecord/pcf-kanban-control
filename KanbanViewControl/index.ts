import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import App from "./App";

export class KanbanViewControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private _context!: ComponentFramework.Context<IInputs>;
    private notifyOutputChanged!: () => void;
    private _dragResult: string = ""; 

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        _: ComponentFramework.Dictionary
    ): void {
        this._context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        context.mode.trackContainerResize(true);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this._context = context;

        return React.createElement(App, {
            context: this._context,
            notificationPosition: context.parameters.notificationPosition?.raw,
            triggerOnChange: (val: string) => {
                console.log("Trigger on change", val);
                this._dragResult = val;
                this.notifyOutputChanged();
            },
            notifyOutputChanged: this.notifyOutputChanged
        });
    }

    public getOutputs(): IOutputs {
        console.log("🚀 Output sent:", this._dragResult)
        return {
            dragResult: this._dragResult 
        };
    }

    public destroy(): void { }
}