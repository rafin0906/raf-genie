import express from "express"
import cors from "cors"
import path from "path";


const app = express()

const __dirname = path.resolve();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


import chatRouter from "./routes/chat.route.js"

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))



app.use("/api/v1/", chatRouter)

app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('/', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});


export { app }













