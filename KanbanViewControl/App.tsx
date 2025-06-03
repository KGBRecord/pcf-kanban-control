import * as React from "react";
import { useEffect, useState } from "react";
import { IInputs } from "./generated/ManifestTypes";
import { Board } from "./components";
import { BoardContext } from "./context/board-context";
import { ColumnItem, ViewEntity } from "./interfaces";
import Loading from "./components/container/loading";
import { Toaster } from "react-hot-toast";
import { useCollection } from "./hooks/useCollection";

interface IProps {
  context: ComponentFramework.Context<IInputs>;
  notificationPosition:
    | "top-center"
    | "top-left"
    | "top-right"
    | "bottom-center"
    | "bottom-left"
    | "bottom-right";
  setDragResult: (val: string) => void; // ✅ thêm mới
  notifyOutputChanged: () => void;      // ✅ thêm mới
}

const App = ({ context, notificationPosition, setDragResult, notifyOutputChanged }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string | undefined>();
  const [activeViewEntity, setActiveViewEntity] = useState<ViewEntity | undefined>();

  const { records, getBusinessProcessFlows } = useCollection(context);

  const buildCards = (view: any) => {
    return records.map((rec: any) => {
      const step = view.records?.find((r: any) => r.id === rec.id)?.stageName ?? "";
      return {
        id: rec.id,
        column: step,
        ...rec,
      };
      const flat = flattenRecord(rec);
      return {
        ...flat,
        id: rec.id,
        column: step,
      };
    });
  };

  const flattenRecord = (rec: any): any => {
    const result: any = {};
    for (const key in rec) {
      const val = rec[key];
      if (val && typeof val === "object" && "label" in val) {
        result[key] = val.label;
      } else if (val && typeof val === "object" && "value" in val) {
        result[key] = val.value;
      } else {
        result[key] = val;
      }
    }
    return result;
  };

  const setupColumns = async () => {
    const [bpfView] = await getBusinessProcessFlows();
    if (!bpfView) {
      setIsLoading(false);
      return;
    }

    const cards = buildCards(bpfView);
    const cols = bpfView.columns.map((col) => ({
      ...col,
      cards: cards.filter((c) => c.column === col.id),
    }));

    setColumns(cols);
    setIsLoading(false);
  };

  useEffect(() => {
    setSelectedEntity("collection");
    setupColumns();
  }, [records]);

  if (isLoading) return <Loading />;

  return (
    <BoardContext.Provider
      value={{
        context,
        views: [],
        activeView: undefined,
        setActiveView: () => {},
        columns,
        setColumns,
        activeViewEntity,
        setActiveViewEntity,
        selectedEntity,
      }}
    >
      <Board
        context={context}
        setDragResult={setDragResult} // ✅ truyền xuống
        notifyOutputChanged={notifyOutputChanged}
      />
      <Toaster
        position={notificationPosition}
        reverseOrder={false}
        toastOptions={{
          style: { borderRadius: 4, padding: 16 },
          duration: 5000,
        }}
      />
    </BoardContext.Provider>
  );
};

export default App;