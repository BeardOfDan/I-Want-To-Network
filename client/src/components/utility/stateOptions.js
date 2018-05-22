const values = [
  'Alaska',
  'Alabama',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut'
];

const StateOptions = [];

for (let i = 0; i < values.length; i++) {
  StateOptions[i] = { 'value': values[i], 'label': values[i] };
}

export default { StateOptions };
