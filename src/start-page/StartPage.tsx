import React from 'react';
import MenuBarBeforeLogin from '../menu-bar/MenuBarBeforeLogin';
import LoginForm from '../login-form/LoginForm';
import './StartPage.css';

function StartPage() {
  return (
    <div className="StartPage">
      <MenuBarBeforeLogin />
      <div className="home-container">
        <div className="left-side">
          <img className="home-image" src="/books2.jpg" alt="Banner" />
        </div>
        <div className="right-side">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default StartPage;
