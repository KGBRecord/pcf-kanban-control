import { useMemo } from 'react'
import { IInputs } from '../generated/ManifestTypes'

interface Column {
  id: string
  key: string
  label: string
  title: string
  order: number
  records: { id: any; stageName: string }[]
}

export const useCollection = (context: ComponentFramework.Context<IInputs>) => {
  let raw = context.parameters.collection?.raw as string | undefined
  const stepField = context.parameters.stepField?.raw as string | undefined
  let orderCfgRaw = context.parameters.bpfStepsOptionsOrder?.raw as string | undefined

  const replaceAll = (str: string, search: string, replacement: string) => {
    return str.split(search).join(replacement)
  }

  const records: any[] = useMemo(() => {
    if (typeof raw !== 'string' || raw.trim() === '') return []
    try {
      if (raw.includes(`\\"`)) {
        raw = JSON.parse(replaceAll(raw, '\\"', '"'))
      }
      const parsed = JSON.parse(raw || "[]")
      return Array.isArray(parsed) ? parsed : []
    } catch (err) {
      console.error('❌ Failed to parse collection:', err)
      return []
    }
  }, [raw])

  const stepOrder: { id: string; order: number }[] = useMemo(() => {
    if (!stepField || typeof orderCfgRaw !== 'string' || orderCfgRaw.trim() === '') return []
    try {
      if (orderCfgRaw.includes(`\\"`)) {
        orderCfgRaw = JSON.parse(replaceAll(orderCfgRaw, '\\"', '"'))
      }
      const parsed = JSON.parse(orderCfgRaw || "[]")
      if (!Array.isArray(parsed)) return []

      // ✅ Không lọc theo records
      return parsed.filter(
        (item: any) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.order === 'number'
      )
    } catch (err) {
      console.error('❌ Failed to parse stepOrder:', err)
      return []
    }
  }, [orderCfgRaw, stepField])

  const updateRecord = async (record: any) => Promise.resolve(record)

  const getBusinessProcessFlows = () => {
    if (!stepField) return []

    const columnMap = new Map<string, Column>()

    // ✅ Bước 1: Tạo column trống từ stepOrder trước
    for (const step of stepOrder) {
      columnMap.set(step.id, {
        id: step.id,
        key: step.id,
        label: step.id,
        title: step.id,
        order: step.order,
        records: [],
      })
    }

    // ✅ Bước 2: Duyệt records và nhét vào đúng column
    for (const rec of records) {
      const stepValue = rec?.[stepField]?.toString().trim() ?? ''
      if (!stepValue) continue

      if (!columnMap.has(stepValue)) {
        columnMap.set(stepValue, {
          id: stepValue,
          key: stepValue,
          label: stepValue,
          title: stepValue,
          order: 999, // fallback nếu không có trong stepOrder
          records: [],
        })
      }

      columnMap.get(stepValue)!.records.push({
        id: rec.id,
        stageName: stepValue,
      })
    }

    const columns = Array.from(columnMap.values()).sort((a, b) => {
      const aOrdered = a.order >= 0
      const bOrdered = b.order >= 0

      if (aOrdered && bOrdered) return a.order - b.order
      if (aOrdered) return -1
      if (bOrdered) return 1

      return a.title.localeCompare(b.title, 'vi', { sensitivity: 'base' })
    })

    return [
      {
        key: stepField,
        text: stepField,
        uniqueName: stepField,
        type: 'BPF',
        columns,
        records: columns.flatMap((c) => c.records),
      },
    ]
  }

  const getOptionSets = () => {
    if (records.length === 0) return []

    const optionViews: any[] = []
    const fields = Object.keys(records[0] ?? {}).filter(
      (k) => k !== 'id' && k !== stepField
    )

    for (const field of fields) {
      const optionMap = new Map<any, any>()

      for (const rec of records) {
        const val = rec[field]
        if (val && typeof val === 'object' && 'label' in val) {
          const key = val.value ?? val.label
          if (!optionMap.has(key)) {
            optionMap.set(key, {
              key,
              id: key,
              label: val.label,
              title: val.label,
              order: 100,
            })
          }
        }
      }

      if (optionMap.size > 0) {
        optionViews.push({
          key: field,
          text: field,
          uniqueName: field,
          dataType: 'OptionSet',
          columns: Array.from(optionMap.values()),
        })
      }
    }

    return optionViews
  }

  const getRecordCurrentStage = (id: any) => {
    if (!stepField) return null
    const rec = records.find((r) => r.id === id)
    const step = rec?.[stepField]?.toString().trim() ?? ''
    return rec ? { id, stageName: step } : null
  }

  return {
    records,
    updateRecord,
    getBusinessProcessFlows,
    getOptionSets,
    getRecordCurrentStage,
  }
}