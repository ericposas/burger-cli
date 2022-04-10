require('dotenv').config();

import { Burger } from './libertyburger/types';
import api from './libertyburger/api';

// main
(async () => {
	// const burgs: Array<Burger> = await api().getBurgers(`${process.env.restaurantGuid}`);
	// console.log(burgs);

	const menu = await api().getMenu(`${process.env.restaurantGuid}`);
	console.log(menu);

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
	
	// const addItem:Cart = await api.addItemToCart(restaurantGuid, selection);
	// console.log(
	// 	addItem.cart.guid
	// );

	// const getCart:Cart["cart"] = await api.getCartForCheckout(addItem.cart.guid);
	// console.log(
	// 	'cart returned after getCartForCheckout call [getCart]: ', getCart
	// );

	// const validate:Cart["cart"] = await api.validateCart(getCart.guid);
	// console.log(
	// 	validate
	// );
	
	//const order: PlaceCCOrderResponse = await api.placeCCOrder(validate.guid, 2); // should pull in default .env values for card info
	
	// get the completed order deets..
	// const orderGuidString = "cc320a08-dfaf-43ab-8b53-ece2d36f03ae";
	// const getCompletedOrder: CompletedOrderResponse = await api.getCompletedOrderInfo(orderGuidString);
	// console.log(
	// 	`getting completed order details for order: ${orderGuidString}`,
	// 	getCompletedOrder[0].data.completedOrder
	// );

	// I should now be able to use this data to feed to the DoorDash api and schedule a delivery

})();


// module.exports = {
// 	getCompletedOrderInfo
// };
