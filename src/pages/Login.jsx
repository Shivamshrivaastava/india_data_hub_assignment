import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp) {
      // Sign up logic
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.find(u => u.email === email);

      if (userExists) {
        setError('User already exists');
        return;
      }

      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', email);
      navigate('/catalogue');
    } else {
      // Sign in logic
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        setError('Invalid credentials');
        return;
      }

      localStorage.setItem('currentUser', email);
      navigate('/catalogue');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">ID</span>
          </div>
          <span className="text-xl font-semibold">indiadatahub.in</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-indigo-200">Database</a>
          <a href="#" className="hover:text-indigo-200">Calendar</a>
          <a href="#" className="hover:text-indigo-200">Help</a>
          <a href="#" className="hover:text-indigo-200">Login</a>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">ID</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {isSignUp ? 'Sign up' : 'Sign in'}
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-900 text-white py-2 rounded hover:bg-indigo-800 transition"
            >
              {isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Forgot password?
            </a>
            <span className="mx-2 text-gray-500">|</span>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
