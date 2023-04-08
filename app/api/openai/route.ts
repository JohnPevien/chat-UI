import { Configuration, ChatCompletionRequestMessage, OpenAIApi } from 'openai';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    return new Response('Hello, Next.js GET!');
}

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();
        const openai = new OpenAIApi(
            new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            })
        );

        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: json.messages,
            max_tokens: process.env.MAX_TOKENS
                ? parseInt(process.env.MAX_TOKENS, 10)
                : 500,
        });

        const {
            data: { choices, id },
        } = completion;

        return new NextResponse(JSON.stringify({ choices, id }), {
            status: 200,
        });
    } catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 500,
        });
    }
}
