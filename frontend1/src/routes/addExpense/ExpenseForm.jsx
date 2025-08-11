import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronsUpDown, Loader2 } from 'lucide-react';

import { createExpense, getFriends } from '../../services/api';

import { cn } from '../../utils/lib';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../components/ui/command';
import { Calendar } from '../../components/ui/calendar';
import { paymentMethodsArray, transactionTypeArray } from '../../components/constants';
import SelectSearch from '../../components/ui/select-search';

const initialFormData = {
  amount: '',
  description: '',
  categoryId: 9,
  date: new Date(),
  payment_method: 'upi',
  txn_type: 'debit',
  friendId: null,
  balance: 0,
};

const FormMessage = ({ children }) => {
  if (!children) return null;
  return <p className="text-sm font-medium text-destructive mt-2">{children}</p>;
};

export const ExpenseForm = ({ getLatestBalance, fetchExpenses, categories }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [friends, setFriends] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.categoryId === 12 && !friends.length) {
      getFriends().then(setFriends);
    }
  }, [formData.categoryId, friends.length]);

  useEffect(() => {
    if (!formData.payment_method || !formData.amount) {
        return;
    };
    
    const latestBalance = getLatestBalance(formData.payment_method);
    const amountValue = parseFloat(formData.amount) || 0;
    const updatedBalance = Number(latestBalance) + (formData.txn_type === 'credit' ? amountValue : -amountValue);
    
    setFormData(prev => ({ ...prev, balance: updatedBalance }));
  }, [formData.payment_method, formData.amount, formData.txn_type, getLatestBalance]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Simple validation logic that runs before submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required.';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number.';
    }
    if (!formData.date) {
      newErrors.date = 'A date is required.';
    }
    if (formData.categoryId === 12 && !formData.friendId) {
        newErrors.friendId = 'Please select a friend.';
    }
    return newErrors;
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Format data for the API, converting date to 'YYYY-MM-DD' string
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString().slice(0, 10), // Native JS way to get 'YYYY-MM-DD'
      };
      
      await createExpense(expenseData);
      fetchExpenses(); // Refresh the expenses list
      setFormData(initialFormData); // Reset form to initial state
    } catch (err) {
      console.error('Error saving expense:', err);
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Form Error */}
      <FormMessage>{errors.form}</FormMessage>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleFieldChange('amount', e.target.value)}
          />
          <FormMessage>{errors.amount}</FormMessage>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !formData.date && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? formData.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => handleFieldChange('date', date)}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage>{errors.date}</FormMessage>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="e.g., Lunch with team"
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />
        <FormMessage>{errors.description}</FormMessage>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select onValueChange={(value) => handleFieldChange('payment_method', value)} value={formData.payment_method}>
            <SelectTrigger><SelectValue placeholder="Select a method" /></SelectTrigger>
            <SelectContent>
              {paymentMethodsArray.map((method) => (
                <SelectItem key={method.value} value={method.value}>{method.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Type */}
        <div className="space-y-2">
          <Label>Transaction Type</Label>
          <Select onValueChange={(value) => handleFieldChange('txn_type', value)} value={formData.txn_type}>
            <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
            <SelectContent>
              {transactionTypeArray.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="space-y-2">
              <SelectSearch options={categories} onChange={v => handleFieldChange('categoryId', v?.id) } value={formData.categoryId} />
        </div>

        {formData.categoryId === 12 && (
          <div className="space-y-2">
            <Label>Friend</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className={cn("w-full justify-between", !formData.friendId && "text-muted-foreground")}>
                  {formData.friendId ? friends.find(f => f.id === formData.friendId)?.name : "Select friend"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search friend..." />
                  <CommandEmpty>No friend found.</CommandEmpty>
                  <CommandGroup>
                    {friends.map((friend) => (
                      <CommandItem value={friend.name} key={friend.id} onSelect={() => handleFieldChange('friendId', friend.id)}>
                        {friend.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage>{errors.friendId}</FormMessage>
          </div>
        )}
      </div>
      
      {/* Resulting Balance (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="balance">Resulting Balance</Label>
        <Input
          id="balance"
          type='number'
          value={formData.balance}
          className="font-medium text-foreground"
          onChange={ e => handleFieldChange('balance', e.target.value) }
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Saving...' : 'Add Expense'}
      </Button>
    </form>
  );
};