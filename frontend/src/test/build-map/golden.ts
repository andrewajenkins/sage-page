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

export const inHeaderPromotion: string = `
### Basic Promotion
#### promo sub-header
`;

export const outHeaderPromotion = [
  {
    name: 'Basic Promotion',
    text: '### Basic Promotion',
    type: 'heading',
    depth: 1,
  },
  {
    name: 'promo sub-header',
    text: '#### promo sub-header',
    type: 'heading',
    depth: 2,
  },
];
