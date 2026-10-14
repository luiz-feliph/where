import { useState } from 'react'
import { useApp } from '../../state/context'
import { validateCategoryName } from '../../domain/validation'
import type { Category } from '../../domain/types'

export function Categories() {
  const { state, dispatch } = useApp()
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [reassignToId, setReassignToId] = useState('')

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const existing = state.categories.map((c) => c.name)
    const errs = validateCategoryName(newName, existing)
    if (errs.length > 0) {
      setError(errs[0])
      return
    }
    dispatch({ type: 'ADD_CATEGORY', payload: { id: crypto.randomUUID(), name: newName.trim(), color: '' } })
    setNewName('')
    setError('')
  }

  function startDelete(cat: Category) {
    const other = state.categories.find((c) => c.id !== cat.id)
    setDeleting(cat)
    setReassignToId(other?.id ?? '')
  }

  function confirmDelete() {
    if (!deleting) return
    if (state.categories.length <= 1) return
    dispatch({ type: 'DELETE_CATEGORY', payload: { id: deleting.id, reassignToId } })
    setDeleting(null)
  }

  return (
    <section className="categories-page">
      <h2>Categories</h2>
      <form onSubmit={handleCreate} className="category-create" noValidate>
        <input
          aria-label="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category"
        />
        <button type="submit" className="btn primary">Add</button>
      </form>
      {error && <p role="alert" className="errors">{error}</p>}

      <ul className="category-list">
        {state.categories.map((cat) => (
          <li key={cat.id} className="category-row">
            {editing?.id === cat.id ? (
              <RenameForm
                category={cat}
                onCancel={() => setEditing(null)}
                onSave={(name) => {
                  const existing = state.categories.filter((c) => c.id !== cat.id).map((c) => c.name)
                  if (validateCategoryName(name, existing).length > 0) return
                  dispatch({ type: 'UPDATE_CATEGORY', payload: { ...cat, name: name.trim() } })
                  setEditing(null)
                }}
              />
            ) : (
              <>
                <span className="swatch" style={{ background: cat.color }} aria-hidden="true" />
                <span className="category-name">{cat.name}</span>
                <input
                  type="color"
                  aria-label={`Color for ${cat.name}`}
                  value={cat.color}
                  onChange={(e) => dispatch({ type: 'UPDATE_CATEGORY', payload: { ...cat, color: e.target.value } })}
                />
                <button type="button" onClick={() => { setEditing(cat); setError('') }}>Rename</button>
                <button type="button" onClick={() => startDelete(cat)} disabled={state.categories.length <= 1}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {deleting && (
        <div className="modal-backdrop" onClick={() => setDeleting(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>Delete “{deleting.name}”?</h3>
            <p>Reassign its entries to:</p>
            <select aria-label="Reassign to" value={reassignToId} onChange={(e) => setReassignToId(e.target.value)}>
              {state.categories.filter((c) => c.id !== deleting.id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setDeleting(null)}>Cancel</button>
              <button type="button" className="btn danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function RenameForm({
  category,
  onSave,
  onCancel,
}: {
  category: Category
  onSave: (name: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(category.name)
  const { state } = useApp()
  const [error, setError] = useState('')
  return (
    <form
      className="rename-form"
      onSubmit={(e) => {
        e.preventDefault()
        const existing = state.categories.filter((c) => c.id !== category.id).map((c) => c.name)
        const errs = validateCategoryName(name, existing)
        if (errs.length > 0) {
          setError(errs[0])
          return
        }
        onSave(name)
      }}
      noValidate
    >
      <input aria-label={`Rename ${category.name}`} value={name} onChange={(e) => setName(e.target.value)} />
      {error && <span role="alert" className="errors">{error}</span>}
      <button type="submit" className="btn primary">Save</button>
      <button type="button" className="btn" onClick={onCancel}>Cancel</button>
    </form>
  )
}
