import Link from 'next/link';
import { Bot, Edit3, FileText, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-1 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Create Forms with the Power of AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Describe your form in plain English, and let FormifyAI generate it for you in seconds. No more tedious drag-and-drop.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Start Building for Free
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                 <div className="absolute w-72 h-72 bg-accent rounded-full -z-10 blur-3xl opacity-30"></div>
                 <Bot className="w-64 h-64 text-primary" strokeWidth={1}/>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">The Future of Form Building is Here</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Leverage artificial intelligence to streamline your data collection process. From simple surveys to complex registration forms, do it all with unprecedented speed.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline"><Bot className="w-8 h-8 text-primary" /> AI-Powered Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Simply describe the form you need. Our AI understands your requirements and generates a complete, ready-to-use form schema.</p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline"><Edit3 className="w-8 h-8 text-primary" /> Dynamic Rendering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your generated schema is instantly rendered into a beautiful, responsive, and user-friendly form.</p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline"><CheckSquare className="w-8 h-8 text-primary" /> Submission Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Collect and view submissions seamlessly. All your data is organized and easily accessible from your dashboard.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 FormifyAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
