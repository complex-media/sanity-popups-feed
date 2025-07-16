export async function GET(request) {
    const {
      SANITY_PROJECT_ID,
      SANITY_DATASET,
      SANITY_API_VERSION,
      SANITY_TOKEN
    } = process.env;
  
    const query = encodeURIComponent(`*[_type == "popUpEvent"]{
      _id,
      title,
      "description": description[0].children[0].text,
      "imageUrl": image.asset->url,
      cta,
      startTime,
      endTime
    }`);
  
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;
  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${SANITY_TOKEN}`
      },
      cache: 'no-store'
    });
  
    const { result } = await res.json();
  
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // or restrict to 'https://lovable.app'
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
  