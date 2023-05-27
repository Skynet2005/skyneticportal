'use client';

import { 
  HiPaperAirplane, 
  HiPhoto
} from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { 
  FieldValues, 
  SubmitHandler, 
  useForm 
} from "react-hook-form";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import useConversation from "@/app/utils/messenger/useHooks/useConversation";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    axios.post('/api/messenger/messages', {
      ...data,
      conversationId: conversationId
    })
  }

  const handleUpload = (result: any) => {
    axios.post('/api/messenger/messages', {
      image: result.info.secure_url,
      conversationId: conversationId
    })
  }

  return ( 
    <div 
      className="py-4 px-4 bg-neutral-900 border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton 
        options={{ maxFiles: 1 }} 
        onUpload={handleUpload} 
        uploadPreset="sdb3hnwn"
      >
        <HiPhoto size={30} className="text-white hover:text-green-700" />
      </CldUploadButton>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput 
          id="message" 
          register={register} 
          errors={errors} 
          required 
          placeholder="Write a message"
          onSubmit={onSubmit}
        />
        <button
          title="send message"
          type="submit" 
          className="rounded-full p-2 bg-white cursor-pointer hover:bg-green-700 transition">
          <HiPaperAirplane
            size={18}
            className="text-black"
          />
        </button>
      </form>
    </div>
  );
}

export default Form;
