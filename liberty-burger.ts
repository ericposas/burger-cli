require('dotenv').config();

import moment from 'moment';
import api from './libertyburger/api';
import ddApi from './doordash/api';
import { Item, MenusV3 } from './libertyburger/types/menu';
import { AddItemResponseFlattened, CartSelection, GetCartResponseFlattened, ModifierGroup, PlaceCCOrderResponseFlattened, ValidateCartResponseFlattened } from './libertyburger/types/ordering';
import { CreateDeliveryResponse, DeliveryStatusResponse } from './doordash/types';

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

const getPinkModifier = (): ModifierGroup[] => {
	// if so, return the 'Pink' (medium) modifier for cook temp
	return [
		{
			guid: "98dae877-c670-4dfa-9f38-9daabcd45292",
			modifiers: [
				{
					itemGroupGuid: "ccefc41e-76f5-42a1-ab7d-58190ece0d83",
					itemGuid: "fdade2a1-f4b4-43ee-b8e4-df29e526beba",
					modifierGroups: [],
					quantity: 1
				},
			]
		},
		{
			guid: "ae57b425-e0fd-407b-835a-9b84386e6fcc",
			modifiers: []
		}
	];
};

const getMayoAndAmericanModifier = (): ModifierGroup[] => {
	return [
		{
			guid: "f9f30ded-47ca-49fb-a3f7-1caa88753212",
			modifiers: [
				{
					itemGroupGuid: "ccefc41e-76f5-42a1-ab7d-58190ece0d83",
					itemGuid: "dfff32ad-0df4-487b-ba45-bf3abd6d88b3",
					modifierGroups: [],
					quantity: 1
				},
			]
		},
		{
			guid: "ddc75c11-beb2-41c3-a895-5c6f70a573db",
			modifiers: [
				// American
				{
					itemGroupGuid: "ccefc41e-76f5-42a1-ab7d-58190ece0d83",
					itemGuid: "6d2e52f3-ab98-46c6-b062-1e94e91259cd",
					modifierGroups: [],
					quantity: 1
				},
				// Cheddar
				// {
				// 	itemGroupGuid: "ccefc41e-76f5-42a1-ab7d-58190ece0d83",
				// 	itemGuid: "95cfe232-0e4b-4712-bf11-de3949e2aa81",
				// 	modifierGroups: [],
				// 	quantity: 1
				// },
				// Queso Blanco
				// {
				// 	itemGroupGuid: "ccefc41e-76f5-42a1-ab7d-58190ece0d83",
				// 	itemGuid: "a38acfbf-edb0-4b2f-92d4-1cef60c0bf13",
				// 	modifierGroups: [],
				// 	quantity: 1
				// }
			]
		},
		{
			guid: "ef1500de-0d99-414a-b2d0-da86c7af7032",
			modifiers: []
		},
		{
			guid: "2375b9dd-0a84-4c95-89eb-73a075743c48",
			modifiers: []
		},
		{
			guid: "ffbaa1a1-cc2c-41a8-bc38-eb19df8b8426",
			modifiers: []
		},
	]
}

