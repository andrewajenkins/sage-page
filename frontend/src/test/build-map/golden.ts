export const inFileContents: string = `
Some text
- Some bullet
`;

export const outFileContents = [
  {
    name: 'Some text',
    text: 'Some text',
    type: 'content',
  },
  {
    name: 'Some bullet',
    text: '- Some bullet',
    type: 'content',
  },
];
