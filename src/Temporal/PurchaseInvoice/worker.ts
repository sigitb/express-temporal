import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
require("dotenv").config();

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.URL_TEMPORAL,
    // TLS and gRPC metadata configuration goes here.
  });
  // Step 2: Register Workflows and Activities with the Worker.
  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'accurate-sync-purchase-invoice',
    // Workflows are registered using a path as they run in a separate JS context.
    workflowsPath: require.resolve('./workflows'),
    activities,
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
