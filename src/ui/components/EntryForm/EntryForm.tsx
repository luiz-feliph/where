import { useState } from 'react'
import type { Category, Entry } from '../../../domain/types'
import { parseBRLToReais, formatBRL } from '../../../domain/formatting'
import { validateEntry } from '../../../domain/validation'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['common', 'validation'])
  const [description, setDescription] = useState(entry?.description ?? '')
  const [amount, setAmount] = useState(entry ? entry.amount.toFixed(2).replace('.', ',') : '')
  const [date, setDate] = useState(entry?.date ?? todayISO())
  const [categoryId, setCategoryId] = useState(entry?.categoryId ?? categories[0]?.id ?? '')
  const [type, setType] = useState<Entry['type']>(entry?.type ?? 'expense')
  const [errors, setErrors] = useState<string[]>([])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amountValue = parseBRLToReais(amount)
    const errs = validateEntry({ description, amount: amountValue, date, categoryId })
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    onSave({
      id: entry?.id ?? crypto.randomUUID(),
      description: description.trim(),
      amount: amountValue,
      date,
      categoryId,
      type,
    })
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>{entry ? t('common:edit') : t('common:newEntry')}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            {t('common:description')}
            <input aria-label={t('common:description')} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            {t('common:price')} (R$)
            <input aria-label={t('common:price')} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0,00" />
          </label>
          <label>
            {t('common:date')}
            <input type="date" aria-label={t('common:date')} value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            {t('common:category')}
            <select aria-label={t('common:category')} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            {t('common:transactionType')}
            <select aria-label={t('common:transactionType')} value={type} onChange={(e) => setType(e.target.value as Entry['type'])}>
              <option value="expense">{t('common:expense')}</option>
              <option value="income">{t('common:income')}</option>
            </select>
          </label>
          {errors.length > 0 && (
            <ul role="alert" className="errors">
              {errors.map((err) => <li key={err}>{t(err)}</li>)}
            </ul>
          )}
          {amount && parseBRLToReais(amount) > 0 && (
            <p className="preview">= {formatBRL(parseBRLToReais(amount))}</p>
          )}
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onCancel}>{t('common:cancel')}</button>
            <button type="submit" className="btn primary">{t('common:save')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
