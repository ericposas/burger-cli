import { AxiosResponse } from "axios";

require('dotenv').config();

const axios = require('axios');
const moment = require('moment');
const term = require('terminal-kit').terminal;
const currency = require('currency.js');
const imgPx = 25;

const headers = { 'content-type': 'application/json' };

type Modifier = {
	itemGuid: string,
	itemGroupGuid: string,
	quantity: number,
	modifierGroups: ModifierGroup[] | undefined
};

type ModifierGroup = {
	[index: number]: {
		guid: string,
		modifiers: Modifier[] | undefined
	}
};

export type CartSelection = {
	itemGuid: string,
	itemGroupGuid: string,
	quantity: number,
	modifierGroups: ModifierGroup[],
	specialInstructions: string,
	itemMasterId: string
};

type WarningMessage = {
	code: string,
	message: string,
	__typename: string
};

// Tricky type bc Cart has a nested "cart" prop --
// We sometimes just need the inner-part of "cart"
// so we'll access that via Cart["cart"]
type Cart = {
	cart: {
		guid: string, //'ee791db6-3844-4783-8a41-80a595fab21a',
		order: {
			deliveryInfo: null,
			numberOfSelections: number,
			selections: CartSelection[],
			discounts: {
			restaurantDiscount: null,
			loyaltyDiscount: null,
			globalReward: null,
			__typename: string,
			},
			discountsTotal: number,
			deliveryChargeTotal: number,
			serviceChargeTotal: number,
			subtotal: number,
			tax: number,
			total: number,
			__typename: string
		},
		quoteTime: number,
		paymentOptions: {
			atCheckout: any[],
			uponReceipt: any[],
			__typename: string
		},
		preComputedTips:  { percent: number, value: number, __typename: string }[],
		approvalRules: any[],
		diningOptionBehavior: string,
		fulfillmentType: string,
		fulfillmentDateTime: null,
		takeoutQuoteTime: number,
		deliveryQuoteTime: number,
		deliveryProviderInfo: null,
		cartUpsellInfo: {
			upsellItems: {
				[index: number]: string
			},
		__typename: string
		},
		warnings: WarningMessage[],
		info: [],
		__typename: string
	}
};

type AddItemResponse = {
	[index: number]: {
		data: {
			addItemToCartV2: Cart
		}
	}
};

