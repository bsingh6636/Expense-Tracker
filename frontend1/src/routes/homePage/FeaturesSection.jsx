import { CircleDollarSign, BarChart3, Target } from 'lucide-react';

const features = [
  {
    icon: <CircleDollarSign className="h-10 w-10 text-primary" />,
    title: 'Track Expenses Effortlessly',
    description: 'Quickly log every transaction on the go. Categorize your spending to see where your money is going.',
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: 'Visualize Your Spending',
    description: 'Interactive charts and graphs turn your data into powerful insights. Understand your financial habits at a glance.',
  },
  {
    icon: <Target className="h-10 w-10 text-primary" />,
    title: 'Set & Crush Budgets',
    description: 'Create monthly or category-based budgets to stay on track. We’ll notify you when you’re approaching your limits.',
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-muted py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h3 className="text-3xl font-bold md:text-4xl">
            Everything You Need to Succeed
          </h3>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed for simplicity and impact.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
                {feature.icon}
              </div>
              <h4 className="mb-2 text-xl font-semibold">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}