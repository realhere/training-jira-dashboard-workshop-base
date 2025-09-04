import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Jira Dashboard</Button>
            </Link>
            <Link href="/google-sheets">
              <Button variant="ghost">Google Sheets Table</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}