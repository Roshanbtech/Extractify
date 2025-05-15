
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

export default function LoginPage() {
  const login = useAuthStore(s => s.login);
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="w-full bg-black border-b border-cyan-500 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="ml-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Extractify
            </h1>
          </div>
          <nav>
            <Link to="/signup" className="text-gray-300 hover:text-cyan-400 transition duration-300">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                  Welcome Back
                </h2>
                <p className="mt-2 text-gray-400">
                  Login to access your PDF documents
                </p>
              </div>

              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={schema}
                onSubmit={async (values, { setSubmitting }) => {
                  await login(values.email, values.password);
                  setSubmitting(false);
                  nav('/');
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2">
                        Email Address
                      </label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
                      />
                      <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div>
                      <label htmlFor="password" className="text-sm font-medium text-gray-300 block mb-2">
                        Password
                      </label>
                      <Field
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
                      />
                      <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                          Remember me
                        </label>
                      </div>

                      {/* <div className="text-sm">
                        <Link to="/forgot-password" className="text-cyan-400 hover:text-cyan-300 font-medium transition duration-200">
                          Forgot password?
                        </Link>
                      </div> */}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition duration-300 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </button>
                  </Form>
                )}
              </Formik>

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition duration-200">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>

            <div className="py-4 px-6 bg-gray-900 border-t border-gray-700">
              <p className="text-xs text-center text-gray-500">
                Secure login powered by Extractify
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}