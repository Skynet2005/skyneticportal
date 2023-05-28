'use client';

import "../../../globals.css"
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import useConversation from "@/app/utils/messenger/useHooks/useConversation";
import { useState } from 'react';
import { OpenAIModelID, OpenAIModels } from '@/app/types/aichat/openai';

const Form = () => {
  const { conversationId } = useConversation();
  const [aiChatbotActive, setAiChatbotActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState(OpenAIModelID.GPT_3_5);
  const [typing, setTyping] = useState(false);

  const toggleAiChatbotStatus = () => {
    setAiChatbotActive(!aiChatbotActive);
  };

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
    const apiUrl = aiChatbotActive
      ? '/api/messenger/aimessages'
      : '/api/messenger/messages';
    axios.post(apiUrl, {
      ...data,
      openaiModel: selectedModel,
      conversationId: conversationId,
  }).catch(error => {
    console.error('Error posting data:', error);
  });
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
        key={typing ? 'hidden' : 'shown'}
        options={{ maxFiles: 1 }} 
        onUpload={handleUpload} 
        uploadPreset="sdb3hnwn"
      >
        <HiPhoto size={30} className="text-white hover:text-green-700" />
      </CldUploadButton>
      <select
        hidden={typing}
        title="Ai Model"
        value={selectedModel}
        onChange={(event) => setSelectedModel(event.target.value as OpenAIModelID)}
        className={`border border-gray-300 bg-gray-500 w-21 rounded p-2 ${
          aiChatbotActive ? 'filled' : 'unfilled'
        }`}
      >
        {Object.entries(OpenAIModels).map(([modelId, model]) => (
          <option key={modelId} value={modelId}>
            {model.name}
          </option>
        ))}
      </select>
      <button
        hidden={typing}
        onClick={toggleAiChatbotStatus}
        className={`rounded-full p-2 ${
          aiChatbotActive ? 'filled' : 'unfilled'
        } cursor-pointer hover:bg-green-700 transition`}
      >
        AI
      </button>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex items-center gap-1 lg:gap-4 w-full"
      >
        <MessageInput 
          id="message" 
          register={register} 
          errors={errors} 
          required 
          placeholder="Write a message"
          onSubmit={onSubmit}
          onFocus={() => setTyping(true)}
          onBlur={() => setTyping(false)}
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