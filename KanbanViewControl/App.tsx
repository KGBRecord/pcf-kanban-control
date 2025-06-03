import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { IInputs } from "./generated/ManifestTypes";
import { Board } from "./components";
import { BoardContext } from "./context/board-context";
import { ColumnItem, ViewEntity, ViewItem } from "./interfaces";
import Loading from "./components/container/loading";
import { Toaster } from "react-hot-toast";
import { unlocatedColumn } from "./lib/constants";
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
}

const App = ({ context, notificationPosition }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewItem | undefined>();
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [views, setViews] = useState<ViewItem[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string | undefined>();
  const [activeViewEntity, setActiveViewEntity] = useState<
    ViewEntity | undefined
  >();

  const { records, getOptionSets, getBusinessProcessFlows } =
    useCollection(context);

  const filterRecords = (view: ViewItem) =>
    records.map((rec: any) => {
      let col: any = "";
      if (view.type === "BPF") {
        col = view.records?.find((r) => r.id === rec.id)?.stageName ?? "";
      } else {
        const match = view.columns?.find((c) => c.title === rec[view.key]);
        col = match ? match.id : "unallocated";
      }
      
      return { id: rec.id, column: col, ...rec };
    });

  const handleViewChange = () => {
    if (!activeView || !activeView.columns) return;
    const cards = filterRecords(activeView);
    console.log(cards);
    
    let activeCols = activeView.columns;
    if (
      activeView.type !== "BPF" &&
      (cards.some((c) => !(activeView.key in c)) ||
        cards.some((c) => c[activeView.key] === ""))
    )
      activeCols = [unlocatedColumn, ...activeCols];
    const cols = activeCols.map((col) => ({
      ...col,
      cards: cards.filter((c) => c.column === col.id),
    }));
    setColumns(cols);
  };

  const handleColumnsChange = async () => {
    const optionViews = await getOptionSets();
    const processViews = await getBusinessProcessFlows();
    const allViews = [...(optionViews ?? []), ...(processViews ?? [])];
    setViews(allViews);
    const defView = context.parameters.defaultView?.raw;
    if (defView) {
      setActiveView(allViews.find((v) => v.text === defView) ?? allViews[0]);
    } else if (activeView) {
      setActiveView(allViews.find((v) => v.key === activeView.key));
    } else {
      setActiveView(allViews[0]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setSelectedEntity("collection");
    handleColumnsChange();
  }, [records]);

  useEffect(handleViewChange, [activeView]);

  if (isLoading) return <Loading />;

  return (
    <BoardContext.Provider
      value={{
        context,
        views,
        activeView,
        setActiveView,
        columns,
        setColumns,
        activeViewEntity,
        setActiveViewEntity,
        selectedEntity,
      }}
    >
      <Board />
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