type ItemInfo = { name: string; price: number, outOfStock: boolean, image: string, description: string };
const mapToCartSelection = (items: Item[]): [number, ItemInfo, CartSelection][] => {
	return items.map((item, idx) => {
		// returns an array of [index (choice #), ItemInfo, CartSelection] tuples
		return [
			idx,
			<ItemInfo>{
				name: item.name,
				price: item.price,
				outOfStock: item.outOfStock,
				image: item.imageUrl,
				description: item.description
			},
			<CartSelection>{
				itemGuid: item.guid,
				itemGroupGuid: item.itemGroupGuid,
				itemMasterId: item.masterId,
				modifierGroups: (() => {
					let modifiers: ModifierGroup[] = [];
					if (item.itemGroupGuid === "ccefc41e-76f5-42a1-ab7d-58190ece0d83") { // <-- if item is a burger, checking here against 'Burger' group guid..
						modifiers = modifiers.concat(getPinkModifier());
					}
					if (item.name === 'The Liberty Burger') { // <-- if item is the Liberty Burger, needs the condiment choice
						modifiers = modifiers.concat(getMayoAndAmericanModifier());
					}
					return modifiers;
				})(),
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

	rl.on('close', function () {
		console.log('\nBYE BYE !!!');
		process.exit(0);
	});

	const restaurant = await api().getRestaurantData(restaurantGuid);
	// check restaurant availability before proceeding
	const isAvail: string | boolean = await api().getAvailability(restaurantGuid);
	// console.log(isAvail);

	if (typeof isAvail === 'boolean' && isAvail === false) {
		console.log(`Sorry, ${restaurant.whiteLabelName} is not open for orders right now.`);
		process.exit();
	}

	const burgerMenu = await api().getMenuOf('burgers');
	const items = mapToCartSelection(burgerMenu);
	items.forEach(item => {
		if (!item[1].outOfStock && item[1].name !== 'Ahi' && item[1].name !== 'The Libertine' && item[1].name !== 'Woodstock') {
			console.log(
				`#${item[0]}: `,
				`${item[1].name}, `,
				`price: $${item[1].price}`,
			);
			console.log(`${item[1].description}\n`);
		}
	});

	let cartGuid: string; // keep cartGuid in memory by assigning here after first item is added

	orderStart();

	async function orderStart() {
		rl.question(`What would you like to order from ${restaurant.whiteLabelName}?\n`, async (input: number) => {
			console.log(`\nYou selected item ${input.toString()}, ${items[input][1].name}, price: $${items[input][1].price}\n`);
			const add: AddItemResponseFlattened = await api().addItemToCart(restaurantGuid, items[input][2]); // this first item will create a cartGuid that we can reference in the next item add operation
			if (add.cart) {
				cartGuid = add.cart.guid;
				console.log('cart guid: ', cartGuid);
				viewCart(cartGuid);
			} else {
				console.error('Something went wrong, no cart guid -- must have been a misconfigured selection or modifier');
				console.error(add);
				orderStart();
			}
		});
	}

	async function viewCart(cartGuid: string) {
		const cart: GetCartResponseFlattened = await api().getCart(cartGuid);
		console.log('Here is your current cart: \n');
		console.log(
			cart.cart.order.selections.reduce((acc, curr) => `name: "${curr.name}", price: ${curr.price}\n` + acc, '')
		);
		shouldWeAddAnotherItem();
	}

	async function shouldWeAddAnotherItem() {
		rl.question('Would you like to add something else? y/n \n', async (input: string) => {
			if (input === 'y') {
				addAnotherItem();
			} else {
				// move on to processing cart
				shouldWeCheckout();
			}
		});
	}

	async function addAnotherItem() {
		rl.question(`What else would you like to order from ${restaurant.whiteLabelName}?\n`, async (input: number) => {
			console.log(`\nYou selected item ${input.toString()}, ${items[input][1].name}, price: $${items[input][1].price}\n`);
			await api().addItemToCart(restaurantGuid, items[input][2], cartGuid); // reference already created cart
			viewCart(cartGuid);
		});
	}

	async function shouldWeCheckout() {
		rl.question(`Do you want to checkout?\n`, async (input: string) => {
			if (input === 'y') {
				proceedToCheckout(cartGuid);
			} else {
				// go back to cart add loop
				shouldWeAddAnotherItem();
			}
		});
	}

	async function proceedToCheckout(cartGuid: string) {
		try {
			console.log('getting cart for checkout...');
			const cart: GetCartResponseFlattened = await api().getCartForCheckout(cartGuid);
			console.log('validating cart...');
			const validate: ValidateCartResponseFlattened = await api().validateCart(cart.cart.guid);
			// place order here 
			console.log('placing order...');
			const placedOrder: PlaceCCOrderResponseFlattened = await api().placeCCOrder(
				validate.cart.guid,
				1.99,
				{
					firstName: `${process.env.firstName}`,
					lastName: `${process.env.lastName}`,
					email: `${process.env.email}`,
					phone: `${process.env.phone}`
				},
				{
					cardFirst6: `${process.env.cardFirst6}`,
					cardLast4: `${process.env.cardLast4}`,
					encryptedCardDataString: `${process.env.encryptedCardDataString}`,
					encryptionKeyId: `${process.env.encryptionKeyId}`,
					expMonth: `${process.env.expMonth}`,
					expYear: `${process.env.expYear}`,
					saveCard: false,
					zipCode: `${process.env.zipCode}`
				}
			);
			console.log('Order successfully placed!');

			// start doordash order process..
			console.log('Creating DoorDash delivery...');
			const createdDelivery: CreateDeliveryResponse = await ddApi().createDelivery(placedOrder.completedOrder.guid, restaurantGuid); // "cc320a08-dfaf-43ab-8b53-ece2d36f03ae", restaurantGuid);
			console.log('Delivery created!', `fee: ${createdDelivery.fee},`, `order value: ${createdDelivery.order_value},`, `est. drop off time: ${moment(createdDelivery.dropoff_time_estimated).toDate()}\n`);

			let status: DeliveryStatusResponse = await ddApi().getDeliveryStatus(createdDelivery.external_delivery_id)

			setInterval(checkDeliveryStatus, 15000); // poll every 15 sec. for status updates

			async function checkDeliveryStatus() {
				console.log('Getting status update...');
				status = await ddApi().getDeliveryStatus(createdDelivery.external_delivery_id)
				if (status && status.delivery_status !== 'delivered') {
					console.log(`status: ${status.delivery_status},`, `est. drop off time: ${moment(status.dropoff_time_estimated).toDate()},`, `tracking: ${status.tracking_url}\n`);
				} else {
					console.log('Your food has been delivered, Enjoy!');
					process.exit(0);
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

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
