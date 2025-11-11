
import path from "path";
import { fileURLToPath } from "url";
import { indexTheDocument } from "./extract.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const filepath = path.join(__dirname, "../../public/Discrete-Mathematics-book.pdf");


export async function run() {
  await indexTheDocument(filepath);
}
