import { Field, Form, Formik, useField } from 'formik';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { object, string } from 'yup';
import { useAuth } from '../auth';

function Control({
  placeholder,
  name,
  type,
  className,
}: {
  placeholder: string;
  name: string;
  type: string;
  className?: string;
}) {
  const [, { error, touched }] = useField(name);
  return (
    <div className="mx-auto w-full md:w-auto">
      <Field
        placeholder={placeholder}
        name={name}
        type={type}
        className={`w-full md:w-[380px] h-[60px] text-[#8B8B8B] focus:text-white outline-none rounded-[6px] border-transparent bg-[#3F414B] border pt-[17px] pb-[18px] px-[22px] ${
          touched && error ? 'border-red-600' : 'focus:border-[#F2C94C]'
        } ${className}`}
      />
      {touched && error ? (
        <p className="block text-white px-[22px] py-2">{error}</p>
      ) : null}
    </div>
  );
}

const validationSchema = object().shape({
  username: string().required('Username is required'),
  password: string().required('Password is required'),
});

export function Login() {
  const [error, setError] = React.useState('');
  const [hasAuth, setAuth] = useAuth();
  const handleSubmit = React.useCallback(
    ({ username, password }) => {
      if (username === 'admin' && password === 'admin') {
        setAuth(true);
      } else {
        setError('Invalid login. Please try again.');
      }
    },
    [setAuth],
  );
  if (hasAuth) return <Navigate to="/" />;

  return (
    <div className="flex w-screen h-screen bg-[#1C1D1F] p-4">
      <div
        className="bg-[#2D2F36] mx-auto my-auto rounded-[8px] w-full md:w-[508px]"
        style={{ minHeight: '459px' }}
      >
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col pb-[99px] p-4 w-full">
            <Control
              placeholder="Username (admin)"
              name="username"
              type="text"
              className="mt-[107px]"
            />
            <Control
              placeholder="Password (admin)"
              name="password"
              type="password"
              className="mt-[28px]"
            />

            <button
              type="submit"
              className="mx-auto w-full md:w-[380px] h-[60px] bg-[#F2C94C] rounded-[6px] text-white mt-[45px] hover:brightness-75"
            >
              LOGIN
            </button>

            {error ? (
              <p className="block text-white pt-4 mx-auto">{error}</p>
            ) : null}
          </Form>
        </Formik>
      </div>
    </div>
  );
}
