
export default async function getTokens(submissionJsonString: string) : Promise<string[]>{

    const options = {
        method: "POST",
        params: { base64_encoded: "true" },
        headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": process.env.VITE_RAPIDAPI_HOST || "",
            "X-RapidAPI-Key": process.env.VITE_RAPIDAPI_KEY || "",
        },
        body: submissionJsonString,
    };
    const url = process.env.VITE_RAPIDAPI_URL + "/batch";
    if (!url) {
        throw new Error('VITE_RAPIDAPI_URL environment variable is not set');
    }
    const response = await fetch(url, options);
    const resp = response.json() as Promise<Array<tokensObject>>;

    const tokens: Array<string> = [];
    (await resp).map(val => {
        tokens.push(val?.token);
    });
    
    return tokens;
}

interface tokensObject{
    token:string;
}