
import { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ExpenseForm } from './ExpenseForm';
import { MyContext } from '../../services/MyContext';
import { getRequest } from '../../services/axios';

const AddExpense = () => {

  const { categories, getAllCategories } = useContext(MyContext)

  const [state , setState] = useState({
    lastBalance : null,
  })

  const updateState = updates => setState( prev => ({...prev , ...updates }) )

  const getLatestBalance = (paymentMethod) => {
    const item = state.lastBalance?.find( item => item.payment_method === paymentMethod )
    return item?.current_balance || 0 ;
  };



  const fetchExpenses = () => {
    console.log('Refetching expenses...');
  };

  useEffect(()=>{
    if(!categories.length){
      getAllCategories()
    }
    getLatestBalanceForAll();
  },[])

  const getLatestBalanceForAll = async () =>{
    const res = await getRequest('/expenses/latestBalance');
    setState({ lastBalance : res })
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add a New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            getLatestBalance={getLatestBalance}
            fetchExpenses={fetchExpenses}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpense;