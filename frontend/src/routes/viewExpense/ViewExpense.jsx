import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { MyContext } from "../../services/MyContext";
import { formatDateYYYYMMDD } from "../../utils/date";
import { Button } from "../../components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, ListFilter } from "lucide-react";
import Filter from "./Filter";
import { Icons } from "../../components/icons";
import { getRequest } from "../../services/axios";


const defaultFilter = {
  category: [],
  friends: []
}

const ViewExpense = ({ }) => {

  const { getAllCategories, categories, getAllFriends, friends } = useContext(MyContext)

  const [expense, setExpense] = useState({
    list: [],
    filteredExpenses: [],
  })

  const [filter, setFilter] = useState({
    defaultFilter
  })
  const [state, setState] = useState({
    loading: false,
    error: null,
  })

  const updateState = update => setState(prev => ({ ...prev, ...update }))
  const updateExpense = updates => setExpense(prev => ({ ...prev, ...updates }))
  const updateFilter = updates => setFilter(prev => ({ ...prev, ...updates }))

  useEffect(() => {
    document.title = 'View Expense'
    initialCallFunctions();
  }, []);

  const initialCallFunctions = () => {
    getExpenses();

    if (!categories.length) {
      getAllCategories();
    }
    if (!friends.length) {
      getAllFriends();
    }
  }

  const getExpenses = async (data) => {
    try {
      const params = {
        category: data?.category ?? filter.category,
        friends: data?.friends ?? filter.friends,
      }
      updateState({ loading: true })
      const response = await getRequest('expenses', params)
      updateExpense({ list: response, filteredExpenses: response })

    } catch (error) {
      console.log(error)
    } finally {
      updateState({ loading: false })
    }
  };

  return (
    <div className="">

      <div className="">
        <div className="flex justify-between items-center" >
          <h2 className="font-bold font-mono p-2 text-blue-500 text-xl" >Your Expenses</h2>
          <ListFilter size={20} />
        </div>

        <TransactionSummary data={expense.list} />

        <Filter filter={filter} updateFilter={updateFilter} categories={categories} friends={friends} getExpenses={getExpenses} />

        {expense.filteredExpenses.length === 0 ? (
          <div className="">
            <p>No expenses found. Add your first expense above!</p>
          </div>
        ) : (
          <ExpenseList items={expense.filteredExpenses} categories={categories} />

        )}
      </div>
    </div>
  )
}

export default ViewExpense;

const ExpenseList = ({ items, ...props }) => {
  if (!items.length) return;
  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-5" >
      {items?.map(item => <ExpenseCard key={item.id} item={item} {...props} />)}
    </div>
  )
}


const ExpenseCard = ({ item, ...props }) => {
  const category = props.categories.find(i => i.id === item.categoryId)?.name;
  const IconComponent = Icons[category]?.icon;
  const iconColor = Icons[category]?.color;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {IconComponent ? (
            <Suspense fallback={<span className="w-6 h-6 bg-gray-200 rounded animate-pulse"></span>}>
              <IconComponent size={24} color={iconColor} />
            </Suspense>
          ) : (
            <span className="text-xl">📦</span>
          )}
          <span className="font-medium text-gray-700 capitalize">{category}</span>
        </div>
        <span className={`font-bold text-lg ${item.txn_type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
          {item.txn_type === 'expense' ? '-' : '+'}${item.amount}
        </span>
      </div>

      <div className="space-y-2">
        {item.description && (
          <p className="text-gray-800 font-medium">{item.description}</p>
        )}

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {item.payment_method}
          </span>
          <span className="font-medium">
            Balance: ${item.current_balance}
          </span>
        </div>

        <div className="text-xs text-gray-500 pt-1">
          {formatDateYYYYMMDD(item.date)}
        </div>
        <div className="flex justify-between" >
          <Button>Edit</Button>
          <Button variant="destructive" >Delete</Button>
        </div>

      </div>
    </div>
  );
};


const TransactionSummary = ({ data }) => {
  const summary = useMemo(() => {
    const newSummary = { debit: 0, credit: 0 };
    data.forEach(item => {
      if (item.txn_type === 'debit') {
        newSummary.debit += item.amount;
      } else {
        newSummary.credit += item.amount;
      }
    });
    return newSummary;
  }, [data]);

  // --- Styles ---
  const summaryStyle = {
    fontFamily: 'sans-serif',
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    maxWidth: '250px',
    backgroundColor: '#f9f9f9',
  };

  const lineItemStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem',
    marginBottom: '12px', // A little more space
  };

  const textStyle = {
    marginLeft: '10px',
  };

  return (
    <div style={summaryStyle}>
      {/* Credit Section */}
      <div style={lineItemStyle}>
        <ArrowUpCircle color="green" size={24} />
        <span style={textStyle}>Credit: {summary.credit.toLocaleString()}</span>
      </div>

      {/* Debit Section */}
      <div style={lineItemStyle}>
        <ArrowDownCircle color="red" size={24} />
        <span style={textStyle}>Debit: {summary.debit.toLocaleString()}</span>
      </div>
    </div>
  );
};