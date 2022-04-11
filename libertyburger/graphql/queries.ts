export const GET_COMPLETED_ORDER = `
    query GET_COMPLETED_ORDER($input: CompletedOrderInput!) {
        completedOrder(input: $input) {
            ...completedOrder
            __typename
            }
        }
        fragment completedOrder on CompletedOrder {
            guid
            restaurant {
                guid
                name
                whiteLabelName
                timeZoneId
                location {
                    address1
                    address2
                    city
                    state
                    phone
                    __typename
                }
                creditCardConfig {
                    amexAccepted
                    tipEnabled
                    __typename
                }
                loyaltyConfig {
                    loyaltyRedemptionEnabled
                    loyaltySignupEnabled
                    loyaltySignupBonus
                    __typename
                }
                socialMediaLinks {
                    twitterLink
                    facebookLink
                    __typename
                }
                __typename
            }
            customerV2 {
                firstName
                lastName
                email
                phone
                __typename
            }
            selections {
                modifiers {
                    name
                    modifiers {
                        name
                        __typename
                    }
                    __typename
                    }
                    name
                    price
                    preDiscountPrice
                    usesFractionalQuantity
                    fractionalQuantity {
                        unitOfMeasure
                        quantity
                        __typename
                    }    
                    __typename
                }
                discounts {
                    restaurantDiscount {
                        guid
                        name
                        amount
                        promoCode
                        __typename
                    }
                    loyaltyDiscount {
                        guid
                        amount
                        __typename
                    }
                    globalReward {
                        name
                        amount
                        __typename
                    }
                    __typename
                }
                discountsTotal
                checkNumber
                checkGuid
                guestCommunication
                deliveryChargeTotal
                serviceChargeTotal
                tfgRoundUpTotal
                subtotal
                tax
                tip
                total
                estimatedFulfillmentDate
                paymentType
                orderPaymentGuid
                hasLoyaltyAttached
                curbsidePickup {
                    selected
                    __typename
                }
                curbsidePickupV2 {
                    transportDescription
                    transportColor
                    __typename
                }
                giftCard {
                    appliedBalance
                    __typename
                }
                deliveryInfo {
                    address1
                    address2
                    city
                    state
                    zipCode
                    notes
                    __typename
                }
                __typename
}`;
