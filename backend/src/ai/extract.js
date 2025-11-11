import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";


const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const pineconeIndex = {
  name: "raf-genie-vector-db",
  dimension: 1536,
};
const pinecone = new PineconeClient();
const vectorStore = await PineconeStore.fromExistingIndex(
  embeddings,
  {
    pineconeIndex,
    maxConcurrency: 5,

  }
);

export async function indexTheDocument(filepath) {
    const loader = new PDFLoader(filepath, { splitPages: false });
    const doc = await loader.load();
   



    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 500 })
    const texts = await  splitter.splitText(doc[0].pageContent)
    console.log("Splitted texts: ", texts);

    const documents = texts.map((text, index) => ({
        pageContent: text,
        metadata: doc[0].metadata,
    }));
    await vectorStore.addDocuments(documents);

}