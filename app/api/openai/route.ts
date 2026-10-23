import { OpenAIStream, OpenAIStreamPayload } from '@/utils/OpenAIStream';
import {
    assertMessages,
    checkRateLimit,
    checkSameOrigin,
    toErrorResponse,
} from '@/utils/api-guard';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
}

export const config = {
    runtime: 'edge',
};

export async function POST(req: Request): Promise<Response> {
    const originError = checkSameOrigin(req);
    if (originError) return originError;

    const rateLimited = checkRateLimit(req);
    if (rateLimited) return rateLimited;

    try {
        const body = await req.json();

        if (!body) {
            return new Response('No prompt in the request', { status: 400 });
        }

        const messages = assertMessages(body.messages);

        const payload: OpenAIStreamPayload = {
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 2000,
            stream: true,
            n: 1,
        };

        const stream = await OpenAIStream(payload);
        return new Response(stream);
    } catch (error) {
        return toErrorResponse(error, 'OpenAI API error:');
    }
}
