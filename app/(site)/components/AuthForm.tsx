'use client';

// Import required dependencies and components
import axios from "axios";
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle  } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";

import Input from "@/app/messenger/components/inputs/Input";
import AuthSocialButton from './AuthSocialButton';
import Button from "@/app/messenger/components/Button";
import { toast } from "react-hot-toast";

// Define the type for authentication variants
type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  // Declare states for session, router, variant, and loading
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is authenticated and redirect them to the messenger
  useEffect(() => {
    if (session?.status === 'authenticated') {
      console.log('Authenticated')
      router.push('/messenger')
    }
  }, [session?.status, router]);

  // Function to toggle between login and register variants
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  // Initialize react hook form
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  // Submit handler for the form
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Logic for registration
    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
      .then(() => signIn('credentials', {
        ...data,
        redirect: false,
      }))
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/')
        }
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false))
    }

    // Logic for login
    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/messenger')
        }
      })
      .finally(() => setIsLoading(false))
    }
  }

  // Handler for social authentication actions
  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/messenger')
        }
      })
      .finally(() => setIsLoading(false));
  } 

  // Render the form and other UI components
  return (
    // Main container with responsive styles
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      {/* Container for the form with custom styles (glossy, threeD) and default styles */}
      <div className="glossy threeD px-4 py-8 shadow-lg border border-gray-700 sm:rounded-lg sm:px-10">
        {/* Form element with spacing between child elements */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* // Render name input field if it's a registration form */}
          {variant === 'REGISTER' && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="name" 
              label="Name"
            />
          )}
          {/* // Email input field */}
          <Input 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="email" 
            label="Email address" 
            type="email"
          />
          {/* // Password input field */}
          <Input 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="password" 
            label="Password" 
            type="password"
          />
          {/* // Submit button */}
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
  
        {/* // Separator with "Or continue with" text */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-red-500" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-2 text-gray-500 rounded-lg font-bold">
                Or continue with
              </span>
            </div>
          </div>
  
          {/* // Social authentication buttons container */}
          <div className="mt-6 flex gap-2">
            {/* // GitHub authentication button */}
            <AuthSocialButton 
              icon={BsGithub} 
              onClick={() => socialAction('github')} 
            />
            {/* // Google authentication button */}
            <AuthSocialButton 
              icon={BsGoogle} 
              onClick={() => socialAction('google')} 
            />
          </div>
        </div>
        {/* // Toggle between registration and login links */}
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-white">
          <div>
            {variant === 'LOGIN' ? 'New to Skyneticstractions?' : 'Already have an account?'} 
          </div>
          <div 
            onClick={toggleVariant} 
            className="underline cursor-pointer"
          >
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;