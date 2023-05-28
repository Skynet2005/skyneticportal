import Head from 'next/head';
import Image from "next/image";
import AuthForm from "./components/AuthForm";

const Auth = () => {
  return (
    <div className="relative flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-black bg-background bg-center bg-no-repeat bg-[length:full_full]">
      <Head><link rel="icon" href="@/favicon.ico" /></Head>
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Skyneticstractions | Messenger
      </h2>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          height={100}
          width={100}
          className="mx-auto w-auto"
          src="/images/logo.png"
          alt="Logo"
        />
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-300">
          Sign in to your account
        </h1>
      </div>
      <AuthForm />      
    </div>
  )
}

export default Auth;
