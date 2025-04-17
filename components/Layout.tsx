//components/Layout.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-slate-900 text-white p-4">
        <h1 className="text-2xl font-bold">Text Editor PWA</h1>
      </header>
      <main className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </main>
    </div>
  );
}