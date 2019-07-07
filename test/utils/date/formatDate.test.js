import formatDate from '../../../src/utils/date/formatDate';

test('formatDate(): it should return a date in format yyyy-mm-dd', async () => {
  const formattedDate = formatDate(new Date('01-02-2000'));

  expect(formattedDate).toBe('2000-1-2');
});
