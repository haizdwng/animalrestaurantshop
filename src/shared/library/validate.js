export const cleanOtp = (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);

export const validate = {
  username: (v) => (/^[a-z0-9]{6,12}$/.test(v) ? '' : '6–12 ký tự, chỉ chữ thường a-z và số 0-9'),
  playerName: (v) => (v.trim().length < 1 ? 'Nhập tên người chơi' : v.trim().length > 32 ? 'Tối đa 32 ký tự' : ''),
  password: (v) => (/^[a-zA-Z0-9]{6,20}$/.test(v) ? '' : '6–20 ký tự, chỉ chữ cái a-z, A-Z và số 0-9'),
  openid: (v) => (!v.trim() ? 'Nhập mã người chơi' : ''),
  otp: (v) => (/^[A-Z0-9]{12}$/.test(v) ? '' : 'Mã mã xác thực gồm 12 ký tự A-Z, 0-9')
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

export function passwordStrength(pw) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && pw.length >= 14) s++;
  return s;
};