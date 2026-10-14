import { describe, it, expect } from 'vitest'
import ExcelJS from 'exceljs'
import { buildMonthSheets } from '../sheets'
import { buildWorkbookBuffer } from '../exportXlsx'
import type { AppState } from '../../domain/types'

const state: AppState = {
  schemaVersion: 1,
  settings: { monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17 },
  categories: [
    { id: 'c1', name: 'Food & Drinks', color: '#FF6B6B' },
    { id: 'c2', name: 'Investment', color: '#FFD700' },
  ],
  entries: [
    { id: 'e1', date: '2026-01-02', description: 'Lunch', categoryId: 'c1', amountCents: 37500, type: 'expense' },
    { id: 'e2', date: '2026-01-03', description: 'Salary', categoryId: 'c2', amountCents: 500000, type: 'income' },
    { id: 'e3', date: '2026-02-01', description: 'Fund', categoryId: 'c2', amountCents: 10000, type: 'expense' },
  ],
  conversionUnit: 'hours',
}

describe('buildMonthSheets', () => {
  it('groups entries by month and sorts by date ascending', () => {
    const sheets = buildMonthSheets(state)
    expect(sheets.map((s) => s.sheetName)).toEqual(['2026-01 January', '2026-02 February'])
    expect(sheets[0].rows[0].date).toBe('2026-01-02')
    expect(sheets[0].rows[1].date).toBe('2026-01-03')
  })

  it('computes conversions for expenses and zero for incomes', () => {
    const sheets = buildMonthSheets(state)
    const jan = sheets[0]
    const lunch = jan.rows.find((r) => r.description === 'Lunch')!
    const salary = jan.rows.find((r) => r.description === 'Salary')!
    expect(lunch.hours).toBeCloseTo(21.6666667, 6)
    expect(lunch.workdays).toBeCloseTo(1.2745098, 6)
    expect(salary.hours).toBe(0)
    expect(salary.workdays).toBe(0)
  })
})

describe('buildWorkbookBuffer', () => {
  it('creates one worksheet per month with numeric BRL price cells', async () => {
    const buffer = await buildWorkbookBuffer(state)
    const wb = new ExcelJS.Workbook()
    await wb.xlsx.load(buffer)
    expect(wb.worksheets.length).toBe(2)
    const jan = wb.getWorksheet('2026-01 January')
    expect(jan).toBeDefined()
    const headers = (jan!.getRow(1).values as unknown[]).slice(1)
    expect(headers).toEqual(['Date', 'Description', 'Category', 'Price', 'Transaction Type', 'Hours', 'Workdays'])
    const priceCell = jan!.getRow(2).getCell(4)
    expect(typeof priceCell.value).toBe('number')
    expect(priceCell.numFmt || jan!.getColumn('price').numFmt).toBe('R$ #,##0.00')
  })
})
