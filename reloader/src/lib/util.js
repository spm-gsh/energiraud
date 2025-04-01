function azertyToQwerty(str) {
  const azerty = ['&', 'é', '"', "'", '(', '-', 'è', '_', 'ç', 'à'];
  const qwerty = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  let result = '';
  for (let i = 0; i < str.length; i++) {
    let index = azerty.indexOf(str[i]);
    if (index !== -1) {
      result += qwerty[index];  // Remplace le caractère par son équivalent en QWERTY
    } else {
      result += str[i];  // Si le caractère n'est pas trouvé, garde le tel quel
    }
  }
  return result;
}

export { azertyToQwerty };