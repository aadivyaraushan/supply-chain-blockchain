export const checkAmount = (value) => {
  if (!value || Number.isNaN(value)) {
    return 'Please enter a numeric amount';
  } else if (value <= 0) {
    return 'Please enter an amount greater than zero';
  }
};
