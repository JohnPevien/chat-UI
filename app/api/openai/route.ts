import { Configuration, OpenAIApi } from 'openai';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    return new Response('Hello, Next.js GET!');
}

export async function POST(req: Request) {
    try {
        const openai = new OpenAIApi(
            new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            })
        );

        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    content: 'Hello',
                    role: 'user',
                },
            ],
        });

        const { data } = completion;

        return new NextResponse(JSON.stringify(data), {
            status: 200,
        });
    } catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 500,
        });
    }
}
