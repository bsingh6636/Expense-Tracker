import { Button } from "../../components/ui/button";


export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          Take Control of Your Finances
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          ExpenseWise helps you track your spending, visualize your habits, and
          achieve your financial goals with ease. Stop guessing, start knowing.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Get Started for Free</Button>
        </div>
      </div>
    </section>
  );
}