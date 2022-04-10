import DDApi from './doordash/api';

const command = process.argv[2];
const arg2 = process.argv[3];

// main
(async () => {

	// read cli commands
	if (command) {

        if (arg2 && typeof arg2 === 'string') {
            if (command === 'quote') {
                const result = await DDApi().getDeliveryQuote(arg2);
                console.log('quoted fee: ', result);
            }
            if (command === 'status') {
                const result = await DDApi().getDeliveryStatus(arg2);
                console.log(result);
            }
            if (command === 'create') {
                const result = await DDApi().createDelivery(arg2);
                console.log(result);
            }
        } else {
            console.log(
                'you need to pass in a completed order id from Liberty Burger!'
            );
        }

	} else {
		console.log('provide a console command: "quote", "create", or "status"')
	}
    
    if (command !== 'quote' && command !== 'status' && command !== 'create') {
        console.log('invalid command!');
    }

})();
