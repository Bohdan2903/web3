export const addressValidate = (address: string) => {
  return address.slice(0, 2) === '0x' ? address : '0x' + address
}
