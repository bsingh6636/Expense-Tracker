import { Suspense } from "react";
import { Icons } from "../../components/icons";
import { formatDateYYYYMMDD } from "../../utils/date";
import { Button } from "../../components/ui/button";

export const ExpenseCard = ({ item, ...props }) => {
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
          {item.txn_type === 'debit' ? '-' : '+'}₹{item.amount}
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
            Balance: ₹{item.current_balance}
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