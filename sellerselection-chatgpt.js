class Seller {
  constructor(id, stock) {
    this.id = id;
    this.stock = stock;
  }
}

class Broker {
  constructor(sellers) {
    this.sellers = sellers;
  }

  placeOrder(orderAmount) {
    let remainingOrder = orderAmount;
    let sellersUsed = [];

    while (remainingOrder > 0) {
      // Sort sellers by available stock ascendingly
      this.sellers.sort((a, b) => a.stock - b.stock);

      // Find the seller with the highest stock but less than or equal to remaining order
      const seller = this.sellers.find((s) => s.stock >= remainingOrder);

      if (seller) {
        sellersUsed.push({ id: seller.id, amount: remainingOrder });
        seller.stock -= remainingOrder;
        remainingOrder = 0;
      } else {
        // No single seller can fulfill the entire order, use the one with the most stock
        const maxStockSeller = this.sellers[this.sellers.length - 1];
        sellersUsed.push({
          id: maxStockSeller.id,
          amount: maxStockSeller.stock,
        });
        remainingOrder -= maxStockSeller.stock;
        maxStockSeller.stock = 0;
      }
    }

    return sellersUsed;
  }
}

// Example usage
const sellers = [new Seller(1, 20), new Seller(2, 500), new Seller(3, 35)];

const broker = new Broker(sellers);

// First order of 40 items
console.log(broker.placeOrder(40));

// Second order of 100 items
console.log(broker.placeOrder(100));
