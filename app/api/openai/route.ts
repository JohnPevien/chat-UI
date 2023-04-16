import {
    OpenAIStream,
    OpenAIStreamPayload,
    ChatGPTMessage,
} from '@/utils/OpenAIStream';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
}

export const config = {
    runtime: 'edge',
};

export async function POST(req: Request): Promise<Response> {
    const body = await req.json();
    console.log(body);
    console.log(body.messages);

    if (!body) {
        return new Response('No prompt in the request', { status: 400 });
    }

    const payload: OpenAIStreamPayload = {
        model: 'gpt-3.5-turbo',
        messages: body.messages,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 4000,
        stream: true,
        n: 1,
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
}
