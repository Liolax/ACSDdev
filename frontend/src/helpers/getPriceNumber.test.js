import getPriceNumber from './getPriceNumber';

test('parses string price', () => {
  expect(getPriceNumber('12.34')).toBe(12.34);
});

test('parses number price', () => {
  expect(getPriceNumber(15)).toBe(15);
});

test('parses $numberDecimal object', () => {
  expect(getPriceNumber({ $numberDecimal: '9.99' })).toBe(9.99);
});
