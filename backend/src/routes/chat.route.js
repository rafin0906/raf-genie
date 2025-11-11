// import { Router } from "express";
// import { chat } from "../ai/answerLLM.js";

// const router = Router()

// router.route("/chat").post(async (req, res) => {
//     //get the message from the request body
//     const { message } = req.body;
//     try {
//         const chatCompletion = await chat(message);
//         res.status(200).json({
//             success: true,
//             data: chatCompletion.choices[0].message.content,
//         });
//     } catch (error) {
//         console.error("Error in /chat route:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         });
//     }
// });

// export default router




import { Router } from "express";
import { handleChat } from "../controllers/chatMessage.controller.js";

const router = Router();

// route now delegates to controller (which uses asyncHandler)
router.route("/chat").post(handleChat);

export default router;