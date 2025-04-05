

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuth from '@/hooks/useAuth/useAuth';
import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Link } from 'react-router-dom'; 

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
const {signIn,loading} = useAuth()
  const onSubmit = async (data) => {
try {
    await signIn(data.email, data.password,rememberMe)
    toast.success('Login successful!')
   
} catch (error) {
    toast.error('Login failed! Please check your credentials.')
}
    

   
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Form using react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className="w-full"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <Input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-gray-500"
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            <label htmlFor="remember-me" className="text-sm text-gray-600">
              Remember Me
            </label>
          </div>

          {/* Login Button */}
          <Button disabled={loading} type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
            {loading ?'Login.....':'Login'}
          </Button>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
