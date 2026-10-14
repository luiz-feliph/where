/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from 'react'
import type { AppState } from '../domain/types'
import { createInitialState, LocalStorageImpl } from '../storage/LocalStorage'
import type { Storage } from '../storage/Storage'
import { appReducer, type Action } from './reducer'

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  storageWarning: boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({
  children,
  storage = new LocalStorageImpl(),
}: {
  children: React.ReactNode
  storage?: Storage
}) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => storage.load() ?? createInitialState())
  const warning = Boolean(storage.lastLoadHadError)

  useEffect(() => {
    storage.save(state)
  }, [state, storage])

  return <AppContext.Provider value={{ state, dispatch, storageWarning: warning }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
