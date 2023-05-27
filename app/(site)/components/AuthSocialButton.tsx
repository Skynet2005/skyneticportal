import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType
  onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({ 
  icon: Icon,
  onClick,
}) => {
  return ( 
    <button
      title="button"
      type="button"
      onClick={onClick}
      className="inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-red-700 shadow-sm ring-1 ring-inset ring-red-700 hover:bg-gray-500 hover:text-white hover:ring-white focus:outline-offset-0">
      <Icon />
    </button>
  );
}

export default AuthSocialButton;