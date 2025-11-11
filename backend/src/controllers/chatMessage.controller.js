import { asyncHandler } from "../asyncHandler.js";
import { chat } from "../ai/jsonLLM.js";
import { chat as answerChat } from "../ai/answerLLM.js";
import { CTQuestion } from "../models/ctquestion.model.js";

/**
 * POST /api/v1/chat
 * body: { message: string, selectedOption?: string }
 *
 * Calls jsonLLM to get structured json, queries DB (if ct) and then
 * sends the DB results (queryData) to answerLLM for a final user-facing reply.
 */
export const handleChat = asyncHandler(async (req, res) => {
    const { message, selectedOption } = req.body;

    if (!message || typeof message !== "string") {
        return res.status(400).json({ success: false, message: "message is required" });
    }

    // call jsonLLM (returns the raw jsonQuery object)
    const jsonQuery = await chat(message, selectedOption);
    const content = jsonQuery?.choices?.[0]?.message?.content;
    console.log("LLM jsonQuery content:", content);

    // helper to safely parse JSON-like content
    const parseJsonContent = (c) => {
        if (!c) return null;
        if (typeof c === "object") return c;
        try {
            return JSON.parse(c);
        } catch (e) {
            const m = String(c).match(/\{[\s\S]*\}/);
            if (m) {
                try {
                    return JSON.parse(m[0]);
                } catch (err) {
                    return null;
                }
            }
            return null;
        }
    };

    const parsed = parseJsonContent(content);

    let queryData = [];
    try {
        if (selectedOption === "ct" && parsed) {
            const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            // priority 1: courseName
            if (parsed.courseName && parsed.courseName !== "unknown") {
                const q = { courseName: { $regex: escapeRegex(parsed.courseName), $options: "i" } };
                queryData = await CTQuestion.find(q).limit(50).lean();
            }

            // priority 2: courseCode (if no results)
            if ((!queryData || queryData.length === 0) && parsed.courseCode && parsed.courseCode !== "unknown") {
                const q = { courseCode: { $regex: `^${escapeRegex(parsed.courseCode)}$`, $options: "i" } };
                queryData = await CTQuestion.find(q).limit(50).lean();
            }

            // priority 3: ctNo (if no results)
            if ((!queryData || queryData.length === 0) && parsed.ctNo && parsed.ctNo !== "unknown") {
                let nums = [];
                if (Array.isArray(parsed.ctNo)) {
                    nums = parsed.ctNo.map((n) => Number(n)).filter((n) => !Number.isNaN(n));
                } else {
                    const n = Number(parsed.ctNo);
                    if (!Number.isNaN(n)) nums = [n];
                }
                if (nums.length > 0) {
                    const q = { ctNo: { $in: nums } };
                    queryData = await CTQuestion.find(q).limit(50).lean();
                }
            }

            // priority 4: sec (if no results)
            if ((!queryData || queryData.length === 0) && parsed.sec && parsed.sec !== "unknown") {
                const q = { sec: { $regex: `^${escapeRegex(parsed.sec)}$`, $options: "i" } };
                queryData = await CTQuestion.find(q).limit(50).lean();
            }
        }
    } catch (err) {
        console.error("Error querying CTQuestion:", err);
        queryData = [];
    }

    console.log("Database queryData results:", queryData);

    // send queryData + original message to answerLLM to produce final reply
    let finalAnswer = "";
    let answerRaw = null;
    try {
        // build context payload (keep it concise)
        const context = (Array.isArray(queryData) && queryData.length > 0)
            ? `ContextRecords: ${JSON.stringify(queryData).slice(0, 60_000)}`
            : "ContextRecords: []";

        const combinedMessage = `${context}\n\nUserQuery: ${message}`;

        answerRaw = await answerChat(combinedMessage);
        finalAnswer = answerRaw?.choices?.[0]?.message?.content ?? "";
        console.log("AnswerLLM reply:", finalAnswer);
    } catch (err) {
        console.error("Error calling answerLLM:", err);
        finalAnswer = "Sorry, something went wrong while generating the answer.";
    }

    res.status(200).json({
                    success: true,
                    data:finalAnswer,
                });
    });