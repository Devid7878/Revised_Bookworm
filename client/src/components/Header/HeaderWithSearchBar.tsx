import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalState } from '../../globalState/GlobalState';
import axios from 'axios';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import './Header.css';

import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Logo from '../Logo/Logo';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';

export default function HeaderWithSearchBar() {
  const state = useContext(GlobalState);
  const isLogged = state?.userAPI.isLogged;
  const setIsLogged = state?.userAPI.setIsLogged;
  const isSeller = state?.userAPI.isSeller;
  const isAdmin = state?.userAPI.isAdmin;
  const cart = state?.userAPI.cart;
  const setSearch = state?.productsAPI.setSearch;
  const setProducts = state?.productsAPI.setProducts;
  const setCategory = state?.productsAPI.setCategory;
  const setInfor = state?.userAPI.setInfor;

  const [handleSearch, setHandleSearch] = useState('');
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  useEffect(() => {
    async function getProducts() {
      setSearch && setSearch(handleSearch);
      setProducts && setProducts((products) => products);
    }
    getProducts();
  }, [handleSearch, setSearch, setProducts]);

  const navigate = useNavigate();

  const logoutUser = async () => {
    const data = await Swal.fire('Are you sure you want to logout?');
    if (data.isConfirmed) {
      await axios.get(`http://localhost:5000/user/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem('Login');
      localStorage.removeItem('token');
      setIsLogged && setIsLogged(false);
      setInfor && setInfor([]);
      navigate('/');
    }
  };

  return (
    <header>
      <nav className="container">
        <div className="logo">
          <Link
            to="/"
            onClick={() => {
              if (setCategory) setCategory('');
            }}
          >
            <Logo />
          </Link>
        </div>
        <div className="search-bar">
          <SearchRoundedIcon />
          <input
            name=""
            placeholder="Search for products..."
            className="search__input"
            value={handleSearch}
            onChange={(e) => setHandleSearch(e.target.value)}
          />
        </div>
        <div className="nav-links-container">
          <ul className="nav-links">
            <li>
              <NavLink to="/products">Products</NavLink>
            </li>
            {isLogged &&
              (isSeller ? (
                <li>
                  <NavLink to="/seller">Dashboard</NavLink>
                </li>
              ) : isAdmin ? (
                <>
                  <li>
                    <NavLink to="/book-listings">Listings</NavLink>
                  </li>
                  <li>
                    <NavLink to="/all-users">All Users</NavLink>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink to="/history">My Orders</NavLink>
                </li>
              ))}

            {isLogged ? (
              <>
                <li>
                  <Link to="/cart" className="shopping-cart">
                    <ShoppingCartRoundedIcon />
                    <span>{cart?.length}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    onClick={logoutUser}
                    className="logout-button button"
                  >
                    Logout
                    <LogoutRoundedIcon />
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="login-button button">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="register-button button">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          {/* <div className="profile">
            <img
              src="https://a.storyblok.com/f/191576/1200x800/faa88c639f/round_profil_picture_before_.webp"
              alt=""
            />
          </div> */}
        </div>

        {!isMenuClicked ? (
          <div
            className="hamburger"
            onClick={() => {
              setIsMenuClicked((isMenuClicked) => !isMenuClicked);
            }}
          >
            <MenuIcon />
          </div>
        ) : (
          <div
            className="hamburger"
            onClick={() => {
              setIsMenuClicked((isMenuClicked) => !isMenuClicked);
            }}
          >
            <CloseRoundedIcon />
          </div>
        )}
        {isMenuClicked && (
          <div className="navbar-mobile">
            <ul className="nav-links-mobile">
              <li>
                <Link to="/products">Products</Link>
              </li>
              {isLogged &&
                (isSeller ? (
                  <li>
                    <Link to="/seller">Dashboard</Link>
                  </li>
                ) : isAdmin ? (
                  <>
                    <li>
                      <Link to="/book-listings">Listings</Link>
                    </li>
                    <li>
                      <Link to="/all-users">All Users</Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/history">My Orders</Link>
                  </li>
                ))}

              {isLogged ? (
                <>
                  <li>
                    <Link to="/cart" className="shopping-cart">
                      {/* <ShoppingCartRoundedIcon />
                      <span>{cart?.length}</span> */}
                      Cart
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      onClick={logoutUser}
                      className="logout-button button"
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="login-button button">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="register-button button">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
