import './LoginForm.css';
import { Button, TextField } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/Login';
import { Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useApi } from '../api/ApiProvider';

function LoginForm() {
  const navigate = useNavigate();
  const apiClient = useApi();

  const onSubmit = useCallback(
    (values: { login: string; password: string }, formik: any) => {
      apiClient.login(values).then((response) => {
        console.log(response);
        if (response.statusCode === 200 && response.data) {
          Cookies.set('token', response.data);
          navigate('/home');
        } else {
          formik.setFieldError('login', 'Invalid username or password');
        }
      });
    },
    [apiClient, navigate],
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        login: yup.string().required('Username is required'),
        password: yup
          .string()
          .required('Password is required')
          .min(4, 'Password is too short'),
      }),
    [],
  );

  return (
    <Formik
      initialValues={{ login: '', password: '' }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange
      validateOnBlur
    >
      {(formik: any) => (
        <form
          className="Login-form"
          id="loginForm"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <TextField
            id="login"
            label="Username"
            variant="standard"
            name="login"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.login && !!formik.errors.login}
            helperText={formik.touched.login && formik.errors.login}
          />
          <TextField
            id="password"
            label="Password"
            variant="standard"
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            variant="contained"
            startIcon={<LockOpenIcon />}
            type="submit"
            form="loginForm"
            disabled={!(formik.isValid && formik.dirty)}
          >
            Login
          </Button>
          <div>
            You don't have an account? <Button variant="text">Sign In </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default LoginForm;
