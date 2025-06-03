import { useContext } from 'react'
import toast from 'react-hot-toast'
import { DropResult } from '@hello-pangea/dnd'
import { CardInfo, ColumnItem } from '../interfaces'
import { useCollection } from './useCollection'
import { BoardContext } from '../context/board-context'
import { useNavigation } from './useNavigation'
import { moveCard } from '../lib/card-drag'

export type ColumnId = ColumnItem[][number]['id']

export const useDnD = (
  columns: ColumnItem[],
  setDragResult: (val: string) => void,
  notifyOutputChanged: () => void,
) => {
  const { context, activeView, setColumns } = useContext(BoardContext)
  const { updateRecord } = useCollection(context)
  const { openForm } = useNavigation(context)

  const onDragEnd = async (result: DropResult, record: any) => {
    if (!result.destination) return

    if (activeView?.type === 'BPF') {
      try {
        await openForm(record.entityName, record.id)
      } catch (e: any) {
        toast.error(e.message)
      }
      return
    }

    const itemId = result.draggableId
    const sourceColumn = columns.find(c => c.id === result.source.droppableId)
    const destinationColumn = columns.find(c => c.id === result.destination?.droppableId)



    const sourceCard = sourceColumn?.cards?.find(i => String(i.id) === itemId)


    let movedCards = await moveCard(columns, sourceCard, result)
    setColumns(movedCards ?? [])

    const response = await toast.promise(updateRecord(record), {
      loading: 'Saving...',
      success: `Successfully moved to ${record.columnName ?? 'Unallocated'} 🎉`,
      error: (e: any) => e.message,
    })

    if (!response) {
      const oldVal = sourceColumn?.title
        ; (sourceCard![Object.keys(record.update)[0]] as CardInfo).value = oldVal as string
      movedCards = await moveCard(columns, sourceCard, result)
    } else {
      const newVal = destinationColumn?.title

      const fieldKey = Object.keys(record.update)[0]

      if (sourceCard) {
        let cardField = sourceCard[fieldKey] as string


        cardField = newVal as string

      } else {
        console.warn('⚠️ sourceCard là undefined')
      }
      movedCards = await moveCard(columns, sourceCard, result)

      setDragResult(`${sourceCard?.id}#${newVal}`)
      // notifyOutputChanged()
    }

    setColumns(movedCards ?? [])
    return movedCards
  }

  return { onDragEnd }
}