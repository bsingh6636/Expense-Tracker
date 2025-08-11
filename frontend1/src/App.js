import React, { useState, useEffect, useContext, Suspense } from 'react';
import { getExpenses, createExpense, updateExpense, deleteExpense } from './services/api';
import './App.css';
import { MyContext } from './services/MyContext';
import ErrorBoundary from './components/ui/error-boundary';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainRoutes from './routes';
import { HomePage } from './routes/homePage';

function App() {

  const Loader = () => {
    return (
      <div class="flex justify-center items-center space-x-2 h-32">
        <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    )
  }


  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<Loader />} >
          <Routes>
            <Route path='/' element={ <HomePage /> } />
            <Route path='/app/*' element={<MainRoutes />} />
            <Route path = '*' element={ <Navigate to='/app/' /> } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;