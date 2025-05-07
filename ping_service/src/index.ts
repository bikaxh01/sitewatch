import { getStats } from "./config/checks";

async function main() {
  const pingResult = await getStats("https://www.example.com");

  // save to db with region
  console.log(pingResult);
}

main();
