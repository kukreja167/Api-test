const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

function getFibonacci(n) {
  let arr = [0, 1];
  for (let i = 2; i < n; i++) {
    arr.push(arr[i - 1] + arr[i - 2]);
  }
  return arr.slice(0, n);
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function hcf(a, b) {
  return b === 0 ? a : hcf(b, a % b);
}

function lcm(a, b) {
  return (a * b) / hcf(a, b);
}

app.get('/health', (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: "kavya0794.be23@chitkara.edu.in"
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    let data;

    if (body.fibonacci !== undefined) {
      data = getFibonacci(body.fibonacci);
    } 
    else if (body.prime !== undefined) {
      data = body.prime.filter(isPrime);
    } 
    else if (body.lcm !== undefined) {
      data = body.lcm.reduce((a, b) => lcm(a, b));
    } 
    else if (body.hcf !== undefined) {
      data = body.hcf.reduce((a, b) => hcf(a, b));
    } 
    else if (body.AI !== undefined) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            { text: `Answer in ONE word only: ${body.AI}` }
          ]
        }
      ]
    }
  );

  const text =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "N/A";

  data = text.trim().split(/\s+/)[0];
}


    else {
      return res.status(400).json({ is_success: false });
    }

    res.status(200).json({
      is_success: true,
      official_email: "kavya0794.be23@chitkara.edu.in",
      data
    });

  } catch (err) {
    console.error("BFHL ERROR:", err.response?.data || err.message);
    res.status(500).json({ is_success: false });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
