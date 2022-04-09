import { AxiosResponse } from "axios";
import { CompletedOrderResponse, getCompletedOrderInfo } from "./liberty-burger-menu-test";

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { getJWT } = require('./get-jwt');

const getHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${getJWT()}`,
        'Content-Type': 'application/json'
    }
});

const command = process.argv[2];
const arg2 = process.argv[3];

const convertOrderValue = (total: number) => {
	const ogVal = total.toString();
	if (ogVal.indexOf('.') > -1) {
		const firstPart = ogVal.slice(0, ogVal.indexOf('.'))
		const lastPart = ogVal.slice(ogVal.indexOf('.') + 1, ogVal.length);
		return Number(firstPart.concat(lastPart));
	}
	return total;
};

const completedOrderExample: CompletedOrderResponse = [
    {
        data: {
            completedOrder: {
                guid: "cc320a08-dfaf-43ab-8b53-ece2d36f03ae",
                restaurant: {
                    guid: '79eabbd6-b99d-4070-ad88-269906815528',
                    name: 'Liberty Burger - Lakewood',
                    whiteLabelName: 'Liberty Burger Lakewood',
                    timeZoneId: 'America/Chicago',
                    location: {
                        address1: '1904 Abrams Parkway',
                        address2: null,
                        city: 'Dallas',
                        state: 'TX',
                        phone: '2148879999',
                        __typename: 'Location'
                    },
                    creditCardConfig: {
                        amexAccepted: true,
                        tipEnabled: true,
                        __typename: 'RestaurantCreditCardConfig'
                    },
                    loyaltyConfig: {
                        loyaltyRedemptionEnabled: false,
                        loyaltySignupEnabled: false,
                        loyaltySignupBonus: null,
                        __typename: 'LoyaltyConfig'
                    },
                    socialMediaLinks: {
                        twitterLink: null,
                        facebookLink: '',
                        __typename: 'SocialMediaLinks'
                    },
                    __typename: 'Restaurant'
                },
                customerV2: null,
                selections: [
                    {
                        modifiers: [],
                        name: 'Baby Bella',
                        price: 9,
                        preDiscountPrice: 9,
                        usesFractionalQuantity: false,
                        fractionalQuantity: [Object],
                        __typename: 'CompletedOrderSelection'
                      }
                ],
                discounts: {
                    restaurantDiscount: null,
                    loyaltyDiscount: null,
                    globalReward: null,
                    __typename: 'Discounts'
                },
                discountsTotal: 0,
                checkNumber: 74,
                checkGuid: '64f3b9cd-f2b4-4471-912c-96452bebd076',
                guestCommunication: 'When you come to pick up your ToGo order, please enter through the ToGo Door off the breezeway and proceed to the Togo Counter.',
                deliveryChargeTotal: 0,
                serviceChargeTotal: 0,
                tfgRoundUpTotal: 0,
                subtotal: 9,
                tax: 0.74,
                tip: 1.95,
                total: 11.69,
                estimatedFulfillmentDate: 1649526869413,
                paymentType: 'CREDIT',
                orderPaymentGuid: 'c97eed18-aa0c-4d76-b8b7-29eef60a31fe',
                hasLoyaltyAttached: false,
                curbsidePickup: { selected: false, __typename: 'CurbsidePickup' },
                curbsidePickupV2: null,
                giftCard: null,
                deliveryInfo: null,
                __typename: 'CompletedOrder'
            }
        }
    }
];

type DeliveryQuoteBody = {
    external_delivery_id: string,
    locale: string | "en-US",
    pickup_address: string,
    pickup_business_name: string,
    pickup_phone_number: string,
    pickup_instructions: string,
    pickup_reference_tag: string | number,
    dropoff_address: string,
    dropoff_business_name: string,
    dropoff_phone_number: string,
    dropoff_instructions: string,
    dropoff_contact_given_name: string,
    dropoff_contact_family_name: string,
    dropoff_contact_send_notifications: boolean,
    order_value: number,
    currency: string | "USD",
    contactless_dropoff: boolean,
    tip: number | 499,
    pickup_time: string,
    dropoff_time: string,
    pickup_window: {
        start_time: string,
        end_time: string
    },
    dropoff_window: {
        start_time: string,
        end_time: string
    }
};

export type DeliveryQuoteResponse = {
    external_delivery_id: string,
    currency: string | 'USD',
    delivery_status: string | 'quote',
    fee: number,
    locale: string | 'en-US',
    pickup_address: string,
    pickup_business_name: string,
    pickup_phone_number: string,
    pickup_instructions: string,
    pickup_reference_tag: string,
    dropoff_address: string,
    dropoff_business_name: string,
    dropoff_phone_number: string,
    dropoff_instructions: string,
    dropoff_contact_given_name: string,
    dropoff_contact_family_name: string,
    dropoff_contact_send_notifications: boolean,
    order_value: number,
    pickup_time_estimated: string,
    dropoff_time_estimated: string,
    support_reference: string,
    tracking_url: string,
    contactless_dropoff: boolean,
    tip: number
};

type CreateDeliveryBody = {
	external_delivery_id: string,
	pickup_address: string,
	pickup_business_name: string,
	pickup_phone_number: string,
	dropoff_address: string,
	dropoff_business_name: string,
	dropoff_phone_number: string,
	dropoff_instructions: string,
	order_value: number
};

const createDeliveryBody = JSON.stringify(<CreateDeliveryBody>{
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

const getDeliveryQuote = async (liberty_burger_completed_order_id: string): Promise<number> => {
    try {
        // get completed order data from Liberty
        const completedOrder: CompletedOrderResponse = await getCompletedOrderInfo(liberty_burger_completed_order_id);
        console.log(
            completedOrder
        )
        // package it in the format DD expects
        const body = JSON.stringify(<DeliveryQuoteBody>{
            external_delivery_id: uuidv4(),
            locale: "en-US",
            pickup_address: completedOrder[0].data.completedOrder.restaurant.location.address1,
            pickup_business_name: completedOrder[0].data.completedOrder.restaurant.name,
            pickup_phone_number: completedOrder[0].data.completedOrder.restaurant.location.phone,
            pickup_instructions: completedOrder[0].data.completedOrder.guestCommunication,
            pickup_reference_tag: completedOrder[0].data.completedOrder.checkNumber,
            dropoff_address: `${process.env.dropoff_address}`,
            dropoff_business_name: `${process.env.dropoff_business_name}`,
            dropoff_phone_number: `${process.env.phone}`,
            dropoff_instructions: "ring doorbell and dropoff please.",
            dropoff_contact_given_name: `${process.env.firstName}`,
            dropoff_contact_family_name: `${process.env.lastName}`,
            dropoff_contact_send_notifications: true,
            order_value: convertOrderValue(completedOrder[0].data.completedOrder.total),
            currency: "USD",
            contactless_dropoff: false,
            tip: 499,
            pickup_time: moment(completedOrder[0].data.completedOrder.estimatedFulfillmentDate).add(15, 'm').toDate(),
            dropoff_time: moment(completedOrder[0].data.completedOrder.estimatedFulfillmentDate).add(45, 'm').toDate(),
            pickup_window: {
                start_time: moment(completedOrder[0].data.completedOrder.estimatedFulfillmentDate).toDate(),
                end_time: moment(completedOrder[0].data.completedOrder.estimatedFulfillmentDate).add(20, 'm').toDate()
            },
            dropoff_window: {
                start_time: moment(completedOrder[0].data.completedOrder.estimatedFulfillmentDate).add(30, 'm'),
                end_time: moment(completedOrder[0].data.completedOrder.estimatedFulfillmentDate).add(60, 'm')
            }
        });
        // get a quote from DD on delivery
        const result: AxiosResponse<DeliveryQuoteResponse> = await axios.post('https://openapi.doordash.com/drive/v2/quotes', body, getHeaders());
        return Promise.resolve(result.data.fee);
    } catch (err) {
        console.error(err);
        return Promise.reject(err);
    }
};

const createDelivery = async (): Promise<CreateDeliveryResponse> => {
	try {
		const result: AxiosResponse<CreateDeliveryResponse> = await axios.post('https://openapi.doordash.com/drive/v2/deliveries', createDeliveryBody, getHeaders());
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
        if (command === 'quote') {
            if (arg2 && typeof arg2 === 'string') {
                const result = await getDeliveryQuote(arg2);
                console.log('quoted fee: ', result);
            } else {
                console.log(
                    'you need to pass in a completed order id from Liberty Burger!'
                );
            }
        }
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
    if (command !== 'quote' && command !== 'status' && command !== 'create') {
        console.log('invalid command!');
    }
})();

// getDeliveryQuote();

module.exports = {
    getHeaders,
    completedOrderExample,
    convertOrderValue
};
