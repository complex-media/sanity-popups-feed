export async function GET(request) {
  const {
    SANITY_PROJECT_ID,
    SANITY_DATASET,
    SANITY_API_VERSION,
    SANITY_TOKEN
  } = process.env;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'popUpEvent';
  const slug = searchParams.get('slug');

  // Dynamic field map based on type
  const fieldMap = {
    popUpEvent: `
      _id,
      title,
      subtitle,
      "slug": alias.current,
      "description": description[0].children[0].text,
      "imageUrl": media.secure_url,
      "ctaText": promoCTA.text,
      "ctaLink": promoCTA.url,
      locationName,
      locationAddress,
      startDate,
      endDate,
      status,
      visibleInApp
    `,
    familyStyleEvent: `
      _id,
      title,
      subtitle,
      "slug": alias.current,
      "description": description[0].children[0].text,
      "imageUrl": media.secure_url,
      "brandLogo": brandLogo.secure_url,
      locationName,
      locationAddress,
      "ctaText": "Buy Tickets",
      "ctaLink": ticketingPageUrl,
      startDate,
      endDate,
      status,
      visibleInApp,
      "instagramUrl": socialHandles.instagramUrl
    `
  };

  const selectedFields = fieldMap[type] || '_id';
  const filter = slug
    ? `*[_type == "${type}" && alias.current == "${slug}"][0]`
    : `*[_type == "${type}"]`;

  const query = encodeURIComponent(`${filter}{${selectedFields}}`);
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
