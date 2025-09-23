export const calculateItemTotal = (item) => {
  let quantity = Number(item.quantity) || 0;
  let price = Number(item.price) || 0;
  let discount = Number(item.discount) || 0;
  let gst = Number(item.gst) || 0;
  let discountType = (item.discountType || "").toLowerCase();

  let itemTotal = quantity * price;

  if (discount > 0) {
    if (discountType === "percent") {
      itemTotal -= (itemTotal * discount) / 100;
    } else if (discountType === "flat") {
      itemTotal -= discount;
    }
  }

  itemTotal = Math.max(0, itemTotal); // prevent negative

  const gstAmount = itemTotal * (gst / 100);

  return itemTotal + gstAmount;
};
