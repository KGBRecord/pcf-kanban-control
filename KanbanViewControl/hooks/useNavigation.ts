import { IInputs } from '../generated/ManifestTypes'

/**
 * In a Canvas-only version we no longer have Dataverse pages to
 * open.  These helpers therefore become safe no-op stubs that keep
 * the existing API surface (so the rest of the code compiles).
 */
export const useNavigation = (_context: ComponentFramework.Context<IInputs>) => {
  /** No-op – return resolved promise so caller can await safely */
  const openForm = async (_entityName?: string, _id?: string): Promise<void> =>
    Promise.resolve()

  const createNewRecord = async (): Promise<void> => Promise.resolve()

  return { openForm, createNewRecord }
}