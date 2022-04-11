require('dotenv').config();

import { group } from 'console';
import moment from 'moment';
import api from './libertyburger/api';
import { DiningOptionsResponse, Item, MenuOf, MenusV3, RestaurantDataResponse } from './libertyburger/types/menu';
import { AddItemResponse, AddItemResponseFlattened, CartSelection, CompletedOrderResponse, CompletedOrderResponseFlattened, GetCartResponse, GetCartResponseFlattened, ValidateCartResponse, ValidateCartResponseFlattened } from './libertyburger/types/ordering';

const term = require('terminal-kit').terminal;
const currency = require('currency.js');
const imgPx = 25;

const restGuid = `${process.env.restaurantGuid}`;

const getPinkModifier = (groupGuidCheck: string) => {
	if (groupGuidCheck === "ccefc41e-76f5-42a1-ab7d-58190ece0d83") { // <-- if item is a burger, checking here against 'Burger' group guid..
		return { // if so, return the 'Pink' (medium) modifier for cook temp
			guid: "98dae877-c670-4dfa-9f38-9daabcd45292",
			modifiers: [
				{
					itemGroupGuid: "ccefc41e-76f5-42a1-ab7d-58190ece0d83",
					itemGuid: "fdade2a1-f4b4-43ee-b8e4-df29e526beba",
					modifierGroups: [],
					quantity: 1
				}
			]
		}
	}
};

const mapToCartSelection = (items: Item[]): CartSelection[] => {
	return items.map(item => {
		return <CartSelection>{
			itemGuid: item.guid,
			itemGroupGuid: item.itemGroupGuid,
			itemMasterId: item.masterId,
			modifierGroups: getPinkModifier(item.itemGroupGuid) ? [getPinkModifier(item.itemGroupGuid)] : [],
			quantity: 1,
			specialInstructions: ""
		};
	});
};

const allItemsAsCartReadySelections = async (): Promise<CartSelection[]> => {
	try {
		let items: Item[] = [];
		const allMenus: MenusV3 = await api().getMenus(restGuid);
		allMenus.menus.forEach((menu, idx) => {
			menu.groups.forEach(group => {
				items = items.concat(
					group.items
				)
			})
		});
		return Promise.resolve(mapToCartSelection(items));
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
};

// main
(async () => {

	// Burger options
	// [0] Liberty
	// [1] Napa
	// [2] Chillerno
	// [3] Baby Bella
	// [4] South of the Burger
	// [5] Wild West
	// [6] The Nooner
	// [7] Ahi
	// [8] The Libertine
	// [9] Woodstock
	// [10] Jackie O
	// [11] Candied Cowboy

	// Sandwich options
	// [0] Grilled Cheese
	// [1] The Traitor

	// Salad options 
	// [0] Crunchy
	// [1] Kale Mary
	// [2] Sturdy
	// [3] Simple Salad

	// Sides
	// [0] Skinny Fry
	// [1] Sweet Potato Fry
	// [2] Big O Rings
	// [3] Single O Ring
	// [4] The Torch (Jalapeno Poppers)
	// [5] Sidewinders (loaded fries)
	// [6] Plain Sidewinders
	// [7] Simple Salad

	// Kids Menu
	// [0] Kid Burger
	// [1] Kid Chicken Sandwich
	// [2] Kid Grilled Cheese
	// [3] Kid Chicken Bites

	// 
	
	// console.log(
	// 	mapToCartSelection(
	// 		await api().getMenuOf('sandwiches')
	// 	)
	// );

	// const burgs: CartSelection[] = mapToCartSelection(await api().getMenuOf('burgers'));
	// const sauces: CartSelection[] = mapToCartSelection(await api().getMenuOf('sauces'));
	// const mappedDrinks: CartSelection[] = mapToCartSelection(drinks);
	const drinks = await api().getMenuOf('sides');
	console.log(drinks);

	// const _1st: AddItemResponseFlattened = await api().addItemToCart(restGuid, burgs[1]);
	// const _2nd: AddItemResponseFlattened = await api().addItemToCart(restGuid, burgs[4], _1st.cart.guid); // pass cart guid from _1st add here to keep all items in cart for checkout
	// await api().addItemToCart(restGuid, sauces[5], "4b36a97c-d524-4925-82b6-b70a54531c6a");
	// const getCartForCheckout: GetCartResponseFlattened = await api().getCartForCheckout(_2nd.cart.guid);
	// console.log(
	// 	'Can get the cart', 'guid: ', getCartForCheckout.cart.guid, getCartForCheckout.cart.order.selections
	// );
	// console.log('verify the cart..');
	// const valid: ValidateCartResponseFlattened = await api().validateCart(getCartForCheckout.cart.guid);
	// console.log(
	// 	'checking selections in validate cart call..', valid.cart.order.selections,
	// 	'guid for order to lookup and retrieve cart..', valid.cart.guid
	// );

	// let's lookup a cart we created 10 to 15 min. ago..
	const cart: GetCartResponseFlattened = await api().getCart("4b36a97c-d524-4925-82b6-b70a54531c6a");
	console.log(
		cart.cart.order.selections
	);
	
	// Steps:
	
	// 1 Add items to cart

	// 2 Validate cart
	// const validate: ValidateCartResponse[0]['data']['validateCartPreCheckout'] = await api().validateCart("dc9918b1-a80a-464a-9bab-8a334cd00b00");
	// console.log(validate.cart);

	// 3 Place order with Card
	
	// 4 Check order success data
	// get the completed order deets..
	// const orderGuidString = "cc320a08-dfaf-43ab-8b53-ece2d36f03ae";
	// const getCompletedOrder: CompletedOrderResponseFlattened = await api().getCompletedOrderInfo(orderGuidString, restGuid);
	// console.log(
	// 	`order: ${orderGuidString}, completed on ${moment(getCompletedOrder.estimatedFulfillmentDate).toDate()}`
	// );

	// I should now be able to use this data to feed to the DoorDash api and schedule a delivery

})();


// module.exports = {
// 	getCompletedOrderInfo
// };
