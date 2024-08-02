import { PluginErrorType, createErrorResponse } from '@lobehub/chat-plugin-sdk';
import { QuestionData} from '@/type';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI} from 'openai';

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '/node_modules/ajv/**',
  ],
};

const index_name = 'lithium-documents';
const namespace = 'KBS_PORTAL';

export default async (req: Request) => {
  if (req.method !== 'POST') return createErrorResponse(PluginErrorType.MethodNotAllowed);

  const { question } = (await req.json()) as QuestionData;
  console.log(question);

  const openai = new OpenAI();
  const embedding = await openai.embeddings.create({input: question, model: 'text-embedding-3-small'});

  const pc = new Pinecone({apiKey: process.env.PINECONE_API_KEY || ''});
  const result = await pc.index(index_name).namespace(namespace).query({ includeMetadata: true, topK: 10, vector: embedding.data[0].embedding});

  const response =  result['matches'].map((match) => {
    return {
      code: match.metadata!.code,
      file: match.metadata!.file,
      func_name: match.metadata!.func_name,
      line_no: match.metadata!.line_no,
      score: match.score,
    };
  });
  return new Response(JSON.stringify(response));
};
