import { Navigate, Route, Routes } from "react-router-dom"
import ViewExpense from "./viewExpense/ViewExpense"
import AddExpense from "./addExpense";

const MainRoutes = () => {
    return (
        <div className="md:mx-20 mt-5 md:mt-10">
            <Routes>
                <Route path='addExpense' element={<AddExpense />} />
                <Route path='viewExpense' element={<ViewExpense />} />
                <Route path="*" element={<Navigate to="/app/viewExpense" />} />
            </Routes>
        </div>
    )
}

export default MainRoutes;