import { AxiosResponse } from "axios";

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { convertOrderValue, completedOrderExample, getHeaders } = require('./get-delivery-quote.ts');

const command = process.argv[2];
const arg2 = process.argv[3];

type CreateDeliveryBody = {
	external_delivery_id: string,
	pickup_address: string,
	pickup_business_name: string,
	pickup_phone_number: string,
	dropoff_address: string,
	dropoff_business_name: string,
	dropoff_phone_number: string,
	dropoff_instructions: string,
	order_value: string
};

const body = JSON.stringify(<CreateDeliveryBody>{
	external_delivery_id: uuidv4(),
	pickup_address: completedOrderExample[0].data.completedOrder.restaurant.location.address1,
	pickup_business_name: completedOrderExample[0].data.completedOrder.restaurant.name,
	pickup_phone_number: completedOrderExample[0].data.completedOrder.restaurant.location.phone,
	pickup_instructions: completedOrderExample[0].data.completedOrder.guestCommunication,
	dropoff_address: process.env.doordash_address,
	dropoff_business_name: `${process.env.dropoff_business_name}`,
	dropoff_phone_number: `+1${process.env.phone}`,
	dropoff_instructions: "Ring doorbell and/or text please!",
	order_value: convertOrderValue(completedOrderExample[0].data.completedOrder.total)
});

type CreateDeliveryResponse = {
	external_delivery_id: string, 
	currency: string | 'USD',
	delivery_status: string | 'created',
	fee: number,
	pickup_address: string,
	pickup_business_name: string,
	pickup_phone_number: string,
	pickup_instructions: string,
	dropoff_address: string,
	dropoff_business_name: string,
	dropoff_phone_number: string,
	dropoff_instructions: string,
	order_value: number,
	pickup_time_estimated: string,
	dropoff_time_estimated: string,
	support_reference: string,
	tracking_url: string,
	contactless_dropoff: boolean,
	tip: boolean
};

const createDelivery = async (): Promise<CreateDeliveryResponse> => {
	try {
		const result: AxiosResponse<CreateDeliveryResponse> = await axios.post('https://openapi.doordash.com/drive/v2/deliveries', body, getHeaders());
		return Promise.resolve(result.data);
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
};

const getDeliveryStatus = async (external_delivery_id: string) => {
	try {
		const result: AxiosResponse<any> = await axios.get(`https://openapi.doordash.com/drive/v2/deliveries/${external_delivery_id}`, getHeaders());
		return Promise.resolve(result.data);
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
};

// main
(async () => {
	// read cli commands
	if (command) {
		if (command === 'status' && arg2 && typeof arg2 === 'string') {
			const result = await getDeliveryStatus(arg2);
			console.log(result);
		}
		if (command === 'create') {
			const result = await createDelivery();
			console.log(result);
		}
	} else {
		console.log('provide a console command: "create" -- creates a delivery (will need to pass in order details from Liberty Burger) or "status" w/a passing in external_delivery_id string checks status of a delivery')
	}
})();
