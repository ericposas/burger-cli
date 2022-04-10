export type Modifier = {
	itemGuid: string,
	itemGroupGuid: string,
	quantity: number,
	modifierGroups: ModifierGroup[] | undefined
};

export type ModifierGroup = {
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

export type WarningMessage = {
	code: string,
	message: string,
	__typename: string
};

// Tricky type bc Cart has a nested "cart" prop --
// We sometimes just need the inner-part of "cart"
// so we'll access that via Cart["cart"]
export type Cart = {
	cart: {
		guid: string,
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

export type AddItemResponse = {
	[index: number]: {
		data: {
			addItemToCartV2: Cart
		}
	}
};

export type Burger = {
	description: string,
	guid: string,
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

// export type Guid = {
// 	guid: string,
// 	itemGroupGuid: string,
// 	masterId: string
// };

export type GetCartResponse = {
	[index: number]: {
		data: CartV2
	}
};

export type CartV2 = {
	cartV2: Cart
};

export type ValidateCartResponse = {
	[index: number]: {
		data: {
			validateCartPreCheckout: {
				cart: Cart["cart"]
			}
		}
	}
};

export type CustomerInfo = {
	email: string,
	firstName: string,
	lastName: string,
	phone: string
};

export type CCardInfo = {
	cardFirst6: string,
	cardLast4: string,
	encryptedCardDataString: string,
	encryptionKeyId: string,
	expMonth: string,
	expYear: string,
	saveCard: boolean,
	zipCode: string
};

export type Restaurant = {
	guid: string,
	name: string,
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

export type PlaceCCOrderResponse = {
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
					discountsTotal: number,
					checkNumber: number,
					checkGuid: string, 
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

export type CompletedOrderResponse = {
	[index: number]: {
		data: {
			completedOrder: {
				guid: string,
				restaurant: Restaurant,
				customerV2: null,
				selections: [
					{
						modifiers: any[],
						name: string,
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
				checkGuid: string,
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
			}
		}
	}
};