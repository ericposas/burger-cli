require('dotenv').config();

import moment from 'moment';
import api from './libertyburger/api';
import { DiningOptionsResponse, Item, MenuOf, MenusV3, RestaurantDataResponse } from './libertyburger/types/menu';
import { AddItemResponse, AddItemResponseFlattened, CartSelection, CompletedOrderResponse, CompletedOrderResponseFlattened, GetCartResponse, GetCartResponseFlattened, ValidateCartResponse, ValidateCartResponseFlattened } from './libertyburger/types/ordering';

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const term = require('terminal-kit').terminal;
const currency = require('currency.js');
const imgPx = 25;

const restaurantGuid = `${process.env.restaurantGuid}`;
const shortUrl = `${process.env.shortUrl}`;

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

type ItemInfo = { name: string; price: number, stock: boolean, image: string };
const mapToCartSelection = (items: Item[]): [number, ItemInfo, CartSelection][] => {
	return items.map((item, idx) => {
		// returns an array of [index (choice #), ItemInfo, CartSelection] tuples
		return [
			idx,
			<ItemInfo>{
				name: item.name,
				price: item.price,
				stock: item.outOfStock,
				image: item.imageUrl,
			},
			<CartSelection>{
				itemGuid: item.guid,
				itemGroupGuid: item.itemGroupGuid,
				itemMasterId: item.masterId,
				modifierGroups: getPinkModifier(item.itemGroupGuid) ? [getPinkModifier(item.itemGroupGuid)] : [],
				quantity: 1,
				specialInstructions: ""
			}
		];
	});
};

// now we'll have to pass in the restaurantGuid and shortUrl for the restaurant menu that we want
const allItemsAsCartReadySelections = async (_restGuid: string, _shortUrl: string): Promise<[number, ItemInfo, CartSelection][]> => {
	try {
		let items: Item[] = [];
		const allMenus: MenusV3 = await api().getMenus(_restGuid, _shortUrl);
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

	const restaurant = await api().getRestaurantData(restaurantGuid);	
	// check restaurant availability before proceeding
	const isAvail: string | boolean = await api().getAvailability(restaurantGuid);
	// console.log(isAvail);

	if (typeof isAvail === 'boolean' && isAvail === false) {
		console.log(`Sorry, ${restaurant.whiteLabelName} is not open for orders right now.`);
		process.exit();
	}

	const items = mapToCartSelection(await api().getMenuOf('burgers'));
	items.forEach(item => {
		console.log(
			`#${item[0]}`,
			item[1].name,
			`$${item[1].price}`
		);
	});
	
	let cartGuid: string;

	rl.question(`What would you like to order from ${restaurant.whiteLabelName}?\n`, async (input: number) => {
		console.log(`\nYou selected item ${input.toString()}, ${items[input][1].name}, price: $${items[input][1].price}\n`);
		const add: AddItemResponseFlattened = await api().addItemToCart(restaurantGuid, items[input][2]); // this first item will create a cartGuid that we can reference in the next item add operation
		console.log(add);
		next();
	});

	async function next() {

		// const cart: GetCartResponseFlattened = await api().getCart(cartGuid);
		// console.log(
		// 	'Here is your current cart: ',
		// 	cart.cart.order.selections
		// );

		// rl.question('Where do you live ? ', (country: string) => {
		// 	console.log(`You is a citizen of ${country}`);
		// 	rl.close();
		// });
	}

	rl.on('close', function () {
		console.log('\nBYE BYE !!!');
		process.exit(0);
	});

	// const burgs: CartSelection[] = mapToCartSelection(await api().getMenuOf('burgers'));
	// const sauces: CartSelection[] = mapToCartSelection(await api().getMenuOf('sauces'));
	// const mappedDrinks: CartSelection[] = mapToCartSelection(drinks);
	// const drinks = await api().getMenuOf('sides');
	// console.log(drinks);

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
	// const cart: GetCartResponseFlattened = await api().getCart("4b36a97c-d524-4925-82b6-b70a54531c6a");
	// console.log(
	// 	cart.cart.order.selections
	// );
	
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
