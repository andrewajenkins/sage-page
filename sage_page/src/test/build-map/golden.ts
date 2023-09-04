export const inFileContents: string = `
Some text
- Some bullet
`;

export const outFileContents = {
  feId: 'file-id',
  name: 'sub-file',
  type: 'file',
  parent_id: 'folder-id',
  contents: [
    {
      name: 'Some text',
      text: 'Some text',
      type: 'content',
      parent_id: 'file-id',
    },
    {
      name: 'Some bullet',
      text: '- Some bullet',
      type: 'content',
      parent_id: 'file-id',
    },
  ],
};

export const inHeaderPromotion: string = `
### Basic Promotion
#### promo sub-header
`;

export const outHeaderPromotion = {
  feId: 'file-id',
  name: 'sub-file',
  type: 'file',
  parent_id: 'folder-id',
  depth: 0,
  sections: [
    {
      name: 'Basic Promotion',
      text: '### Basic Promotion',
      type: 'heading',
      parent_id: 'file-id',
      sections: [
        {
          name: 'promo sub-header',
          text: '#### promo sub-header',
          type: 'heading',
        },
      ],
    },
  ],
};

export const inMultipleHeaderPromotion: string = `
## First header
## Second header
### Third header
### Fourth header
`;

export const outMultipleHeaderPromotion = {
  feId: 'file-id',
  name: 'sub-file',
  type: 'file',
  parent_id: 'folder-id',
  depth: 0,
  sections: [
    {
      name: 'First header',
      text: '## First header',
      type: 'heading',
      parent_id: 'file-id',
      depth: 1,
    },
    {
      name: 'Second header',
      text: '## Second header',
      type: 'heading',
      parent_id: 'file-id',
      depth: 1,
      sections: [
        {
          name: 'Third header',
          text: '### Third header',
          type: 'heading',
          depth: 2,
        },
        {
          name: 'Fourth header',
          text: '### Fourth header',
          type: 'heading',
          depth: 2,
        },
      ],
    },
  ],
};
