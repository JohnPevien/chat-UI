import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    return new Response('Hello, Next.js GET!');
}

export async function POST(req: NextRequest) {
    try {
        const json: CreateChatCompletionRequest = await req.json();

        const openai = new OpenAIApi(
            new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            })
        );

        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: json.messages,
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
