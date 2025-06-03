import * as React from 'react'
import { useContext, useMemo } from 'react'
import { DragDropContext, DropResult, ResponderProvided } from '@hello-pangea/dnd'
import { CommandBar, Column } from '..'
import { BoardContext } from '../../context/board-context'
import { useDnD } from '../../hooks/useDnD'

const Board = () => {
  const { context, columns, activeView } = useContext(BoardContext)
  const { onDragEnd } = useDnD(columns)

  const handleCardDrag = async (result: DropResult, _resp: ResponderProvided) => {
    if (!result.destination || !activeView) return

    const field      = activeView.uniqueName
    const destId     = result.destination.droppableId
    const columnName = activeView.columns?.find(c => c.id === destId)?.title

    const record = {
      update: { [field as any]: destId === 'unallocated' ? null : destId },
      id:     result.draggableId,
      columnName,
    }

    await onDragEnd(result, record)
  }

  const hideViews = useMemo(
    () => context.parameters.hideViewBy?.raw,
    [context.parameters.hideViewBy],
  )

  return (
    <div className="main-container">
      {!hideViews && <CommandBar />}
      <div className="kanban-container">
        <div className="columns-wrapper">
          <DragDropContext onDragEnd={handleCardDrag}>
            {columns.map(col => (
              <Column key={col.id} column={col} />
            ))}
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}

export default Board