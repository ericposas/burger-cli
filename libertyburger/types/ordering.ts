export type Modifier = {
	itemGuid: string,
	itemGroupGuid: string,
	quantity: number,
	modifierGroups: {
		[index: number]: {
			guid: string,
			modifiers: []
		}
	}
};

export type CartSelection = {
	itemGuid: string,
	itemGroupGuid: string,
	quantity: number,
	modifierGroups: {
		[index: number]: {
			guid: string,
			modifiers: Modifier[] | undefined
		}
	},
	specialInstructions: string,
	itemMasterId: string
};

export type WarningMessage = {
	code: string,
	message: string,
	__typename: string
};

export type AddItemResponse = {
	[index: number]: {
		data: {
			addItemToCartV2: {
				cart: {
					guid: string,
					order: {
						deliveryInfo: null,
						numberOfSelections: number,
						selections: {
							[index: number]: {
								guid: string,
								groupingKey: string,
								itemGuid: string,
								itemGroupGuid: string,
								name: string,
								preDiscountPrice: number,
								price: number,
								quantity: number,
								usesFractionalQuantity: boolean,
								fractionalQuantity: {
									unitOfMeasure: string,
									quantity: number,
									__typename: string
								},
								modifiers: {
									[index: number]: {
										guid: null,
										name: string,
										price: number,
										groupingKey: string,
										modifiers: any[],
										__typename: string
									}
								},
								__typename: string
							}
						},
						discounts: {
							restaurantDiscount: null,
							loyaltyDiscount: null,
							globalReward: null,
							__typename: string
						},
						discountsTotal: number,
						deliveryChargeTotal: number,
						serviceChargeTotal: number,
						subtotal: number,
						tax: number,
						total: number,
						__typename: string
					},
					quoteTime: null,
					paymentOptions: {
						atCheckout: {
							[index: number]: {
								paymentType: string,
								__typename: string
							}
						},
						uponReceipt: any[],
						__typename: string
					},
					preComputedTips: {
						[index: number]: {
							percent: number,
							value: number,
							__typename: string
						}
					},
					approvalRules: any[],
					diningOptionBehavior: string,
					fulfillmentType: string,
					fulfillmentDateTime: string,
					takeoutQuoteTime: number,
					deliveryQuoteTime: number,
					deliveryProviderInfo: null,
					cartUpsellInfo: {
						upsellItems: {
							[index: number]: string
						},
						__typename: string
					},
					__typename: string
				},
				warnings: WarningMessage[],
				info: any[],
				__typename: string
			}
		}
	}
};

export type AddItemResponseFlattened = AddItemResponse[0]['data']['addItemToCartV2'];

export type DeleteItemFromCartResponse = {
	[index: number]: {
		data: {
			deleteItemFromCartV2: {
				cart: {
					guid: string,
					order: {
						deliveryInfo: null,
						numberOfSelections: number,
						selections: any[],
						discounts: {
							restaurantDiscount: null,
							loyaltyDiscount: null,
							loyaltyDiscounts: any[],
							globalReward: null,
							__typename: string
						},
						discountsTotal: number,
						deliveryChargeTotal: number,
						serviceChargeTotal: number,
						subtotal: null,
						tax: number,
						total: number,
						__typename: string
					},
					quoteTime: null,
					paymentOptions: {
						atCheckout: [
							{
								paymentType: string,
								__typename: string
							}
						],
						uponReceipt: any[],
						__typename: string
					},
					preComputedTips: {
						[index: number]: {
							percent: number,
							value: number,
							__typename: string
						}
					},
					approvalRules: any[],
					diningOptionBehavior: string,
					fulfillmentType: string,
					fulfillmentDateTime: string,
					takeoutQuoteTime: number,
					deliveryQuoteTime: number,
					deliveryProviderInfo: null,
					cartUpsellInfo: {
						upsellItems: [],
						__typename: string
					},
					__typename: string
				},
				warnings: WarningMessage[],
				info: any[],
				__typename: string
			}
		}
	}
};

export type DeleteItemFromCartResponseFlattened = DeleteItemFromCartResponse[0]['data']['deleteItemFromCartV2'];

