export type RestaurantDataResponse = [
	{
		data: {
			restaurantV2: {
				guid: string,
				whiteLabelName: string,
				description: string,
				imageUrl: string,
				bannerUrls: {
					raw: string,
					__typename: string
				},
				minimumTakeoutTime: number,
				minimumDeliveryTime: number,
				location: {
					address1: string,
					address2: null,
					city: string,
					state: string,
					zip: string,
					phone: string,
					latitude: number,
					longitude: number,
					__typename: string
				},
				logoUrls: {
					small: string,
					__typename: string
				},
				schedule: {
					asapAvailableForTakeout: boolean,
					todaysHoursForTakeout: {
						startTime: string,
						endTime: string,
						__typename: string
					},
					upcomingSchedules: [
						{
							behavior: string,
							dailySchedules: {
								[index: number]: {
									date: string,
									servicePeriods: {
										[index: number]: { startTime: string, endTime: string, __typename: string }
									},
									__typename: string
								}
							},
							__typename: string
						}
					],
					__typename: string
				},
				timeZoneId: string,
				onlineOrderingEnabled: boolean,
				socialMediaLinks: {
					facebookLink: string,
					twitterLink: null,
					instagramLink: string,
					__typename: string
				},
				giftCardLinks: any[],
				giftCardConfig: any[],
				specialRequestsConfig: any[],
				spotlightConfig: any[],
				curbsidePickupConfig: any[],
				popularItemsConfig: { enabled: boolean, __typename: string },
				upsellsConfig: { enabled: boolean, __typename: string },
				creditCardConfig: {
					amexAccepted: boolean,
					tipEnabled: boolean,
					__typename: string
				},
				__typename: string
			}
		}
	}
];

export type RestaurantDataResponseFlattened = RestaurantDataResponse[0]['data']['restaurantV2'];

export type DiningOptionsResponse = [
	{
		data: {
			diningOptions: [
				{
					guid: string,
					behavior: string,
					deliveryProvider: null,
					asapSchedule: {
						availableNow: boolean,
						availableAt: string,
						__typename: string
					},
					futureSchedule: {
						dates: {
							[index: number]: {
								date: string,
								timesAndGaps: {
									[index: number]: {
										time: string,
										__typename: string
									}
								},
								__typename: string
							}
						},
						__typename: string
					},
					__typename: string
				}
			]
		}
	}
];

export type DiningOptionsResponseFlattened = DiningOptionsResponse[0]['data']['diningOptions'];

export type PopularItems = {
	popularItems: {
		items: [
			{
				name: string,
				guid: string,
				itemGroupGuid: string,
				imageUrl: string,
				price: number,
				__typename: string
			}
		] ,
		__typename: string
	}
};

export type Item = {
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

export type Group = {
	guid: string,
	name: string,
	description: string,
	items: Item[],
	__typename: string
};

export type Menu = {
	id: string,
	name: string,
	groups: Group[],
	__typename: string
};

export type MenusV3 = {
	menus: Menu[],
	__typename: string
};

export type GetMenusResponse = [
	{
		data: {
			menusV3: MenusV3
		}
	}
];

export type GetMenusResponseFlattened = GetMenusResponse[0]['data']['menusV3'];

export type MenuOf = 'burgers' | 'sandwiches' | 'salads' | 'sides' | 'kids' | 'beverages' | 'sauces' | 'shakes' | 'off menu' | 'joy';
