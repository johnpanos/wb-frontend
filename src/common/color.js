export const ColorHelper = (type) => {
  let hexColor;
  switch(type) {
    default:
    case "primary":
      hexColor = "#409EFF";
      break;
    case "success":
      hexColor = "#67C23A"
      break;
    case "warning":
      hexColor = "#E6A23C";
      break;
    case "danger":
      hexColor = "#F56C6C";
      break;
    case "info":
      hexColor = "#909399";
      break;
  }
  return hexColor;
}