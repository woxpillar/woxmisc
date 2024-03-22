// Seller object
class Seller {
  constructor(id, initialStock) {
    this.id = id;
    this.stock = initialStock;
    this.lastUpdated = Date.now();
  }

  updateStock(interval) {
    const now = Date.now();
    const elapsedTime = now - this.lastUpdated;
    const restockRate = 1; // Assuming 1 item per interval (e.g., minute)
    const restockAmount = Math.floor(elapsedTime / interval) * restockRate;
    this.stock += restockAmount;
    this.lastUpdated = now;
  }
}

// Function to fulfill an order
function fulfillOrder(sellers, order) {
  const sellersByStock = sellers.sort((a, b) => b.stock - a.stock);
  const fulfillment = [];

  let remaining = order;
  for (const seller of sellersByStock) {
    seller.updateStock(60000); // Assuming a 1-minute interval for restocking

    if (seller.stock > 0) {
      const taken = Math.min(remaining, seller.stock);
      remaining -= taken;
      seller.stock -= taken;
      fulfillment.push({ seller: seller.id, quantity: taken });

      if (remaining === 0) {
        break;
      }
    }
  }

  if (remaining > 0) {
    console.log(`Unable to fulfill the entire order. Remaining: ${remaining}`);
  }

  return fulfillment;
}

// Example usage
const sellers = [new Seller(1, 20), new Seller(2, 500), new Seller(3, 35)];

const order1 = 15;
const fulfillment1 = fulfillOrder(sellers, order1);
console.log(`Order 1 (${order1}):`, fulfillment1);

// Simulate some time passing
setTimeout(() => {
  const order2 = 100;
  const fulfillment2 = fulfillOrder(sellers, order2);
  console.log(`Order 2 (${order2}):`, fulfillment2);
}, 5000);