export type GetCartResponse = {
	[index: number]: {
		data: {
			cartV2: {
				cart: {
					guid: string,
					order: {
						deliveryInfo: null,
						numberOfSelections: number,
						selections: {
							[index: number]: {
								guid: string,
								groupingKey: string,
								itemGuid: string,
								itemGroupGuid: string,
								name: string,
								preDiscountPrice: number,
								price: number,
								quantity: number,
								usesFractionalQuantity: boolean,
								fractionalQuantity: {
									unitOfMeasure: string,
									quantity: number,
									__typename: string
								},
								modifiers: {
									[index: number]: {
										guid: null,
										name: string,
										price: number,
										groupingKey: string,
										modifiers: Modifier[],
										__typename: string
									}
								},
								__typename: string
							},
						},
						discounts: {
							restaurantDiscount: null,
							loyaltyDiscount: null,
							globalReward: null,
							__typename: string
						},
						discountsTotal: number,
						deliveryChargeTotal: number,
						serviceChargeTotal: number,
						subtotal: number,
						tax: number,
						total: number,
						__typename: string
					},
					quoteTime: null,
					paymentOptions: {
						atCheckout: {
							[index: number]: {
								paymentType: string,
								__typename: string
							}
						},
						uponReceipt: [],
						__typename: string
					},
					preComputedTips: {
						[index: number]: {
							percent: number,
							value: number,
							__typename: string
						},
					},
					approvalRules: [],
					diningOptionBehavior: string,
					fulfillmentType: string,
					fulfillmentDateTime: string,
					takeoutQuoteTime: number,
					deliveryQuoteTime: number,
					deliveryProviderInfo: null,
					cartUpsellInfo: {
						upsellItems: {
							[index: number]: string
						},
						__typename: string
					},
					__typename: string
				},
				warnings: [],
				info: [],
				__typename: string
			}
		}
	}
};

export type GetCartResponseFlattened = GetCartResponse[0]['data']['cartV2'];

export type ValidateCartResponse = {
	[index: number]: {
		data: {
			validateCartPreCheckout: {
				cart: {
					guid: string,
					order: {
						deliveryInfo: null,
						numberOfSelections: number,
						selections: {
							[index: number]: {
								guid: string,
								groupingKey: string,
								itemGuid: string,
								itemGroupGuid: string,
								name: string,
								preDiscountPrice: number,
								price: number,
								quantity: number,
								usesFractionalQuantity: boolean,
								fractionalQuantity: {
									unitOfMeasure: string,
									quantity: number,
									__typename: string
								},
								modifiers: {
									[index: number]: {
										guid: null,
										name: string,
										price: number,
										groupingKey: string,
										modifiers: [],
										__typename: string
									}
								},
								__typename: string
							}
						},
						discounts: {
							restaurantDiscount: null,
							loyaltyDiscount: null,
							globalReward: null,
							__typename: string
						},
						discountsTotal: number,
						deliveryChargeTotal: number,
						serviceChargeTotal: number,
						subtotal: number,
						tax: number,
						total: number,
						__typename: string
					},
					quoteTime: null,
					paymentOptions: {
						atCheckout: {
							[index: number]: {
								paymentType: string,
								__typename: string
							}
						},
						uponReceipt: [],
						__typename: string
					  },
					preComputedTips: {
						[index: number]: {
							percent: number,
							value: number,
							__typename: string
						}
					},
					approvalRules: [],
					diningOptionBehavior: string,
					fulfillmentType: string,
					fulfillmentDateTime: string,
					takeoutQuoteTime: 15,
					deliveryQuoteTime: 45,
					deliveryProviderInfo: null,
					cartUpsellInfo: {
						upsellItems: {
							[index: number]: string
						},
						__typename: string
					},
					__typename: string
				},
				warnings: [],
				info: [],
				__typename: string
			}
		}
	}
};

export type ValidateCartResponseFlattened = ValidateCartResponse[0]['data']['validateCartPreCheckout'];

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
						__typename: string
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
					paymentType: string,
					orderPaymentGuid: string,
					hasLoyaltyAttached: boolean,
					curbsidePickup: {
						selected: boolean,
						__typename: string
					},
					curbsidePickupV2: null,
					giftCard: null,
					deliveryInfo: null,
					__typename: string
				},
				warnings: WarningMessage[],
				__typename: string
			}
		}
	}
};

export type PlaceCCOrderResponseFlattened = PlaceCCOrderResponse[0]['data']['placeCcOrder'];

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
						__typename: string
					}
				],
				discounts: {
					restaurantDiscount: null,
					loyaltyDiscount: null,
					globalReward: null,
					__typename: string
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
				paymentType: string,
				orderPaymentGuid: string,
				hasLoyaltyAttached: boolean,
				curbsidePickup: {
					selected: boolean,
					__typename: string
				},
				curbsidePickupV2: null,
				giftCard: null,
				deliveryInfo: null,
				__typename: string
			}
		}
	}
};

export type CompletedOrderResponseFlattened = CompletedOrderResponse[0]['data']['completedOrder'];
