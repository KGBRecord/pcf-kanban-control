import { useMemo } from 'react'
import { IInputs } from '../generated/ManifestTypes'
import { isNullOrEmpty } from '../lib/utils'

interface Column {
    id: string
    key: string
    label: string
    title: string
    order: number
    records: { id: any; stageName: string }[]
}

export const useCollection = (context: ComponentFramework.Context<IInputs>) => {
    const raw = context.parameters.collection?.raw as string | undefined
    
    const records: any[] = useMemo(() => {
        if (isNullOrEmpty(raw)) return []
        try {
            const parsed = JSON.parse(raw?.replace(/""/g, '"')||"[]")
            return Array.isArray(parsed) ? parsed : []
        } catch(err) {
            console.log(err);
            
            return []
        }
    }, [raw])

    const orderCfgRaw = context.parameters.bpfStepsOptionsOrder?.raw as string | undefined

    const stepOrder: { id: string; order: number }[] = useMemo(() => {
        if (isNullOrEmpty(orderCfgRaw)) return []
        try {
            return JSON.parse(orderCfgRaw?.replace(/""/g, '"') || "[]")
        } catch {
            return []
        }
    }, [orderCfgRaw])

    const updateRecord = async (record: any) => Promise.resolve(record)

    const getBusinessProcessFlows = () => {
        const columnMap = new Map<string, Column>()
        records.forEach(rec => {
            const stage = rec.stageName ?? ''
            if (!stage) return
            if (!columnMap.has(stage)) {
                const cfg = stepOrder.find(o => o.id === stage)
                columnMap.set(stage, {
                    id: stage,
                    key: stage,
                    label: stage,
                    title: stage,
                    order: cfg ? cfg.order : 100,
                    records: [],
                })
            }
            columnMap.get(stage)!.records.push({ id: rec.id, stageName: stage })
        })
        if (columnMap.size === 0) return []
        const columns = Array.from(columnMap.values()).sort((a, b) => a.order - b.order)
        return [
            {
                key: 'bpf',
                text: 'Process',
                uniqueName: 'bpf',
                type: 'BPF',
                columns,
                records: columns.flatMap(c => c.records),
            },
        ]
    }

    const getOptionSets = () => {
        if (records.length === 0) return []
        const fieldNames = Object.keys(records[0]).filter(k => k !== 'id' && k !== 'stageName')
        const result = fieldNames.reduce((views: any[], field) => {
            const optionMap = new Map<any, any>()
            records.forEach(rec => {
                const v = rec[field]
                if (v && typeof v === 'object' && 'label' in v) {
                    const key = v.value ?? v.label
                    if (!optionMap.has(key)) {
                        optionMap.set(key, {
                            key,
                            id: key,
                            label: v.label,
                            title: v.label,
                            order: 100,
                        })
                    }
                }
            })
            if (optionMap.size > 0) {
                views.push({
                    key: field,
                    text: field,
                    uniqueName: field,
                    dataType: 'OptionSet',
                    columns: Array.from(optionMap.values()),
                })
            }
            return views
        }, [])
        return result
    }

    const getRecordCurrentStage = (id: any) => {
        const rec = records.find(r => r.id === id)
        return rec ? { id, stageName: rec.stageName ?? '' } : null
    }

    return {
        updateRecord,
        getBusinessProcessFlows,
        getOptionSets,
        getRecordCurrentStage,
        records,
    }
}
