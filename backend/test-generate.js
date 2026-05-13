const { GoogleGenerativeAI } = require('@google/generative-ai');
const dns = require('node:dns');

dns.setDefaultResultOrder('ipv4first');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const apiKey = 'AIzaSyAp4xiIYGxrCqm-uv-osha_x40hUiLSVnk';
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("hello");
        console.log(`[SUCCESS] ${modelName}:`, result.response.text());
    } catch (e) {
        console.log(`[ERROR] ${modelName}:`, e.message);
    }
}

async function run() {
    await testModel('gemini-flash-latest');
    await testModel('gemini-2.5-flash');
    await testModel('gemini-2.5-flash-lite');
    await testModel('gemini-3.1-flash-lite');
}

run();
