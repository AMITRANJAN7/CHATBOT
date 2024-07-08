

const express = require('express')
const cors = require('cors')

const app = express()
const PORT =  process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
require('dotenv').config()


const {GoogleGenerativeAI} = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

app.post('/gemini', async (req, res) => {
    console.log(req.body.history)
    console.log(req.body.message)

   const { history, message } = req.body;

   try {
       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
       const chat = model.startChat({ history });

       const result = await chat.sendMessage(message);
       const response = await result.response;
       const text = response.text();
       res.send(text);

   } catch (error) {
       console.error(error);
       res.status(500).send('Error processing request.');
   }
})

app.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});





