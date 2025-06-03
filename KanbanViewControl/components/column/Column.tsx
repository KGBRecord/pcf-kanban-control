import * as React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Card from "../card/Card";
import ColumnHeader from "./ColumnHeader";
import { ColumnItem } from "../../interfaces";
import { isNullOrEmpty } from "../../lib/utils";
import NoResults from "../container/no-results";
import { getItemStyle, getListStyle } from "../../lib/card-drag";

const Column = ({ column }: { column: ColumnItem }) => {
  console.log(column.cards);
  
  return (
    <div
      className="column-container"
      style={{
        width: "fit-content",
        minWidth: 240,
        maxWidth: 360,
        flexShrink: 0,
      }}
    >
      <ColumnHeader column={column} />
      <Droppable key={column.id.toString()} droppableId={column.id.toString()}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className="cards-wrapper"
            style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            {!isNullOrEmpty(column.cards) &&
              column.cards!.length > 0 &&
              column.cards?.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot,
                        provided.draggableProps.style
                      )}
                    >
                      <Card key={item.id} item={item} />
                    </div>
                  )}
                </Draggable>
              ))}
            {isNullOrEmpty(column.cards) ||
              (column.cards!.length <= 0 && <NoResults />)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
