import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Fallback response when OpenAI API key is not configured
      return NextResponse.json({
        reply: "Xin lỗi, tôi chưa được cấu hình để trả lời câu hỏi này. Bạn có thể hỏi tôi về các dịch vụ của HANOTEX không?"
      });
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: context || "Bạn là trợ lý thông minh của HANOTEX. Khi người dùng hỏi về giao dịch công nghệ, hãy hướng dẫn họ về các dịch vụ của HANOTEX. Khi họ hỏi về chủ đề khác, hãy trò chuyện thân thiện và hữu ích."
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    const reply = data.choices?.[0]?.message?.content || "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('ChatGPT API error:', error);
    
    // Fallback response
    return NextResponse.json({
      reply: "Xin lỗi, tôi gặp sự cố kỹ thuật. Bạn có thể hỏi tôi về các dịch vụ của HANOTEX không?"
    });
  }
}
