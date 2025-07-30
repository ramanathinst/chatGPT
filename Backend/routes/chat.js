import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

router.post("/test", async (req, res) => {

  try {
    const thread = new Thread({
        threadId : "this-is-a-test-kamana",
        title: "Test Thread to Check API",
     });
    const response = await thread.save();
   res.send(response);
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all threads

router.get("/threads", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (error) {
    console.error("Error fetching single thread: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/chat" , async(req ,res ) => {
  const { threadId , message } = req.body;

  if(!threadId & !message ) {
    return res.status(400).json({
      error: "Thread Id and Message fiels are requird!"
    })
  }

  try {
    let thread = await Thread.findOne({threadId})

    if(!thread){
      thread = new Thread({
        threadId,
        title : message,
        messages: [{ role : "user" , content : message}]
      })
    }else {
      thread.messages.push({role:"user", content: message})
    }

    const assistantReply = await getOpenAIAPIResponse(message)
    thread.messages.push({ role: "assistant", content: assistantReply })
    thread.updatedAt = new Date()
    await thread.save();

    res.status(200).json({
      reply : assistantReply
    })

  } catch (error) {
    console.log(error , "Catching the chat error")
    res.status(500).json({
    message :  "Something went wrong enternal error!"
    })
  }
})

export default router;