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
import AddBook from './add-book/AddBook';
import BookListLibrarian from './book-list/BookListLibrarian';
import BookListAdmin from './book-list/BookListAdmin';
import ArchiveLoansLibrarian from './archive-loans/ArchiveLoansLibrarian';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import AddLoanPage from './add-loan/AddLoan';
import ReviewListUser from './review-list/ReviewListUser';
import AddReviewPage from './add-review/AddReview';
import ReviewListForOneBook from './review-list/ReviewListForOneBook';
import UserList from './users-list/UsersListAdmin';

function App() {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
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
            <Route path="/addLoan" element={<AddLoanPage />} />
            <Route path="/addLoan/:isbn" element={<AddLoanPage />} />
            <Route path="/addBook" element={<AddBook />} />
            <Route path="/reviews" element={<ReviewListUser />} />
            <Route path="/addReview" element={<AddReviewPage />} />
            <Route path="/addReview/:bookId" element={<AddReviewPage />} />
            <Route path="/getReviews" element={<ReviewListForOneBook />} />
            <Route
              path="/getReviews/:bookId"
              element={<ReviewListForOneBook />}
            />

            <Route
              path="/archiveLoansLibrarian"
              element={<ArchiveLoansLibrarian />}
            />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </ApiProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
}

export default App;
