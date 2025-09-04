import { GoogleSheetsTable } from '@/components/google-sheets-table'

export default function GoogleSheetsPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 container mx-auto py-8 px-4 min-h-0 flex flex-col">
        <GoogleSheetsTable />
      </div>
    </div>
  )
}