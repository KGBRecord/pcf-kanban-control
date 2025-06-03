import { DropResult, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd";
import { ColumnItem, CardItem } from "../interfaces";

export const moveCard = async (columns: ColumnItem[], sourceCard: CardItem | undefined, result: DropResult) => {
  console.log("sourceCard", sourceCard);
  console.log("result", result);
  console.log("columns", columns);
  
  let copy = [...columns];

  const itemId = result.draggableId;
  const sourceColumn = columns.find(c => c.id == result.source.droppableId);
  const destinationColumn = columns.find(c => c.id == result.destination?.droppableId);
  const sourceColumnCardIndex = sourceColumn?.cards?.findIndex(i => String(i.id) === itemId);

  if (sourceColumnCardIndex !== undefined && sourceColumnCardIndex !== -1 && sourceCard) {
    copy = copy.map(col => {
      if (col.id === sourceColumn?.id) {
        return {
          ...col,
          cards: col.cards?.filter((_, index) => index !== sourceColumnCardIndex),
        };
      }
      return col;
    });

    return copy.map(col => {
      if (col.id === destinationColumn?.id) {
        return {
          ...col,
          cards: [
            ...col.cards?.slice(0, result.destination!.index) ?? [],
            sourceCard,
            ...col.cards?.slice(result.destination!.index) ?? [],
          ],
        };
      }
      return col;
    });
  }
}
// export const moveCard = async (
//   columns: ColumnItem[],
//   sourceCard: CardItem | undefined,
//   result: DropResult
// ) => {
//   console.log("📦 moveCard triggered")
//   console.log("➡️ sourceCard:", sourceCard)
//   console.log("➡️ result:", result)
//   console.log("➡️ columns:", columns)

//   let copy = [...columns]

//   const itemId = result.draggableId
//   console.log("🧷 itemId (draggableId):", itemId)

//   const sourceDroppableId = result.source?.droppableId
//   const destinationDroppableId = result.destination?.droppableId
//   const destinationIndex = result.destination?.index

//   console.log("📍 sourceDroppableId:", sourceDroppableId)
//   console.log("📍 destinationDroppableId:", destinationDroppableId)
//   console.log("📍 destinationIndex:", destinationIndex)

//   const sourceColumn = columns.find(c => String(c.id) === sourceDroppableId)
//   const destinationColumn = columns.find(c => String(c.id) === destinationDroppableId)

//   console.log("📂 sourceColumn:", sourceColumn)
//   console.log("📂 destinationColumn:", destinationColumn)

//   const sourceColumnCardIndex = sourceColumn?.cards?.findIndex(i => String(i.id) === itemId)
//   console.log("🔍 sourceColumnCardIndex:", sourceColumnCardIndex)

//   const canMove =
//     sourceColumnCardIndex !== undefined &&
//     sourceColumnCardIndex !== -1 &&
//     !!sourceCard &&
//     !!destinationColumn &&
//     destinationIndex !== undefined

//   console.log("✅ Can move:", canMove)

//   if (canMove) {
//     // Remove from source column
//     copy = copy.map(col => {
//       if (col.id === sourceColumn?.id) {
//         const filteredCards = col.cards?.filter((_, index) => index !== sourceColumnCardIndex)
//         console.log(`🗑 Removing card from sourceColumn ${col.id}, result:`, filteredCards)
//         return {
//           ...col,
//           cards: filteredCards,
//         }
//       }
//       return col
//     })

//     // Insert into destination column
//     const final = copy.map(col => {
//       if (col.id === destinationColumn?.id) {
//         const before = col.cards?.slice(0, destinationIndex) ?? []
//         const after = col.cards?.slice(destinationIndex) ?? []

//         const newCards = [...before, sourceCard, ...after]
//         console.log(`📥 Inserting card into destinationColumn ${col.id}, result:`, newCards)

//         return {
//           ...col,
//           cards: newCards,
//         }
//       }
//       return col
//     })

//     console.log("🎯 Final updated columns after move:", final)
//     return final
//   }

//   console.warn("⚠️ moveCard aborted: Conditions not met")
//   return columns
// }

export const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? 'rgba(206, 242, 206, 0.25)' : undefined,
  borderRadius: isDraggingOver ? 10 : 0,
});

export const getItemStyle = (snapshot: DraggableStateSnapshot, style?: DraggableStyle) => {
  if (!snapshot.isDragging || !snapshot.dropAnimation) {
    return style;
  }

  const { moveTo, curve, duration } = snapshot.dropAnimation;
  const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
  const scale = 'scale(0.90)';
  const rotate = 'rotate(-0.004turn)';

  return {
    ...style,
    transform: `${translate} ${scale} ${rotate}`,
    transition: `all ${curve} ${duration + 0.25}s`,
  };
};