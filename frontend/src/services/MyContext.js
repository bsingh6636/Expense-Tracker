import React, { createContext, useState } from 'react';
import { getCategories, getFriends } from './api';

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [value, setValue] = useState('default');
  const [categories, setCategories] = useState([]);
  const [friends , setFriend] = useState([]);

  async function getAllCategories() {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function getAllFriends (){
    const result = await getFriends();
    setFriend(result);
  }

  return (
    <MyContext.Provider value={{ value, setValue, getAllCategories, categories, getAllFriends, friends }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
