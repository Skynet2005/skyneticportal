'use client';

import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister
} from "react-hook-form";
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from'react';

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors;
  onSubmit: (data: FieldValues) => void
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  placeholder, 
  id, 
  type, 
  required, 
  register,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative w-full">
      <TextareaAutosize
        id={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="
          text-black
          font-light
          py-2
          px-4
          bg-neutral-300 
          w-full 
          rounded-full
          focus:outline-none
          min-h-[40px]
        "
        minRows={1}
        maxRows={5}
        onKeyDown={async (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setLoading(true);
            console.log("Loading set to true");
            const value = e.currentTarget.value;
            try {
              await onSubmit({ [id]: value });
            } catch (error: any) {
              console.log("Error: ", error.message);
            } finally {
              setLoading(false);
              console.log("Loading set to false");
            }
          }
        }}
      />
    {loading && <div className="absolute right-0 top-0 mt-2 mr-2">...loading</div>}
    </div>
  );
};

export default MessageInput;