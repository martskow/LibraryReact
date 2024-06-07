import React from 'react';
import './App.css';
import LoginForm from './login-form/LoginForm';
import BookList from './book-list/BookList';
import HomePageUser from './home-page/HomePageUser';
import LoansList from './loans-list/LoansList';
import StartPage from './start-page/StartPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ApiProvider from './api/ApiProvider';
import HomePageAdmin from './home-page/HomePageAdmin';
import HomePageLibrarian from './home-page/HomePageLibrarian';

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Routes>
          <Route path="*" element={<h1>404</h1>} />
          <Route path="/" element={<Navigate to="/startPage" />} />
          <Route path="/startPage" element={<StartPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<HomePageUser />} />
          <Route path="/homeAdmin" element={<HomePageAdmin />} />
          <Route path="/homeLibrarian" element={<HomePageLibrarian />} />
          <Route path="/loans" element={<LoansList />} />
          <Route path="/booksList" element={<BookList />} />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
