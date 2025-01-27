export const hGenerateCode = (mask: string) => {
  let code = '';
  for (let i = 0; i < mask.length; i++) {
    switch (mask[i]) {
      case 'A':
        code += getRandomChar('upperCase').toLowerCase();
        break;
      case 'a':
        code += getRandomChar('lowerCase');
        break;
      case '#':
        code += String(getRandomNumber());
        break;
      case 'X':
        code +=
          Math.random() < 0.5 ? getRandomChar('upperCase') : getRandomNumber();
        break;
      case 'x':
        code +=
          Math.random() < 0.5 ? getRandomChar('lowerCase') : getRandomNumber();
        break;
      case '*':
        code += Math.random() < 0.5 ? getRandomChar() : getRandomNumber();
        break;
      default:
        code += mask[i];
    }
  }
  return code;
};

export const getRandomChar = (register?: 'upperCase' | 'lowerCase'): string => {
  const char = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  if (!register) {
    register = Math.random() < 0.5 ? 'lowerCase' : 'upperCase';
  }
  return register === 'upperCase' ? char.toUpperCase() : char.toLowerCase();
};

export const getRandomNumber = (): number => {
  return Math.floor(Math.random() * 10);
};
