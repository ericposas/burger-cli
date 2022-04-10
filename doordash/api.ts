require('dotenv').config();
const axios = require('axios');
const moment = require('moment');
import { AxiosResponse } from "axios";
const { v4: uuidv4 } = require('uuid');
const { getJWT } = require('../get-jwt');
import libBurgApi from "../libertyburger/api";
import { CompletedOrderResponse } from '../libertyburger/types';
import { CreateDeliveryBody, CreateDeliveryResponse, DeliveryQuoteBody, DeliveryQuoteResponse, DeliveryStatusResponse } from '../doordash/types';

const getHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${getJWT()}`,
        'Content-Type': 'application/json'
    }
});

const convertOrderValue = (total: number) => {
    const ogVal = total.toString();
    if (ogVal.indexOf('.') > -1) {
        const firstPart = ogVal.slice(0, ogVal.indexOf('.'))
        const lastPart = ogVal.slice(ogVal.indexOf('.') + 1, ogVal.length);
        return Number(firstPart.concat(lastPart));
    }
    return total;
};

export default () => ({
    
    getDeliveryQuote: async (liberty_burger_completed_order_id: string): Promise<number> => {
        try {
            // get completed order data from Liberty
            const completedOrder: CompletedOrderResponse = await libBurgApi().getCompletedOrderInfo(liberty_burger_completed_order_id, `${process.env.restaurantGuid}`);
            console.log(
                completedOrder
            );
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
                dropoff_instructions: `${process.env.dropoff_instructions}`,
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
            const endpoint = 'https://openapi.doordash.com/drive/v2/quotes';
            const result: AxiosResponse<DeliveryQuoteResponse> = await axios.post(endpoint, body, getHeaders());
            return Promise.resolve(result.data.fee);
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },
    
    createDelivery: async (liberty_burger_completed_order_id: string): Promise<CreateDeliveryResponse> => {
        try {
            // get completed order data from Liberty
            const completedOrder: CompletedOrderResponse = await libBurgApi().getCompletedOrderInfo(liberty_burger_completed_order_id, `${process.env.restaurantGuid}`);
            console.log(
                completedOrder
            );
            // prepare body to send to DD
            const endpoint = 'https://openapi.doordash.com/drive/v2/deliveries';
            const body = JSON.stringify(<CreateDeliveryBody>{
                external_delivery_id: uuidv4(),
                pickup_address: completedOrder[0].data.completedOrder.restaurant.location.address1,
                pickup_business_name: completedOrder[0].data.completedOrder.restaurant.name,
                pickup_phone_number: completedOrder[0].data.completedOrder.restaurant.location.phone,
                pickup_instructions: completedOrder[0].data.completedOrder.guestCommunication,
                dropoff_address: process.env.doordash_address,
                dropoff_business_name: `${process.env.dropoff_business_name}`,
                dropoff_phone_number: `+1${process.env.phone}`,
                dropoff_instructions: `${process.env.dropoff_instructions}`,
                order_value: convertOrderValue(completedOrder[0].data.completedOrder.total)
            });
            // send body to DD create delivery endpoint 
            const result: AxiosResponse<CreateDeliveryResponse> = await axios.post(endpoint, body, getHeaders());
            return Promise.resolve(result.data);
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },
    
    getDeliveryStatus: async (external_delivery_id: string): Promise<DeliveryStatusResponse> => {
        try {
            const endpoint = `https://openapi.doordash.com/drive/v2/deliveries/${external_delivery_id}`;
            const result: AxiosResponse<DeliveryStatusResponse> = await axios.get(endpoint, getHeaders());
            return Promise.resolve(result.data);
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    }

});
