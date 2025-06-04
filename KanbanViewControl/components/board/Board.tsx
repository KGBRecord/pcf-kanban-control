import * as React from "react";
import { useContext, useState } from "react";
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
} from "@hello-pangea/dnd";
import { Column } from "..";
import { BoardContext } from "../../context/board-context";
import { useDnD } from "../../hooks/useDnD";

const Board = (props: any) => {
  const { context, columns } = useContext(BoardContext);
  // const [dragResult, triggerOnChange] = useState<string>("");

  const stepField = context.parameters.stepField?.raw;

  // Truyền triggerOnChange và notifyOutputChanged vào useDnD
  const { onDragEnd } = useDnD(columns, props.triggerOnChange, props.notifyOutputChanged);

  const handleCardDrag = async (
    result: DropResult,
    _resp: ResponderProvided
  ) => {
    if (!result.destination || !stepField) return;

    const destId = result.destination.droppableId;

    const record = {
      update: { [stepField]: destId === "unallocated" ? null : destId },
      id: result.draggableId,
      columnName: destId,
    };

    await onDragEnd(result, record);
  };

  return (
    <div className="main-container">
      <div className="kanban-container">
        <div
          className="columns-wrapper"
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            overflowX: "auto",
          }}
        >
          <DragDropContext onDragEnd={handleCardDrag}>
            {columns.map((col) => (
              <Column key={col.id} column={col} triggerOnChange={props.triggerOnChange} />
            ))}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default Board;