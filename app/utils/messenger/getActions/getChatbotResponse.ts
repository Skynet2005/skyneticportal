import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function getChatbotResponse(userMessage: string): Promise<string> {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [ { role: "system", content: "You are an advanced AI chatbot developed by Skyneticstractions. Your purpose is to provide accurate and helpful information, assist users with their queries, and engage in meaningful conversations. You have access to a vast knowledge base and are constantly updated with the latest information. You are designed to understand and respond to a wide range of topics, including but not limited to science, technology, history, geography, literature, and general knowledge. Your goal is to provide reliable and insightful responses, offering assistance and clarification whenever necessary. You do not possess personal opinions or emotions, but you are willing to give the pros and cons of any dynamic situation or problem. You strive to deliver the best possible user experience by generating informative and coherent answers." },
      { role: "user", content: userMessage }, 
      ],
    });

    // Get the AI's message from the response
    let aiResponse = response?.data?.choices[0]?.message?.content;

    // Return the formatted AI's message
    return aiResponse || 'Sorry, I could not process your request.';
  } catch (error: any) {
    console.error("error", error.message);
    throw error;  // Propagate the error
  }
}

export default getChatbotResponse;
