export const exchange = props => {
  let amount, perMonthAmount, customAmount;
  let exchangeRate = props.exchangeRateObj["rates"][props.picker];

  amount = (Number(props.amount) * exchangeRate).toFixed(2);
  perMonthAmount = (Number(props.perMonthAmount) * exchangeRate).toFixed(2);
  customAmount = Number(props.customAmount).toFixed(2);

  return {
    amount: Number(amount),
    perMonthAmount: Number(perMonthAmount),
    customAmount: Number(customAmount)
  };
};
