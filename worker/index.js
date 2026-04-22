export default {
  async fetch(request) {

    const url = "https://raw.githubusercontent.com/bllaad/cf-fast-ip/main/result.txt";
    const res = await fetch(url);
    const text = await res.text();

    const lines = text.trim().split("\n").slice(0, 50);

    const results = await Promise.all(
      lines.map(async (line) => {

        const ip = line.split("#")[0];
        const cc = line.split("#")[1] || "--";

        const start = Date.now();

        try {
          await fetch("https://" + ip, {
            method: "GET",
            mode: "no-cors"
          });

          const latency = Date.now() - start;

          return { ip, cc, latency };

        } catch (e) {
          return { ip, cc, latency: 9999 };
        }

      })
    );

    results.sort((a, b) => a.latency - b.latency);

    return new Response(JSON.stringify(results), {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}