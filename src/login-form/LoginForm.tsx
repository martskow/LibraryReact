import './LoginForm.css';
import { Button, TextField } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/Login';
import { Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import * as yup from 'yup';

function LoginForm() {
  let onSubmit = useCallback(
    (values: { username: string; password: string }, formik: any) => {
      console.log(values);
    },
    [],
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup
          .string()
          .required('Password is required')
          .min(6, 'Password is too short'),
      }),
    [],
  );

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
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
            id="username"
            label="Username"
            variant="standard"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && !!formik.errors.username}
            helperText={formik.touched.username && formik.errors.username}
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
