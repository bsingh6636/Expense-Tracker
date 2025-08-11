import { WalletMinimal } from 'lucide-react';
import { Button } from '../../components/ui/button';


export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <WalletMinimal className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">ExpenseWise</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="outline">Login</Button>
          <Button>Sign Up</Button>
        </nav>
      </div>
    </header>
  );
}