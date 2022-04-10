import { AxiosResponse } from "axios";
import {
	CustomerInfo, CCardInfo,
	Burger, Cart, CartSelection,
	AddItemResponse, GetCartResponse, ValidateCartResponse, PlaceCCOrderResponse, CompletedOrderResponse
} from '../libertyburger/types';
const axios = require('axios');
const moment = require('moment');

require('dotenv').config();

// const term = require('terminal-kit').terminal;
// const currency = require('currency.js');
// const imgPx = 25;

const headers = { 'content-type': 'application/json' };
const endpoint = 'https://ws-api.toasttab.com/consumer-app-bff/v1/graphql';

type LibertyBurgerAPI = () => ({
    getRestaurantDataAndAvailableTimes: (restaurantGuid: string) => Promise<any>,
    getMenu: (restaurantGuid: string) => Promise<any>,
    getAvailability: (restaurantGuid: string) => Promise<string>, 
    getBurgers: (restaurantGuid: string) => Promise<Array<Burger>>,
    // getBurgerGuids: (restaurantGuid: string) => Promise<Array<Guid>>,
    addItemToCart: (restaurantGuid: string, selection: CartSelection) => Promise<Cart>,
    getCartForCheckout: (cartGuid: string) => Promise<Cart["cart"]>,
    validateCart: (cartGuid: string) => Promise<Cart["cart"]>,
    placeCCOrder: (
        cartGuid: string,
        tipAmount: number,
        customer: CustomerInfo,
        cardInfo: CCardInfo
    ) => Promise<PlaceCCOrderResponse>,
    getCompletedOrderInfo: (completedOrderGuid: string, restaurantGuid: string) => Promise<CompletedOrderResponse>
});

