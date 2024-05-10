import concurrently from 'concurrently'

const commands = [
    // 'nodemon src/Temporal/Product/worker.ts',
    // 'nodemon src/Temporal/Supplier/worker.ts',
    // 'nodemon src/Temporal/PurchasingOrder/worker.ts',
    'nodemon src/Temporal/PurchaseInvoice/worker.ts'
];

concurrently(commands)