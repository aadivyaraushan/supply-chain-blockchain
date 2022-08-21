export const checkPercent = (value, isQuantity = false, prevQuantity) => {
  console.log(prevQuantity, typeof prevQuantity);
  console.log(value, typeof value);
  console.log(prevQuantity * 1.1 >= value && value >= prevQuantity * 0.9);
  if (!value && value !== 0) {
    return `Please enter a numeric ${isQuantity ? 'quantity' : 'percent'}`;
  } else if (value < 0) {
    return `Please enter a ${
      isQuantity ? 'quantity' : 'percent'
    } greater than zero`;
  } else if (value <= 0 && isQuantity) {
    return `Please enter a quantity greater than zero`;
  } else if (
    prevQuantity &&
    !(prevQuantity * 1.1 >= value && value >= prevQuantity * 0.9)
  ) {
    return `Final quantity must be within ±10% range of the original quantity`;
  } else if (value > 100 && !isQuantity) {
    return `Please enter a percent less than 100`;
  }
};
