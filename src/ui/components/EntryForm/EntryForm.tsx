import { useState } from 'react'
import type { Category, Entry } from '../../../domain/types'
import { parseBRLStringToCents, formatBRL } from '../../../domain/formatting'
import { validateEntry } from '../../../domain/validation'

function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function EntryForm({
  entry,
  categories,
  onSave,
  onCancel,
}: {
  entry: Entry | null
  categories: Category[]
  onSave: (entry: Entry) => void
  onCancel: () => void
}) {
  const [description, setDescription] = useState(entry?.description ?? '')
  const [amount, setAmount] = useState(entry ? (entry.amountCents / 100).toFixed(2) : '')
  const [date, setDate] = useState(entry?.date ?? todayISO())
  const [categoryId, setCategoryId] = useState(entry?.categoryId ?? categories[0]?.id ?? '')
  const [type, setType] = useState<Entry['type']>(entry?.type ?? 'expense')
  const [errors, setErrors] = useState<string[]>([])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amountCents = parseBRLStringToCents(amount)
    const errs = validateEntry({ description, amountCents, date, categoryId })
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    onSave({
      id: entry?.id ?? crypto.randomUUID(),
      description: description.trim(),
      amountCents,
      date,
      categoryId,
      type,
    })
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>{entry ? 'Edit entry' : 'New entry'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Description
            <input aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            Price (R$)
            <input aria-label="Price (R$)" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0.00" />
          </label>
          <label>
            Date
            <input type="date" aria-label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            Category
            <select aria-label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            Transaction Type
            <select aria-label="Transaction Type" value={type} onChange={(e) => setType(e.target.value as Entry['type'])}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          {errors.length > 0 && (
            <ul role="alert" className="errors">
              {errors.map((err) => <li key={err}>{err}</li>)}
            </ul>
          )}
          {amount && parseBRLStringToCents(amount) > 0 && (
            <p className="preview">= {formatBRL(parseBRLStringToCents(amount))}</p>
          )}
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
