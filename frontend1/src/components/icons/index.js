import { lazy } from 'react';

// Lazy import Lucide icons
const Utensils = lazy(() => import('lucide-react').then(module => ({ default: module.Utensils })));
const Car = lazy(() => import('lucide-react').then(module => ({ default: module.Car })));
const Gamepad2 = lazy(() => import('lucide-react').then(module => ({ default: module.Gamepad2 })));
const Lightbulb = lazy(() => import('lucide-react').then(module => ({ default: module.Lightbulb })));
const Heart = lazy(() => import('lucide-react').then(module => ({ default: module.Heart })));
const ShoppingBag = lazy(() => import('lucide-react').then(module => ({ default: module.ShoppingBag })));
const GraduationCap = lazy(() => import('lucide-react').then(module => ({ default: module.GraduationCap })));
const Plane = lazy(() => import('lucide-react').then(module => ({ default: module.Plane })));
const Cigarette = lazy(() => import('lucide-react').then(module => ({ default: module.Cigarette })));
const Package = lazy(() => import('lucide-react').then(module => ({ default: module.Package })));
const CreditCard = lazy(() => import('lucide-react').then(module => ({ default: module.CreditCard })));
const Users = lazy(() => import('lucide-react').then(module => ({ default: module.Users })));
const DollarSign = lazy(() => import('lucide-react').then(module => ({ default: module.DollarSign })));

export const Icons = {
  food: {
    icon: Utensils,
    color: '#ff6b35'
  },
  transport: {
    icon: Car,
    color: '#4285f4'
  },
  entertainment: {
    icon: Gamepad2,
    color: '#9c27b0'
  },
  utilities: {
    icon: Lightbulb,
    color: '#ffc107'
  },
  healthcare: {
    icon: Heart,
    color: '#e91e63'
  },
  shopping: {
    icon: ShoppingBag,
    color: '#00bcd4'
  },
  education: {
    icon: GraduationCap,
    color: '#3f51b5'
  },
  travel: {
    icon: Plane,
    color: '#607d8b'
  },
  cig: {
    icon: Cigarette,
    color: '#795548'
  },
  other: {
    icon: Package,
    color: '#9e9e9e'
  },
  subscription: {
    icon: CreditCard,
    color: '#ff9800'
  },
  friend: {
    icon: Users,
    color: '#4caf50'
  },
  salary: {
    icon: DollarSign,
    color: '#2e7d32'
  },
};