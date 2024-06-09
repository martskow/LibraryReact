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
import AddUserLibrarian from './add-user/AddUserLibrarian';
import AddUserAdmin from './add-user/AddUserAdmin';
import AddLoan from './add-loan/AddLoan';
import AddBook from './add-book/AddBook';
import BookListLibrarian from './book-list/BookListLibrarian';
import BookListAdmin from './book-list/BookListAdmin';
import ArchiveLoansLibrarian from './archive-loans/ArchiveLoansLibrarian';

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
          <Route path="/booksListLibrarian" element={<BookListLibrarian />} />
          <Route path="/booksListAdmin" element={<BookListAdmin />} />
          <Route path="/addUserLibrarian" element={<AddUserLibrarian />} />
          <Route path="/addUserAdmin" element={<AddUserAdmin />} />
          <Route path="/addLoan" element={<AddLoan />} />
          <Route path="/addBook" element={<AddBook />} />
          <Route
            path="/archiveLoansLibrarian"
            element={<ArchiveLoansLibrarian />}
          />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
