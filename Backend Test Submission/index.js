import express from "express";
import bodyParser from "body-parser";
import { forwardRef } from "react";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//logging middleware

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhZGVzaGFiaW5lc2gyNUBnbWFpbC5jb20iLCJleHAiOjE3NTIyMTU3MDAsImlhdCI6MTc1MjIxNDgwMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjM1OGMyYjYxLTRmNmEtNGM2Zi1hZTU0LWI5NDM4NGRhMmQ1YiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFkZXNoIGQiLCJzdWIiOiJkMmZhNzdhZS1iMzA1LTQzZmQtYTc4Ny1hOTMzOTNkNGQwNmMifSwiZW1haWwiOiJhZGVzaGFiaW5lc2gyNUBnbWFpbC5jb20iLCJuYW1lIjoiYWRlc2ggZCIsInJvbGxObyI6InZoMTIyOTEiLCJhY2Nlc3NDb2RlIjoiQ1dicWdLIiwiY2xpZW50SUQiOiJkMmZhNzdhZS1iMzA1LTQzZmQtYTc4Ny1hOTMzOTNkNGQwNmMiLCJjbGllbnRTZWNyZXQiOiJ5VGVuV3R0WFhTeWdZa3VLIn0.3h-CR2h7Uk_0mMqyqYTPGZsAEHeRd-I5ngZnuzIBTeg";

async function Log(stack, level, logPackage, message) {
  const logData = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: logPackage.toLowerCase(),
    message
  };

  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BEARER_TOKEN}`
      },
      body: JSON.stringify(logData)
    });

    if (!response.ok) {
      console.error(`Logging failed: ${response.statusText}`);
    } else {
        console.log(response);
    }
  } catch (error) {
    console.error("Error :", error);
  }
}

// Log("backend", "debug", "handler", "Founded the error");


const urls = {};
const status = {};

function generateCode(length = 5) {
  const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  let code = "";
  for (let i = 0; i < length; i++) {
    code = code + chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateExpiry(minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    console.log(now.toISOString());
    return now.toISOString();
}

app.post('/shorturls', (req, res) => {
    const { url, validity = 30, shortcode } = req.body;
    let code = shortcode || generateCode();
    if (urls[code]) {
        code = generateCode();
    }
    const createdAt = new Date().toISOString();
    const expiry = generateExpiry(validity);
    urls[code] = {
        url,
        validity,
        createdAt,
        expiry
    };
    console.log(urls);
    status[code] = {
        clicks: 0,
        clickDetails: []
    };
    res.json({
        shortLink: `http://localhost:3000/${code}`,
        expiry
    });
});

app.get("/:shortcode", (req, res) =>{
    const shortcode = req.params;
    const data = urls[shortcode];
    const now  = new Date().toISOString()
    if(now > data.expiry) res.json({
        message : "The shorturl is expired"
    });
    status[shortcode].clicks += 1;
    status[shortcode].clickDetails.push({
        time : now,
        referrer : req.headers.referer || null,
        location : req.headers['x-forwarded-for'] || null
    })
    res.json({ message: 'Redirecting to url', url: urlData.url });
})

app.get("/", (req, res) => {
  res.send("Hi from server");
});

app.listen(port, (req, res) => {
  console.log("Server is listening");
});
