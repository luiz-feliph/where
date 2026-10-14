import { useState } from 'react'
import { AppProvider, useApp } from './state/context'
import { Onboarding } from './ui/pages/Onboarding'
import { SettingsPage } from './ui/pages/Settings'
import { Categories } from './ui/pages/Categories'
import { TopBar } from './ui/components/TopBar/TopBar'
import { EntryTable } from './ui/components/EntryTable/EntryTable'
import { EntryForm } from './ui/components/EntryForm/EntryForm'
import { Dashboard } from './ui/components/Dashboard/Dashboard'
import { filterEntriesByMonth, sortEntriesByDate } from './domain/month'
import type { Entry } from './domain/types'

type Page = 'dashboard' | 'categories' | 'settings'

function AppShell() {
  const { state, dispatch, storageWarning } = useApp()
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth() + 1)
  const [page, setPage] = useState<Page>('dashboard')
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<Entry | null>(null)

  if (!state.settings) {
    return (
      <>
        {storageWarning && (
          <p role="alert" className="storage-warning">
            Your saved data could not be read and was reset.
          </p>
        )}
        <Onboarding />
      </>
    )
  }

  const monthEntries = sortEntriesByDate(filterEntriesByMonth(state.entries, year, month)) as Entry[]

  function openCreate() {
    setEditingEntry(null)
    setFormOpen(true)
  }

  function handleSave(entry: Entry) {
    if (editingEntry) {
      dispatch({ type: 'UPDATE_ENTRY', payload: entry })
    } else {
      dispatch({ type: 'ADD_ENTRY', payload: entry })
    }
    setFormOpen(false)
    setEditingEntry(null)
  }

  return (
    <div className="app">
      {storageWarning && (
        <p role="alert" className="storage-warning">
          Your saved data could not be read and was reset.
        </p>
      )}
      <TopBar
        year={year}
        month={month}
        onYearChange={setYear}
        onMonthChange={setMonth}
        currentPage={page}
        onNavigate={setPage}
      />
      <main className="content">
        {page === 'settings' ? (
          <SettingsPage />
        ) : page === 'categories' ? (
          <Categories />
        ) : (
          <>
            <section className="entries">
              <div className="entries-header">
                <h2>Entries</h2>
                <button type="button" className="btn primary" onClick={openCreate}>
                  + New entry
                </button>
              </div>
              <EntryTable
                entries={monthEntries}
                categories={state.categories}
                settings={state.settings}
                unit={state.conversionUnit}
                onEdit={(entry) => {
                  setEditingEntry(entry)
                  setFormOpen(true)
                }}
                onDelete={(entry) => setDeletingEntry(entry)}
              />
            </section>
            <Dashboard
              entries={state.entries}
              categories={state.categories}
              settings={state.settings}
              year={year}
              month={month}
              unit={state.conversionUnit}
            />
          </>
        )}
      </main>

      {page === 'dashboard' && (
        <button type="button" className="fab" aria-label="New entry" onClick={openCreate}>
          +
        </button>
      )}

      {formOpen && (
        <EntryForm
          entry={editingEntry}
          categories={state.categories}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false)
            setEditingEntry(null)
          }}
        />
      )}

      {deletingEntry && (
        <div className="modal-backdrop" onClick={() => setDeletingEntry(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>Delete entry?</h2>
            <p>“{deletingEntry.description}” will be removed.</p>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setDeletingEntry(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={() => {
                  dispatch({ type: 'DELETE_ENTRY', payload: { id: deletingEntry.id } })
                  setDeletingEntry(null)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

export default App
