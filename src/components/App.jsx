import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../utils/PrivateRoute';
import PublicRoute from '../utils/PublicRoute';
import {
  allUserInfo,
  getExpenseStats,
  getIncomeStats,
} from '../redux/transactions/transactionsOperations';
import { loginGoogle, refreshUser } from '../redux/auth/authOperations';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import authSelectors from '../redux/auth/authSelectors';
import Loader from './Loader';

const CostsAndIncomesPage = lazy(() =>
  import('../pages/CostsAndIncomesPage/CostsAndIncomesPage')
);
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
// const HomePage = lazy(() => import('../pages/CostsAndIncomesPage'));
const ReportPage = lazy(() => import('../pages/ReportPage/ReportPage'));

function App() {
  const { accessToken, refreshToken, sid } = queryString.parse(
    window.location.search
  );
  const dispatch = useDispatch();
  const token = useSelector(authSelectors.getToken);

  useEffect(() => {
    if (accessToken) {
      dispatch(loginGoogle({ accessToken, refreshToken, sid }));
      dispatch(allUserInfo(accessToken));
    } // eslint-disable-next-line
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (token) {
      dispatch(refreshUser());
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(allUserInfo(token));
      dispatch(getExpenseStats());
      dispatch(getIncomeStats());
    }
  }, [token, dispatch]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* <Route
            path="/"
            element={
              <PrivateRoute redirectTo={'/login'}>
                <CostsAndIncomesPage />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/expenses"
            element={
              <PrivateRoute redirectTo={'/login'}>
                <CostsAndIncomesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/incomes"
            element={
              <PrivateRoute redirectTo={'/login'}>
                <CostsAndIncomesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="report"
            element={
              <PrivateRoute redirectTo={'/login'}>
                <ReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="login"
            element={
              <PublicRoute restricted>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route path="*" element={<Navigate to="/expenses" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