const getRestaurantDataAndAvailableTimes = async (restaurantGuid: string) => {
	try {
		const result = await axios.post('https://ws-api.toasttab.com/consumer-app-bff/v1/graphql',
			[
				{
					operationName: "RESTAURANT_INFO",
					variables: {
						restaurantGuid //"79eabbd6-b99d-4070-ad88-269906815528"
					},
					query: "query RESTAURANT_INFO($restaurantGuid: ID!) {\n  restaurantV2(guid: $restaurantGuid) {\n    ... on Restaurant {\n      guid\n      whiteLabelName\n      description\n      imageUrl\n      bannerUrls {\n        raw\n        __typename\n      }\n      minimumTakeoutTime\n      minimumDeliveryTime\n      location {\n        address1\n        address2\n        city\n        state\n        zip\n        phone\n        latitude\n        longitude\n        __typename\n      }\n      logoUrls {\n        small\n        __typename\n      }\n      schedule {\n        asapAvailableForTakeout\n        todaysHoursForTakeout {\n          startTime\n          endTime\n          __typename\n        }\n        upcomingSchedules {\n          behavior\n          dailySchedules {\n            date\n            servicePeriods {\n              startTime\n              endTime\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      timeZoneId\n      onlineOrderingEnabled\n      socialMediaLinks {\n        facebookLink\n        twitterLink\n        instagramLink\n        __typename\n      }\n      giftCardLinks {\n        purchaseLink\n        checkValueLink\n        addValueEnabled\n        __typename\n      }\n      giftCardConfig {\n        redemptionAllowed\n        __typename\n      }\n      specialRequestsConfig {\n        enabled\n        placeholderMessage\n        __typename\n      }\n      spotlightConfig {\n        headerText\n        bodyText\n        __typename\n      }\n      curbsidePickupConfig {\n        enabled\n        enabledV2\n        __typename\n      }\n      popularItemsConfig {\n        enabled\n        __typename\n      }\n      upsellsConfig {\n        enabled\n        __typename\n      }\n      creditCardConfig {\n        amexAccepted\n        tipEnabled\n        __typename\n      }\n      __typename\n    }\n    ... on GeneralError {\n      code\n      message\n      __typename\n    }\n    __typename\n  }\n}\n"
				},
				{
					operationName: "DINING_OPTIONS",
					variables: {
						input: {
							restaurantGuid,
							includeBehaviors: []
						}
					},
					query: "query DINING_OPTIONS($input: DiningOptionsInput!) {\n  diningOptions(input: $input) {\n    guid\n    behavior\n    deliveryProvider {\n      provider\n      __typename\n    }\n    asapSchedule {\n      availableNow\n      availableAt\n      __typename\n    }\n    futureSchedule {\n      dates {\n        date\n        timesAndGaps {\n          ... on FutureFulfillmentTime {\n            time\n            __typename\n          }\n          ... on FutureFulfillmentServiceGap {\n            description\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
				}
			],
			headers
		);

		console.log(
			//result.data,
			//`\nrestaurant V2: \n`, result.data[0].data.restaurantV2,
			//`\n\ndining options: \n`, result.data[1].data.diningOptions
		);
		return Promise.resolve(result);

	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
};

const getMenu = async (restaurantGuid: string) => {
	try {
		const result = await axios.post('https://ws-api.toasttab.com/consumer-app-bff/v1/graphql',
			[
				{
					operationName: "POPULAR_ITEMS",
					variables: {
						input: {
							restaurantGuid,
							menusInput: {
								restaurantGuid,
								shortUrl: "liberty-burger-lakewood",
								menuApi: "DO"
							}
						}
					},
					query: "query POPULAR_ITEMS($input: PopularItemsInput!) {\n  popularItems(input: $input) {\n    ... on PopularItemsResponse {\n      items {\n        name\n        guid\n        itemGroupGuid\n        imageUrl\n        price\n        __typename\n      }\n      __typename\n    }\n    ... on PopularItemsError {\n      message\n      __typename\n    }\n    __typename\n  }\n}\n"
				},
				{
					operationName: "MENUS",
					variables: {
						input: {
							shortUrl: "liberty-burger-lakewood",
							restaurantGuid,
							menuApi: "DO"
						}
					},
					query: "query MENUS($input: MenusInput!) {\n  menusV3(input: $input) {\n    ... on MenusResponse {\n      menus {\n        id\n        name\n        groups {\n          guid\n          name\n          description\n          items {\n            description\n            guid\n            name\n            outOfStock\n            price\n            imageUrl\n            calories\n            itemGroupGuid\n            unitOfMeasure\n            usesFractionalQuantity\n            masterId\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on GeneralError {\n      code\n      message\n      __typename\n    }\n    __typename\n  }\n}\n"
				}
			],
			headers
		);

		console.log(
			//`\nresult.data[0].data.popularItems.items: \n`, result.data[0].data.popularItems.items,
			//`\n\nresult.data[1].data.menusV3.menus: \n`, result.data[1].data.menusV3.menus,
			//'\n\n..menuV3.menus[0].groups: \n', result.data[1].data.menusV3.menus[0].groups,
			//`\n\nBurgers: \n`, result.data[1].data.menusV3.menus[0].groups[0].items
		);

		return Promise.resolve(result);

	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
};

const getAvailability = async (restaurantGuid: string) => {
	const result = await getRestaurantDataAndAvailableTimes(restaurantGuid);
	const availAt = result.data[1].data.diningOptions[0].asapSchedule;
	const formatted = moment(availAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
	console.log(formatted, `\n\n${moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}\n`);
};

type Burger = {
	description: string,
	guid: string, // '70270b73-243b-48c1-aa18-40c245313b56',
	name: string,
	outOfStock: boolean,
	price: number,
	imageUrl: string,
	calories: null,
	itemGroupGuid: string,
	unitOfMeasure: string,
	usesFractionalQuantity: boolean,
	masterId: string,
	__typename: string
};

const getBurgers = async (restaurantGuid: string): Promise<Burger[]> => {
	try {
		const fullMenu = await getMenu(restaurantGuid);
		const burgers = fullMenu.data[1].data.menusV3.menus[0].groups[0].items;
		return Promise.resolve(burgers);
	} catch (err) {
		return Promise.reject(err);
	}
};

type Guid = {
	guid: string,
	itemGroupGuid: string,
	masterId: string
};

const getBurgerGuids = async (restaurantGuid: string): Promise<Guid[]> => {
	try {
		const burgs = await getBurgers(restaurantGuid);
		const guids = burgs.reduce((acc: any, curr: any) => {
			acc[curr.name] = {};
			acc[curr.name]['guid'] = curr.guid;
			acc[curr.name]['itemGroupGuid'] = curr.itemGroupGuid;
			acc[curr.name]['masterId'] = curr.masterId;
			return acc;
		}, {} as Record<string, string>);
		return Promise.resolve(guids);
	} catch (err) {
		return Promise.reject(err);
	}
};

const addItemToCart = async (restaurantGuid, selection: CartSelection): Promise<Cart> => {
	try {
		const endpoint = 'https://ws-api.toasttab.com/consumer-app-bff/v1/graphql';
		const body = [
			{
				operationName: "ADD_ITEM_TO_CART",
				variables: {
					input: {
						createCartInput: {
							restaurantGuid, //: `${process.env.restaurantGuid}`, //"79eabbd6-b99d-4070-ad88-269906815528",
							orderSource: "ONLINE",
							cartFulfillmentInput: {
								fulfillmentDateTime: null,
								fulfillmentType: "ASAP",
								diningOptionBehavior: "TAKE_OUT"
							}
						},
						selection: selection
					}
				},
				query: "mutation ADD_ITEM_TO_CART($input: AddItemToCartInputV2!) {\n  addItemToCartV2(input: $input) {\n    ... on CartResponse {\n      ...cartResponse\n      __typename\n    }\n    ... on CartModificationError {\n      code\n      message\n      __typename\n    }\n    ... on CartOutOfStockError {\n      cart {\n        ...cart\n        __typename\n      }\n      message\n      items {\n        name\n        guid\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment cartResponse on CartResponse {\n  cart {\n    ...cart\n    __typename\n  }\n  warnings {\n    code\n    message\n    __typename\n  }\n  info {\n    code\n    message\n    __typename\n  }\n  __typename\n}\n\nfragment cart on Cart {\n  guid\n  order {\n    deliveryInfo {\n      address1\n      address2\n      city\n      state\n      zipCode\n      latitude\n      longitude\n      notes\n      __typename\n    }\n    numberOfSelections\n    selections {\n      guid\n      groupingKey\n      itemGuid\n      itemGroupGuid\n      name\n      preDiscountPrice\n      price\n      quantity\n      usesFractionalQuantity\n      fractionalQuantity {\n        unitOfMeasure\n        quantity\n        __typename\n      }\n      modifiers {\n        guid\n        name\n        price\n        groupingKey\n        modifiers {\n          guid\n          name\n          price\n          groupingKey\n          modifiers {\n            guid\n            name\n            price\n            groupingKey\n            modifiers {\n              guid\n              name\n              price\n              groupingKey\n              modifiers {\n                guid\n                name\n                price\n                groupingKey\n                modifiers {\n                  guid\n                  name\n                  price\n                  groupingKey\n                  modifiers {\n                    guid\n                    name\n                    price\n                    groupingKey\n                    modifiers {\n                      guid\n                      name\n                      price\n                      groupingKey\n                      modifiers {\n                        guid\n                        name\n                        price\n                        groupingKey\n                        modifiers {\n                          guid\n                          name\n                          price\n                          groupingKey\n                          __typename\n                        }\n                        __typename\n                      }\n                      __typename\n                    }\n                    __typename\n                  }\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    discounts {\n      restaurantDiscount {\n        guid\n        name\n        amount\n        promoCode\n        __typename\n      }\n      loyaltyDiscount {\n        guid\n        amount\n        __typename\n      }\n      globalReward {\n        amount\n        name\n        rewardType\n        total\n        __typename\n      }\n      __typename\n    }\n    discountsTotal\n    deliveryChargeTotal\n    serviceChargeTotal\n    subtotal\n    tax\n    total\n    __typename\n  }\n  quoteTime\n  paymentOptions {\n    atCheckout {\n      paymentType\n      __typename\n    }\n    uponReceipt {\n      paymentType\n      __typename\n    }\n    __typename\n  }\n  preComputedTips {\n    percent\n    value\n    __typename\n  }\n  approvalRules {\n    ruleType\n    requiredAdjustment\n    thresholdAmount\n    __typename\n  }\n  diningOptionBehavior\n  fulfillmentType\n  fulfillmentDateTime\n  takeoutQuoteTime\n  deliveryQuoteTime\n  deliveryProviderInfo {\n    provider\n    needsDeliveryCommunicationConsent\n    __typename\n  }\n  cartUpsellInfo {\n    upsellItems\n    __typename\n  }\n  __typename\n}\n"
			}
		];
		const addItem: AxiosResponse<AddItemResponse> = await axios.post(endpoint, body, headers);
		const warnings = addItem.data[0].data.addItemToCartV2.cart.warnings;
		if (warnings && warnings.length) {
			const combinedWarnings = warnings.reduce((a, c, i) => c.message + " " + a, "");
			throw new Error(combinedWarnings);
		}

		return Promise.resolve(addItem.data[0].data.addItemToCartV2);
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
};

type GetCartResponse = {
	[index: number]: {
		data: CartV2
	}
};

type CartV2 = {
	cartV2: Cart
};

const getCartForCheckout = async (cartGuid: string): Promise<Cart["cart"]> => {
	try {
		const endpoint = 'https://ws-api.toasttab.com/consumer-app-bff/v1/graphql';
		const body = [
			{
				operationName: "GET_CART_FOR_CHECKOUT",
				query: "query GET_CART_FOR_CHECKOUT($guid: ID!) {\n  cartV2(guid: $guid) {\n    ... on CartResponse {\n      cart {\n        ...cart\n        restaurant {\n          creditCardConfig {\n            amexAccepted\n            tipEnabled\n            __typename\n          }\n          loyaltyConfig {\n            loyaltyRedemptionEnabled\n            loyaltySignupEnabled\n            loyaltySignupBonus\n            __typename\n          }\n          tfgConfig {\n            serviceChargeGuid\n            campaignName\n            campaignDescription\n            campaignLogoURL\n            active\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      warnings {\n        code\n        message\n        __typename\n      }\n      info {\n        code\n        message\n        __typename\n      }\n      __typename\n    }\n    ... on CartError {\n      code\n      message\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment cart on Cart {\n  guid\n  order {\n    deliveryInfo {\n      address1\n      address2\n      city\n      state\n      zipCode\n      latitude\n      longitude\n      notes\n      __typename\n    }\n    numberOfSelections\n    selections {\n      guid\n      groupingKey\n      itemGuid\n      itemGroupGuid\n      name\n      preDiscountPrice\n      price\n      quantity\n      usesFractionalQuantity\n      fractionalQuantity {\n        unitOfMeasure\n        quantity\n        __typename\n      }\n      modifiers {\n        guid\n        name\n        price\n        groupingKey\n        modifiers {\n          guid\n          name\n          price\n          groupingKey\n          modifiers {\n            guid\n            name\n            price\n            groupingKey\n            modifiers {\n              guid\n              name\n              price\n              groupingKey\n              modifiers {\n                guid\n                name\n                price\n                groupingKey\n                modifiers {\n                  guid\n                  name\n                  price\n                  groupingKey\n                  modifiers {\n                    guid\n                    name\n                    price\n                    groupingKey\n                    modifiers {\n                      guid\n                      name\n                      price\n                      groupingKey\n                      modifiers {\n                        guid\n                        name\n                        price\n                        groupingKey\n                        modifiers {\n                          guid\n                          name\n                          price\n                          groupingKey\n                          __typename\n                        }\n                        __typename\n                      }\n                      __typename\n                    }\n                    __typename\n                  }\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    discounts {\n      restaurantDiscount {\n        guid\n        name\n        amount\n        promoCode\n        __typename\n      }\n      loyaltyDiscount {\n        guid\n        amount\n        __typename\n      }\n      globalReward {\n        amount\n        name\n        rewardType\n        total\n        __typename\n      }\n      __typename\n    }\n    discountsTotal\n    deliveryChargeTotal\n    serviceChargeTotal\n    subtotal\n    tax\n    total\n    __typename\n  }\n  quoteTime\n  paymentOptions {\n    atCheckout {\n      paymentType\n      __typename\n    }\n    uponReceipt {\n      paymentType\n      __typename\n    }\n    __typename\n  }\n  preComputedTips {\n    percent\n    value\n    __typename\n  }\n  approvalRules {\n    ruleType\n    requiredAdjustment\n    thresholdAmount\n    __typename\n  }\n  diningOptionBehavior\n  fulfillmentType\n  fulfillmentDateTime\n  takeoutQuoteTime\n  deliveryQuoteTime\n  deliveryProviderInfo {\n    provider\n    needsDeliveryCommunicationConsent\n    __typename\n  }\n  cartUpsellInfo {\n    upsellItems\n    __typename\n  }\n  __typename\n}\n",
				variables: {
					cartGuid
				}
			}
		];
		const result:AxiosResponse<GetCartResponse> = await axios.post(endpoint, body, headers);
		return Promise.resolve(result.data[0].data.cartV2.cart);
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}

};

type ValidateCartResponse = {
	[index: number]: {
		data: {
			validateCartPreCheckout: {
				cart: Cart["cart"]
			}
		}
	}
};

const validateCart = async (cartGuid: string): Promise<Cart["cart"]> => {
	try {
		const endpoint = 'https://ws-api.toasttab.com/consumer-app-bff/v1/graphql';
		const body = [
			{
				operationName: "VALIDATE_CART",
				query: "mutation VALIDATE_CART($input: ValidateCartPreCheckoutInput!) {\n  validateCartPreCheckout(input: $input) {\n    ... on CartResponse {\n      ...cartResponse\n      __typename\n    }\n    ... on CartModificationError {\n      code\n      message\n      __typename\n    }\n    ... on CartOutOfStockError {\n      cart {\n        ...cart\n        __typename\n      }\n      items {\n        name\n        guid\n        __typename\n      }\n      message\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment cartResponse on CartResponse {\n  cart {\n    ...cart\n    __typename\n  }\n  warnings {\n    code\n    message\n    __typename\n  }\n  info {\n    code\n    message\n    __typename\n  }\n  __typename\n}\n\nfragment cart on Cart {\n  guid\n  order {\n    deliveryInfo {\n      address1\n      address2\n      city\n      state\n      zipCode\n      latitude\n      longitude\n      notes\n      __typename\n    }\n    numberOfSelections\n    selections {\n      guid\n      groupingKey\n      itemGuid\n      itemGroupGuid\n      name\n      preDiscountPrice\n      price\n      quantity\n      usesFractionalQuantity\n      fractionalQuantity {\n        unitOfMeasure\n        quantity\n        __typename\n      }\n      modifiers {\n        guid\n        name\n        price\n        groupingKey\n        modifiers {\n          guid\n          name\n          price\n          groupingKey\n          modifiers {\n            guid\n            name\n            price\n            groupingKey\n            modifiers {\n              guid\n              name\n              price\n              groupingKey\n              modifiers {\n                guid\n                name\n                price\n                groupingKey\n                modifiers {\n                  guid\n                  name\n                  price\n                  groupingKey\n                  modifiers {\n                    guid\n                    name\n                    price\n                    groupingKey\n                    modifiers {\n                      guid\n                      name\n                      price\n                      groupingKey\n                      modifiers {\n                        guid\n                        name\n                        price\n                        groupingKey\n                        modifiers {\n                          guid\n                          name\n                          price\n                          groupingKey\n                          __typename\n                        }\n                        __typename\n                      }\n                      __typename\n                    }\n                    __typename\n                  }\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    discounts {\n      restaurantDiscount {\n        guid\n        name\n        amount\n        promoCode\n        __typename\n      }\n      loyaltyDiscount {\n        guid\n        amount\n        __typename\n      }\n      globalReward {\n        amount\n        name\n        rewardType\n        total\n        __typename\n      }\n      __typename\n    }\n    discountsTotal\n    deliveryChargeTotal\n    serviceChargeTotal\n    subtotal\n    tax\n    total\n    __typename\n  }\n  quoteTime\n  paymentOptions {\n    atCheckout {\n      paymentType\n      __typename\n    }\n    uponReceipt {\n      paymentType\n      __typename\n    }\n    __typename\n  }\n  preComputedTips {\n    percent\n    value\n    __typename\n  }\n  approvalRules {\n    ruleType\n    requiredAdjustment\n    thresholdAmount\n    __typename\n  }\n  diningOptionBehavior\n  fulfillmentType\n  fulfillmentDateTime\n  takeoutQuoteTime\n  deliveryQuoteTime\n  deliveryProviderInfo {\n    provider\n    needsDeliveryCommunicationConsent\n    __typename\n  }\n  cartUpsellInfo {\n    upsellItems\n    __typename\n  }\n  __typename\n}\n",
				variables: {
					input: {
						cartGuid
					}
				}
			}
		];
		const result:AxiosResponse<ValidateCartResponse> = await axios.post(endpoint, body, headers);
		return Promise.resolve(result.data[0].data.validateCartPreCheckout.cart);
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
};

type CustomerInfo = {
	email: string,
	firstName: string,
	lastName: string,
	phone: string
};

type CCardInfo = {
	cardFirst6: string,
	cardLast4: string,
	encryptedCardDataString: string,
	encryptionKeyId: string,
	expMonth: string,
	expYear: string,
	saveCard: boolean,
	zipCode: string
};

type Restaurant = {
	guid: string, //"79eabbd6-b99d-4070-ad88-269906815528",
	name: string, //"Liberty Burger - Lakewood",
	whiteLabelName: string,
	timeZoneId: string,
	location: {
		address1: string,
		address2: string | null,
		city: string,
		state: string,
		phone: string,
		__typename: string
	},
	creditCardConfig: {
		amexAccepted: boolean,
		tipEnabled: boolean,
		__typename: string,
	},
	loyaltyConfig: {
		loyaltyRedemptionEnabled: boolean,
		loyaltySignupEnabled: boolean,
		loyaltySignupBonus: null,
		__typename: string,
	},
	socialMediaLinks: {
		twitterLink: null,
		facebookLink: string,
		__typename: string
	},
	__typename: string
};

type PlaceCCOrderResponse = {
	[index: number]: {
		data: {
			placeCcOrder: {
				completedOrder: {
					guid: string,
					restaurant: Restaurant,
					customerV2: {
						firstName: string,
						lastName: string,
						email: string,
						phone: string,
						__typename: string,
					},
					selections: CartSelection[],
					discounts: {
						restaurantDiscount: null,
						loyaltyDiscount: null,
						globalReward: null,
						__typename: string | "Discounts"
					},
					discountsTotal: number, // 0 -- wonder if this can be modified..
					checkNumber: number, // 74
					checkGuid: string, // checkGuid may be important in the last pickup order info step.. 
					guestCommunication: string,
					deliveryChargeTotal: number,
					serviceChargeTotal: number,
					tfgRoundUpTotal: number,
					subtotal: number,
					tax: number,
					tip: number,
					total: number,
					estimatedFulfillmentDate: number,
					paymentType: string | "CREDIT",
					orderPaymentGuid: string,
					hasLoyaltyAttached: boolean,
					curbsidePickup: {
						selected: boolean,
						__typename: string | "CurbsidePickup"
					},
					curbsidePickupV2: null,
					giftCard: null,
					deliveryInfo: null,
					__typename: string | "CompletedOrder"
				},
				warnings: WarningMessage[],
				__typename: string | "PlaceOrderResponse"
			}
		}
	}
};

// looks like I need pass in a valid cartGuid, so will need to go thru all steps in the API
const placeCCOrder = async (
		cartGuid: string,
		tipAmount: number,
		customer: CustomerInfo = {
			email: `${process.env.email}`,
			firstName: `${process.env.firstName}`,
			lastName: `${process.env.lastName}`,
			phone: `${process.env.phone}`
		},
		cardInfo: CCardInfo = {
			cardFirst6: `${process.env.cardFirst6}`,
			cardLast4: `${process.env.cardLast4}`,
			encryptedCardDataString: `${process.env.encryptoedCardDataString}`,
			encryptionKeyId: `${process.env.encryptionKeyId}`,
			expMonth: `${process.env.expMonth}`,
			expYear: `${process.env.expYear}`,
			saveCard: Boolean(process.env.saveCard),
			zipCode: `${process.env.zipCode}`
		}
	): Promise<PlaceCCOrderResponse> => {
	try {
		const endpoint = 'https://ws-api.toasttab.com/consumer-app-bff/v1/graphql';
		const body = [
			{
				operationName: "PLACE_CC_ORDER",
				query: "mutation PLACE_CC_ORDER($input: PlaceCcOrderInput!) {\n  placeCcOrder(input: $input) {\n    ... on PlaceOrderResponse {\n      completedOrder {\n        ...completedOrder\n        __typename\n      }\n      warnings {\n        code\n        message\n        __typename\n      }\n      __typename\n    }\n    ... on PlaceOrderCartUpdatedError {\n      cartUpdatedCode: code\n      message\n      cart {\n        ...cart\n        __typename\n      }\n      __typename\n    }\n    ... on PlaceOrderError {\n      code\n      message\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment completedOrder on CompletedOrder {\n  guid\n  restaurant {\n    guid\n    name\n    whiteLabelName\n    timeZoneId\n    location {\n      address1\n      address2\n      city\n      state\n      phone\n      __typename\n    }\n    creditCardConfig {\n      amexAccepted\n      tipEnabled\n      __typename\n    }\n    loyaltyConfig {\n      loyaltyRedemptionEnabled\n      loyaltySignupEnabled\n      loyaltySignupBonus\n      __typename\n    }\n    socialMediaLinks {\n      twitterLink\n      facebookLink\n      __typename\n    }\n    __typename\n  }\n  customerV2 {\n    firstName\n    lastName\n    email\n    phone\n    __typename\n  }\n  selections {\n    modifiers {\n      name\n      modifiers {\n        name\n        __typename\n      }\n      __typename\n    }\n    name\n    price\n    preDiscountPrice\n    usesFractionalQuantity\n    fractionalQuantity {\n      unitOfMeasure\n      quantity\n      __typename\n    }\n    __typename\n  }\n  discounts {\n    restaurantDiscount {\n      guid\n      name\n      amount\n      promoCode\n      __typename\n    }\n    loyaltyDiscount {\n      guid\n      amount\n      __typename\n    }\n    globalReward {\n      name\n      amount\n      __typename\n    }\n    __typename\n  }\n  discountsTotal\n  checkNumber\n  checkGuid\n  guestCommunication\n  deliveryChargeTotal\n  serviceChargeTotal\n  tfgRoundUpTotal\n  subtotal\n  tax\n  tip\n  total\n  estimatedFulfillmentDate\n  paymentType\n  orderPaymentGuid\n  hasLoyaltyAttached\n  curbsidePickup {\n    selected\n    __typename\n  }\n  curbsidePickupV2 {\n    transportDescription\n    transportColor\n    __typename\n  }\n  giftCard {\n    appliedBalance\n    __typename\n  }\n  deliveryInfo {\n    address1\n    address2\n    city\n    state\n    zipCode\n    notes\n    __typename\n  }\n  __typename\n}\n\nfragment cart on Cart {\n  guid\n  order {\n    deliveryInfo {\n      address1\n      address2\n      city\n      state\n      zipCode\n      latitude\n      longitude\n      notes\n      __typename\n    }\n    numberOfSelections\n    selections {\n      guid\n      groupingKey\n      itemGuid\n      itemGroupGuid\n      name\n      preDiscountPrice\n      price\n      quantity\n      usesFractionalQuantity\n      fractionalQuantity {\n        unitOfMeasure\n        quantity\n        __typename\n      }\n      modifiers {\n        guid\n        name\n        price\n        groupingKey\n        modifiers {\n          guid\n          name\n          price\n          groupingKey\n          modifiers {\n            guid\n            name\n            price\n            groupingKey\n            modifiers {\n              guid\n              name\n              price\n              groupingKey\n              modifiers {\n                guid\n                name\n                price\n                groupingKey\n                modifiers {\n                  guid\n                  name\n                  price\n                  groupingKey\n                  modifiers {\n                    guid\n                    name\n                    price\n                    groupingKey\n                    modifiers {\n                      guid\n                      name\n                      price\n                      groupingKey\n                      modifiers {\n                        guid\n                        name\n                        price\n                        groupingKey\n                        modifiers {\n                          guid\n                          name\n                          price\n                          groupingKey\n                          __typename\n                        }\n                        __typename\n                      }\n                      __typename\n                    }\n                    __typename\n                  }\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    discounts {\n      restaurantDiscount {\n        guid\n        name\n        amount\n        promoCode\n        __typename\n      }\n      loyaltyDiscount {\n        guid\n        amount\n        __typename\n      }\n      globalReward {\n        amount\n        name\n        rewardType\n        total\n        __typename\n      }\n      __typename\n    }\n    discountsTotal\n    deliveryChargeTotal\n    serviceChargeTotal\n    subtotal\n    tax\n    total\n    __typename\n  }\n  quoteTime\n  paymentOptions {\n    atCheckout {\n      paymentType\n      __typename\n    }\n    uponReceipt {\n      paymentType\n      __typename\n    }\n    __typename\n  }\n  preComputedTips {\n    percent\n    value\n    __typename\n  }\n  approvalRules {\n    ruleType\n    requiredAdjustment\n    thresholdAmount\n    __typename\n  }\n  diningOptionBehavior\n  fulfillmentType\n  fulfillmentDateTime\n  takeoutQuoteTime\n  deliveryQuoteTime\n  deliveryProviderInfo {\n    provider\n    needsDeliveryCommunicationConsent\n    __typename\n  }\n  cartUpsellInfo {\n    upsellItems\n    __typename\n  }\n  __typename\n}\n",
				variables: {
					input: {
						cartGuid, //"cd27c9da-ddb3-41f0-8b7d-b3c6f9c570dc",
						customer,
						newCardInput: cardInfo,
						tfgInput: {
							estimatedRoundUpValue: 0,
							roundUpEnabled: false
						},
						tipAmount
					}
				}
			}
		];
		const result:AxiosResponse<PlaceCCOrderResponse> = await axios.post(endpoint, body, headers);
		return Promise.resolve(result.data);
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
};

export type CompletedOrderResponse = {
	[index: number]: {
		data: {
			completedOrder: {
				guid: string, //a valid, completed order I've made is: "cc320a08-dfaf-43ab-8b53-ece2d36f03ae",
				restaurant: Restaurant,
				customerV2: null,
				selections: [
					{
						modifiers: any[],
						name: string, //'Baby Bella',
						price: number,
						preDiscountPrice: number,
						usesFractionalQuantity: boolean,
						fractionalQuantity: any[],
						__typename: string | 'CompletedOrderSelection'
					}
				],
				discounts: {
					restaurantDiscount: null,
					loyaltyDiscount: null,
					globalReward: null,
					__typename: string | "Discounts"
				},
				discountsTotal: number,
				checkNumber: number,
				checkGuid: string, // "64f3b9cd-f2b4-4471-912c-96452bebd076",
				guestCommunication: string,
				deliveryChargeTotal: number,
				serviceChargeTotal: number,
				tfgRoundUpTotal: number,
				subtotal: number,
				tax: number,
				tip: number,
				total: number,
				estimatedFulfillmentDate: number, //1649526869413,
				paymentType: string | "CREDIT",
				orderPaymentGuid: string, //"c97eed18-aa0c-4d76-b8b7-29eef60a31fe",
				hasLoyaltyAttached: boolean,
				curbsidePickup: {
					selected: boolean,
					__typename: string | "CurbsidePickup"
				},
				curbsidePickupV2: null,
				giftCard: null,
				deliveryInfo: null,
				__typename: string | "CompletedOrder"
			}
		}
	}
};

export const getCompletedOrderInfo = async (restaurantGuid: string, orderGuid: string /* completedOrder.guid in PlaceCCOrderResponse */) => {

	console.log(
		'orderGuid: ', orderGuid,
		// 'restaurantGuid: ', process.env.restaurantGuid
	);

	try {
		const endpoint = 'https://ws-api.toasttab.com/consumer-app-bff/v1/graphql';
		const body = [
			{
				operationName: "GET_COMPLETED_ORDER",
				query: "query GET_COMPLETED_ORDER($input: CompletedOrderInput!) {\n  completedOrder(input: $input) {\n    ...completedOrder\n    __typename\n  }\n}\n\nfragment completedOrder on CompletedOrder {\n  guid\n  restaurant {\n    guid\n    name\n    whiteLabelName\n    timeZoneId\n    location {\n      address1\n      address2\n      city\n      state\n      phone\n      __typename\n    }\n    creditCardConfig {\n      amexAccepted\n      tipEnabled\n      __typename\n    }\n    loyaltyConfig {\n      loyaltyRedemptionEnabled\n      loyaltySignupEnabled\n      loyaltySignupBonus\n      __typename\n    }\n    socialMediaLinks {\n      twitterLink\n      facebookLink\n      __typename\n    }\n    __typename\n  }\n  customerV2 {\n    firstName\n    lastName\n    email\n    phone\n    __typename\n  }\n  selections {\n    modifiers {\n      name\n      modifiers {\n        name\n        __typename\n      }\n      __typename\n    }\n    name\n    price\n    preDiscountPrice\n    usesFractionalQuantity\n    fractionalQuantity {\n      unitOfMeasure\n      quantity\n      __typename\n    }\n    __typename\n  }\n  discounts {\n    restaurantDiscount {\n      guid\n      name\n      amount\n      promoCode\n      __typename\n    }\n    loyaltyDiscount {\n      guid\n      amount\n      __typename\n    }\n    globalReward {\n      name\n      amount\n      __typename\n    }\n    __typename\n  }\n  discountsTotal\n  checkNumber\n  checkGuid\n  guestCommunication\n  deliveryChargeTotal\n  serviceChargeTotal\n  tfgRoundUpTotal\n  subtotal\n  tax\n  tip\n  total\n  estimatedFulfillmentDate\n  paymentType\n  orderPaymentGuid\n  hasLoyaltyAttached\n  curbsidePickup {\n    selected\n    __typename\n  }\n  curbsidePickupV2 {\n    transportDescription\n    transportColor\n    __typename\n  }\n  giftCard {\n    appliedBalance\n    __typename\n  }\n  deliveryInfo {\n    address1\n    address2\n    city\n    state\n    zipCode\n    notes\n    __typename\n  }\n  __typename\n}\n",
				variables: {
					input: {
						orderGuid, //"orderGuid": "cc320a08-dfaf-43ab-8b53-ece2d36f03ae",
						restaurantGuid, //: `${process.env.restaurantGuid}`, //"79eabbd6-b99d-4070-ad88-269906815528",
						tfgServiceChargeGuid: null
					}
				}
			}
		];
		const orderDetails: AxiosResponse<CompletedOrderResponse> = await axios.post(endpoint, body, headers);
		return Promise.resolve(orderDetails.data);
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}

};


// main
(async () => {
	// const burgs: Array<Burger> = await getBurgers();
	// console.log(burgs);
	// const burgerGuids: Array<Guid> = await getBurgerGuids();
	// console.log(burgerGuids);

	// burgs.forEach((burg: Burger) => {
	// 	term.drawImage(burg.imageUrl, { shrink: { width: imgPx, height: imgPx } }, () => {
	// 		console.log(`name: ${burg.name}\ndesc: ${burg.description}\nprice: $${currency(burg.price)}\n\n`);
	// 	});
	// });

	// need to wire up a menu selection to where you can choose or input the burger or burgers that you want to order

	// example selection for: "Baby Bella" burger
	const selection = {
		itemGuid: "59afaf0c-efe9-423d-9fdd-2d06cf27688a",
		itemGroupGuid: "ccefc41e-76f5-42a1-ab7d-58190ece0d83",
		quantity: 1,
		modifierGroups: [
			{
				guid: "98dae877-c670-4dfa-9f38-9daabcd45292",
				modifiers: [
					{
						itemGuid: "fdade2a1-f4b4-43ee-b8e4-df29e526beba",
						itemGroupGuid: "ccefc41e-76f5-42a1-ab7d-58190ece0d83",
						quantity: 1,
						modifierGroups: []
					}
				]
			},
			// {
			// 	"guid": "ae57b425-e0fd-407b-835a-9b84386e6fcc",
			// 	"modifiers": []
			// }
		],
		specialInstructions: "",
		itemMasterId: "5740004748085950"
	};
	
	// const addItem:Cart = await addItemToCart(restaurantGuid, selection);
	// console.log(
	// 	addItem.cart.guid
	// );

	// const getCart:Cart["cart"] = await getCartForCheckout(addItem.cart.guid);
	// console.log(
	// 	'cart returned after getCartForCheckout call [getCart]: ', getCart
	// );

	// const validate:Cart["cart"] = await validateCart(getCart.guid);
	// console.log(
	// 	validate
	// );
	
	//const order: PlaceCCOrderResponse = await placeCCOrder(validate.guid, 2); // should pull in default .env values for card info
	
	// get the completed order deets..
	// const orderGuidString = "cc320a08-dfaf-43ab-8b53-ece2d36f03ae";
	// const getCompletedOrder: CompletedOrderResponse = await getCompletedOrderInfo(orderGuidString);
	// console.log(
	// 	`getting completed order details for order: ${orderGuidString}`,
	// 	getCompletedOrder[0].data.completedOrder
	// );

	// I should now be able to use this data to feed to the DoorDash api and schedule a delivery

})();


// module.exports = {
// 	getCompletedOrderInfo
// };
