const { CosmWasmClient } = require("secretjs");
const BigNumber = require('bignumber.js')

require('dotenv').config();

const main = async () => {

  const client = new CosmWasmClient(process.env.SECRET_REST_URL);

  console.log('Getting pools from RPT...');
  const rptStatus = await client.queryContractSmart(process.env.RPT, { "status": {} });

  console.log('Querying pool status...');

  let result = [];
  
  for (const pool of rptStatus.status.config) {
    console.log(`Querying pool for ${pool[0]}...`)

    let response = await client.queryContractSmart(pool[0], { "pool_info": { "at": Date.now() } });
    result.push({
      "pool": pool[0],
      "claimed": new BigNumber(response.pool_info.pool_claimed).div(1e18).toString(10),
      "pool_balance": new BigNumber(response.pool_info.pool_balance).div(1e18).toString(10)
    });
  }
  console.log("Current pools status:");
  console.table(result);
};

main();