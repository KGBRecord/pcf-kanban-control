import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import App from "./App";

export class KanbanViewControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private control: ComponentFramework.ReactControl<IInputs, IOutputs>;

    constructor() { }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        _: ComponentFramework.Dictionary
    ): void {
        context.mode.trackContainerResize(true);
    }


    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
    return React.createElement(App, { 
        context,  
        notificationPosition: context.parameters.notificationPosition?.raw
    });
    }

    // public updateView(ctx: ComponentFramework.Context<IInputs>): React.ReactElement {
    //     console.info("[PCF] updateView");        // đã thấy
    //     return React.createElement("div",
    //         { style: { padding: 12, background: "lightgreen" } },
    //         "HELLO FROM PCF");
    // }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        this.control.destroy()
    }
}

