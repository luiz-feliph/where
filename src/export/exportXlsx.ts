import ExcelJS from 'exceljs'
import type { AppState } from '../domain/types'
import { buildMonthSheets } from './sheets'

const BRL_NUMBER_FORMAT = 'R$ #,##0.00'

export async function buildWorkbook(state: AppState): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook()
  const sheets = buildMonthSheets(state)

  for (const { sheetName, rows } of sheets) {
    const worksheet = workbook.addWorksheet(sheetName)
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Category', key: 'category', width: 18 },
      { header: 'Price', key: 'price', width: 14 },
      { header: 'Transaction Type', key: 'type', width: 18 },
      { header: 'Hours', key: 'hours', width: 12 },
      { header: 'Workdays', key: 'workdays', width: 12 },
    ]
    for (const row of rows) {
      worksheet.addRow({
        date: row.date,
        description: row.description,
        category: row.category,
        price: row.priceCents / 100,
        type: row.transactionType,
        hours: row.hours,
        workdays: row.workdays,
      })
    }
    worksheet.getColumn('price').numFmt = BRL_NUMBER_FORMAT
  }

  return workbook
}

export async function buildWorkbookBuffer(state: AppState): Promise<ArrayBuffer> {
  const workbook = await buildWorkbook(state)
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer as ArrayBuffer
}

export async function downloadExport(state: AppState): Promise<void> {
  const buffer = await buildWorkbookBuffer(state)
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'where-export.xlsx'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
