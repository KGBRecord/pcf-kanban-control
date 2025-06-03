import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import App from "./App";

export class KanbanViewControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private _context!: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged!: () => void;
    private _dragResult: string = ""; // 🔥 Biến lưu output

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        _: ComponentFramework.Dictionary
    ): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        context.mode.trackContainerResize(true);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this._context = context;

        return React.createElement(App, {
            context: this._context,
            notificationPosition: context.parameters.notificationPosition?.raw,
            setDragResult: (val: string) => {
                this._dragResult = val;
                this._notifyOutputChanged();
            },
            notifyOutputChanged: this._notifyOutputChanged
        });
    }

    public getOutputs(): IOutputs {
        return {
            dragResult: this._dragResult // 🔥 Trả ra output
        };
    }

    public destroy(): void { }
}