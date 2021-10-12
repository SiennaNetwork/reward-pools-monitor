const { CosmWasmClient } = require("secretjs");
const BigNumber = require('bignumber.js')
const Progress = require('clui').Progress;
const log = require('single-line-log').stdout;

require('dotenv').config();

const main = async () => {

  const client = new CosmWasmClient(process.env.SECRET_REST_URL);

  console.log('Getting pools from RPT...');
  const rptStatus = await client.queryContractSmart(process.env.RPT, { "status": {} });

  console.log('Querying pool status...');

  let result = [];
  let progressBar = new Progress(rptStatus.status.config.length);
  let progress = 0;

  for (const pool of rptStatus.status.config) {
    log(`Querying pool for ${pool[0]}...`)
    progress += 1;
    log(progressBar.update(progress, rptStatus.status.config.length));

    let response = await client.queryContractSmart(pool[0], { "pool_info": { "at": Date.now() } });
    result.push({
      "pool": pool[0],
      "claimed": new BigNumber(response.pool_info.pool_claimed).div(1e18).toString(10),
      "pool_balance": new BigNumber(response.pool_info.pool_balance).div(1e18).toString(10)
    });

  }
  log("Current pools status:\n");
  console.table(result);
};

main();