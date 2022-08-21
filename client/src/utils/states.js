export const STATES = {
  0: {
    buyer: 'Order deleted',
    trader: 'Order deleted',
  },
  1: {
    buyer: "Waiting for trader's response",
    trader: 'Order sent by buyer',
  },
  2: {
    buyer: 'Order reverted by trader',
    trader: "Waiting for buyer's response",
  },
  3: {
    buyer: "Waiting for trader's response",
    trader: 'Order reverted by buyer',
  },
  4: {
    buyer: 'Order confirmed by trader',
    trader: "Waiting for buyer's response",
  },
  5: {
    buyer: 'Trader is finding supplier',
    trader: 'Order details accepted by buyer',
  },
  6: {
    buyer: 'Trader found supplier',
    trader: "Waiting for supplier's response",
    supplier: 'Order sent by trader',
  },
  7: {
    buyer: 'Trader is negotiating with supplier',
    trader: 'Order reverted by supplier',
    supplier: "Waiting for trader's response",
  },
  8: {
    buyer: 'Trader is negotiating with supplier',
    trader: "Waiting for supplier's response",
    supplier: 'Order reverted by trader',
  },
  9: {
    buyer: 'Trader is negotiating with supplier',
    trader: 'Order confirmed by supplier',
    supplier: "Waiting for trader's response",
  },
  10: {
    buyer: 'Trader is finding a new supplier',
    trader:
      'Negotiations with previous supplier ended. Please find a new supplier',
  },
  11: {
    buyer: 'Supplier has begun production',
    trader: 'Supplier has begun production',
    supplier: 'Order details accepted by trader. Please begin production.',
  },
  12: {
    buyer: 'Material sourced by supplier',
    trader: 'Material sourced by supplier',
    supplier: 'Material sourced',
  },
  13: {
    buyer: 'Goods are in factory',
    trader: 'Goods are in factory',
    supplier: 'Goods are in factory',
  },
  14: {
    buyer: 'Goods are undergoing quality control',
    trader: 'Goods are undergoing quality control',
    supplier: 'Goods are undergoing quality control',
  },
  15: {
    buyer: 'Production of goods is complete',
    trader: 'Production of goods is complete',
    supplier: 'Production of goods is complete',
  },
  16: {
    buyer: 'Supplier found a shipping line',
    trader: 'Supplier found a shipping line',
    supplier: "Waiting for shipping line's response",
    shippingLine: 'Order sent by supplier',
  },
  17: {
    buyer: 'Shipping line has given their amount',
    trader: 'Shipping line has given their amount',
    supplier: 'Amount specified by shipping line',
    shippingLine: "Waiting for supplier's response",
  },
  18: {
    buyer: 'Negotiations are occuring between supplier and shipping line',
    trader: 'Negotiations are occurring between supplier and shipping line',
    supplier: "Waiting for shipping line's response",
    shippingLine: 'Order reverted by supplier',
  },
  19: {
    buyer: 'Negotiations are occuring between supplier and shipping line',
    trader: 'Negotiations are occurring between supplier and shipping line',
    supplier: 'Order reverted by shipping line',
    shippingLine: "Waiting for supplier's response",
  },
  20: {
    buyer: 'Negotiations are occuring between supplier and shipping line',
    trader: 'Negotiations are occurring between supplier and shipping line',
    supplier: 'Order confirmed by shipping line',
    shippingLine: "Waiting for supplier's response",
  },
  21: {
    buyer: 'Supplier is finding a new shipping line',
    trader: 'Supplier is finding a new shipping line',
    supplier:
      'Negotiations with previous shipping line have ended. Please find a new shipping line',
  },
  22: {
    buyer: 'Shipping line is creating BL',
    trader: 'Shipping line is creating BL',
    supplier: 'Shipping line is creating BL',
    shippingLine: 'Order accepted by supplier. Please create and upload a BL.',
  },
  23: {
    buyer: 'BL uploaded by shipping line',
    trader: 'BL uploaded by shipping line',
    supplier: 'BL uploaded by shipping line',
    shippingLine: 'BL uploaded',
  },
  24: {
    buyer: 'Goods shipped',
    trader: 'Goods shipped',
    supplier: 'Goods shipped',
    shippingLine: 'Goods shipped',
  },
  25: {
    buyer: 'Documents verified by trader',
    trader: 'Documents verified',
    supplier: 'Documents verified by trader',
    shippingLine: 'Documents verified by trader',
  },
  26: {
    buyer: 'Documents updated by trader',
    trader: 'Documents updated',
    supplier: 'Documents updated by trader',
    shippingLine: 'Documents updated by trader',
  },
  27: {
    buyer: 'Documents verified',
    trader: 'Documents verified by buyer',
    supplier: 'Documents verified by buyer',
    shippingLine: 'Documents verified by buyer',
  },
  28: {
    buyer: 'Order closed',
    trader: 'Order closed',
    supplier: 'Order closed',
    shippingLine: 'Order closed',
  },
};
