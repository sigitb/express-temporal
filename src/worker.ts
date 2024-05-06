import concurrently from 'concurrently'

const commands = [
    // 'nodemon src/Temporal/Product/worker.ts',
    'nodemon src/Temporal/Supplier/worker.ts'
];

concurrently(commands)