export type DeliveryQuoteBody = {
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

export type CreateDeliveryBody = {
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

export type CreateDeliveryResponse = {
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

export type DeliveryStatusResponse = {
    external_delivery_id: string,
    currency: string | 'USD',
    delivery_status: string,
    fee: number,
    pickup_address: string,
    pickup_business_name: string,
    pickup_phone_number: string,
    pickup_instructions: string,
    dropoff_address: string,
    dropoff_business_name: string,
    dropoff_phone_number: string,
    dropoff_instructions: string,
    dropoff_contact_given_name: string,
    dropoff_contact_family_name: string,
    dropoff_contact_send_notifications: boolean,
    order_value: number,
    cancellation_reason: string,
    pickup_time_estimated: string,
    dropoff_time_estimated: string,
    support_reference: string,
    tracking_url: string,
    contactless_dropoff: boolean,
    tip: number
  };