const api = <LibertyBurgerAPI>(() => ({

    getRestaurantDataAndAvailableTimes: async (restaurantGuid: string): Promise<any> => {
        try {
            const body = [
                {
                    operationName: "RESTAURANT_INFO",
                    variables: { restaurantGuid },
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
            ];
            const result = await axios.post(endpoint, body, headers);
    
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
    },
    
    getMenu: async (restaurantGuid: string): Promise<any> => {
        try {
            const body = [
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
            ];
            const result: AxiosResponse<any> = await axios.post(endpoint, body, headers);
    
            console.log(
                //`\nresult.data[0].data.popularItems.items: \n`, result.data[0].data.popularItems.items,
                //`\n\nresult.data[1].data.menusV3.menus: \n`, result.data[1].data.menusV3.menus,
                //'\n\n..menuV3.menus[0].groups: \n', result.data[1].data.menusV3.menus[0].groups,
                //`\n\nBurgers: \n`, result.data[1].data.menusV3.menus[0].groups[0].items
            );
    
            return Promise.resolve(result.data);
    
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },
    
    getAvailability: async (restaurantGuid: string): Promise<string> => {
        try {
            const result = await api().getRestaurantDataAndAvailableTimes(restaurantGuid);
            const availAt = result.data[1].data.diningOptions[0].asapSchedule;
            const formatted = moment(availAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
            return Promise.resolve(formatted);
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },
    
    getBurgers: async (restaurantGuid: string): Promise<Array<Burger>> => {
        try {
            const menu = await api().getMenu(restaurantGuid);
            const burgers = menu[1].data.menusV3.menus[0].groups[0].items;
            return Promise.resolve(burgers);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    
    // getBurgerGuids: async (restaurantGuid: string): Promise<Array<Guid>> => {
    //     try {
    //         const burgs = await api().getBurgers(restaurantGuid);
    //         const guids = burgs.reduce((acc: any, curr: any) => {
    //             acc[curr.name] = {};
    //             acc[curr.name]['guid'] = curr.guid;
    //             acc[curr.name]['itemGroupGuid'] = curr.itemGroupGuid;
    //             acc[curr.name]['masterId'] = curr.masterId;
    //             return acc;
    //         }, {} as Record<string, string>);
    //         return Promise.resolve(guids);
    //     } catch (err) {
    //         return Promise.reject(err);
    //     }
    // },
    
    addItemToCart: async (restaurantGuid: string, selection: CartSelection): Promise<Cart> => {
        try {
            const body = [
                {
                    operationName: "ADD_ITEM_TO_CART",
                    variables: {
                        input: {
                            createCartInput: {
                                restaurantGuid,
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
    },
    
    getCartForCheckout: async (cartGuid: string): Promise<Cart["cart"]> => {
        try {
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
    
    },
    
    validateCart: async (cartGuid: string): Promise<Cart["cart"]> => {
        try {
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
    },
    
    placeCCOrder: async (
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
            const body = [
                {
                    operationName: "PLACE_CC_ORDER",
                    query: "mutation PLACE_CC_ORDER($input: PlaceCcOrderInput!) {\n  placeCcOrder(input: $input) {\n    ... on PlaceOrderResponse {\n      completedOrder {\n        ...completedOrder\n        __typename\n      }\n      warnings {\n        code\n        message\n        __typename\n      }\n      __typename\n    }\n    ... on PlaceOrderCartUpdatedError {\n      cartUpdatedCode: code\n      message\n      cart {\n        ...cart\n        __typename\n      }\n      __typename\n    }\n    ... on PlaceOrderError {\n      code\n      message\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment completedOrder on CompletedOrder {\n  guid\n  restaurant {\n    guid\n    name\n    whiteLabelName\n    timeZoneId\n    location {\n      address1\n      address2\n      city\n      state\n      phone\n      __typename\n    }\n    creditCardConfig {\n      amexAccepted\n      tipEnabled\n      __typename\n    }\n    loyaltyConfig {\n      loyaltyRedemptionEnabled\n      loyaltySignupEnabled\n      loyaltySignupBonus\n      __typename\n    }\n    socialMediaLinks {\n      twitterLink\n      facebookLink\n      __typename\n    }\n    __typename\n  }\n  customerV2 {\n    firstName\n    lastName\n    email\n    phone\n    __typename\n  }\n  selections {\n    modifiers {\n      name\n      modifiers {\n        name\n        __typename\n      }\n      __typename\n    }\n    name\n    price\n    preDiscountPrice\n    usesFractionalQuantity\n    fractionalQuantity {\n      unitOfMeasure\n      quantity\n      __typename\n    }\n    __typename\n  }\n  discounts {\n    restaurantDiscount {\n      guid\n      name\n      amount\n      promoCode\n      __typename\n    }\n    loyaltyDiscount {\n      guid\n      amount\n      __typename\n    }\n    globalReward {\n      name\n      amount\n      __typename\n    }\n    __typename\n  }\n  discountsTotal\n  checkNumber\n  checkGuid\n  guestCommunication\n  deliveryChargeTotal\n  serviceChargeTotal\n  tfgRoundUpTotal\n  subtotal\n  tax\n  tip\n  total\n  estimatedFulfillmentDate\n  paymentType\n  orderPaymentGuid\n  hasLoyaltyAttached\n  curbsidePickup {\n    selected\n    __typename\n  }\n  curbsidePickupV2 {\n    transportDescription\n    transportColor\n    __typename\n  }\n  giftCard {\n    appliedBalance\n    __typename\n  }\n  deliveryInfo {\n    address1\n    address2\n    city\n    state\n    zipCode\n    notes\n    __typename\n  }\n  __typename\n}\n\nfragment cart on Cart {\n  guid\n  order {\n    deliveryInfo {\n      address1\n      address2\n      city\n      state\n      zipCode\n      latitude\n      longitude\n      notes\n      __typename\n    }\n    numberOfSelections\n    selections {\n      guid\n      groupingKey\n      itemGuid\n      itemGroupGuid\n      name\n      preDiscountPrice\n      price\n      quantity\n      usesFractionalQuantity\n      fractionalQuantity {\n        unitOfMeasure\n        quantity\n        __typename\n      }\n      modifiers {\n        guid\n        name\n        price\n        groupingKey\n        modifiers {\n          guid\n          name\n          price\n          groupingKey\n          modifiers {\n            guid\n            name\n            price\n            groupingKey\n            modifiers {\n              guid\n              name\n              price\n              groupingKey\n              modifiers {\n                guid\n                name\n                price\n                groupingKey\n                modifiers {\n                  guid\n                  name\n                  price\n                  groupingKey\n                  modifiers {\n                    guid\n                    name\n                    price\n                    groupingKey\n                    modifiers {\n                      guid\n                      name\n                      price\n                      groupingKey\n                      modifiers {\n                        guid\n                        name\n                        price\n                        groupingKey\n                        modifiers {\n                          guid\n                          name\n                          price\n                          groupingKey\n                          __typename\n                        }\n                        __typename\n                      }\n                      __typename\n                    }\n                    __typename\n                  }\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    discounts {\n      restaurantDiscount {\n        guid\n        name\n        amount\n        promoCode\n        __typename\n      }\n      loyaltyDiscount {\n        guid\n        amount\n        __typename\n      }\n      globalReward {\n        amount\n        name\n        rewardType\n        total\n        __typename\n      }\n      __typename\n    }\n    discountsTotal\n    deliveryChargeTotal\n    serviceChargeTotal\n    subtotal\n    tax\n    total\n    __typename\n  }\n  quoteTime\n  paymentOptions {\n    atCheckout {\n      paymentType\n      __typename\n    }\n    uponReceipt {\n      paymentType\n      __typename\n    }\n    __typename\n  }\n  preComputedTips {\n    percent\n    value\n    __typename\n  }\n  approvalRules {\n    ruleType\n    requiredAdjustment\n    thresholdAmount\n    __typename\n  }\n  diningOptionBehavior\n  fulfillmentType\n  fulfillmentDateTime\n  takeoutQuoteTime\n  deliveryQuoteTime\n  deliveryProviderInfo {\n    provider\n    needsDeliveryCommunicationConsent\n    __typename\n  }\n  cartUpsellInfo {\n    upsellItems\n    __typename\n  }\n  __typename\n}\n",
                    variables: {
                        input: {
                            cartGuid,
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
    },
    
    getCompletedOrderInfo: async (completedOrderGuid: string, restaurantGuid: string = `${process.env.restaurantGuid}`): Promise<CompletedOrderResponse> => {
    
        console.log(
            'completedOrderGuid: ', completedOrderGuid
        );
    
        try {
            const endpoint = 'https://ws-api.toasttab.com/consumer-app-bff/v1/graphql';
            const body = [
                {
                    operationName: "GET_COMPLETED_ORDER",
                    query: "query GET_COMPLETED_ORDER($input: CompletedOrderInput!) {\n  completedOrder(input: $input) {\n    ...completedOrder\n    __typename\n  }\n}\n\nfragment completedOrder on CompletedOrder {\n  guid\n  restaurant {\n    guid\n    name\n    whiteLabelName\n    timeZoneId\n    location {\n      address1\n      address2\n      city\n      state\n      phone\n      __typename\n    }\n    creditCardConfig {\n      amexAccepted\n      tipEnabled\n      __typename\n    }\n    loyaltyConfig {\n      loyaltyRedemptionEnabled\n      loyaltySignupEnabled\n      loyaltySignupBonus\n      __typename\n    }\n    socialMediaLinks {\n      twitterLink\n      facebookLink\n      __typename\n    }\n    __typename\n  }\n  customerV2 {\n    firstName\n    lastName\n    email\n    phone\n    __typename\n  }\n  selections {\n    modifiers {\n      name\n      modifiers {\n        name\n        __typename\n      }\n      __typename\n    }\n    name\n    price\n    preDiscountPrice\n    usesFractionalQuantity\n    fractionalQuantity {\n      unitOfMeasure\n      quantity\n      __typename\n    }\n    __typename\n  }\n  discounts {\n    restaurantDiscount {\n      guid\n      name\n      amount\n      promoCode\n      __typename\n    }\n    loyaltyDiscount {\n      guid\n      amount\n      __typename\n    }\n    globalReward {\n      name\n      amount\n      __typename\n    }\n    __typename\n  }\n  discountsTotal\n  checkNumber\n  checkGuid\n  guestCommunication\n  deliveryChargeTotal\n  serviceChargeTotal\n  tfgRoundUpTotal\n  subtotal\n  tax\n  tip\n  total\n  estimatedFulfillmentDate\n  paymentType\n  orderPaymentGuid\n  hasLoyaltyAttached\n  curbsidePickup {\n    selected\n    __typename\n  }\n  curbsidePickupV2 {\n    transportDescription\n    transportColor\n    __typename\n  }\n  giftCard {\n    appliedBalance\n    __typename\n  }\n  deliveryInfo {\n    address1\n    address2\n    city\n    state\n    zipCode\n    notes\n    __typename\n  }\n  __typename\n}\n",
                    variables: {
                        input: {
                            orderGuid: completedOrderGuid,
                            restaurantGuid,
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
    
    }

}));

export default api;