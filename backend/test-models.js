// Use native fetch

async function listModels() {
    try {
        const apiKey = 'AIzaSyAp4xiIYGxrCqm-uv-osha_x40hUiLSVnk';
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            console.log("AVAILABLE MODELS:");
            data.models.forEach(m => {
                if(m.supportedGenerationMethods.includes("generateContent")) {
                    console.log("- " + m.name.replace('models/', ''));
                }
            });
        } else {
            console.error("Error fetching models:", data);
        }
    } catch (e) {
        console.error("Fetch error:", e.message);
    }
}
listModels();
