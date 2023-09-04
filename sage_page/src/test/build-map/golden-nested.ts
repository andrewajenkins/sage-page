export const inNestedHeaderDemotion: string = `
# Input header 1
## Input header 2
### Input header 3
## Input header 4
### Input header 5
`;

export const outNestedHeaderDemotion = {
  feId: 'header2-id',
  name: 'Second header',
  text: '## Second header',
  type: 'heading',
  parent_id: 'header1-id',
  depth: 2,
  sections: [
    {
      feId: 'generated_0',
      name: 'Input header 1',
      text: '# Input header 1',
      type: 'heading',
      parent_id: 'header2-id',
      depth: 3,
      sections: [
        {
          feId: 'generated_1',
          name: 'Input header 2',
          text: '## Input header 2',
          type: 'heading',
          depth: 4,
          sections: [
            {
              feId: 'generated_2',
              name: 'Input header 3',
              text: '### Input header 3',
              type: 'heading',
              depth: 5,
            },
          ],
        },
        {
          feId: 'generated_3',
          name: 'Input header 4',
          text: '## Input header 4',
          type: 'heading',
          depth: 4,
          sections: [
            {
              feId: 'generated_4',
              name: 'Input header 5',
              text: '### Input header 5',
              type: 'heading',
              depth: 5,
            },
          ],
        },
      ],
    },
  ],
};

// export const outNestedHeaderDemotion = {
//   feId: 'file-id',
//   type: 'file',
//   parent_id: 'folder-id',
//   name: 'sub-file',
//   depth: 0,
//   sections: [
//     {
//       feId: 'header1-id',
//       name: 'First header',
//       text: '## First header',
//       type: 'heading',
//       parent_id: 'file-id',
//       depth: 1,
//       sections: [
//         {
//           feId: 'header2-id',
//           name: 'Second header',
//           text: '## Second header',
//           type: 'heading',
//           parent_id: 'header1-id',
//           depth: 2,
//           sections: [
//             {
//               name: 'Input header 1',
//               text: '# Input header 1',
//               type: 'heading',
//               parent_id: 'header2-id',
//               depth: 3,
//               sections: [
//                 {
//                   feId: 'generated_0',
//                   name: 'Input header 2',
//                   text: '## Input header 2',
//                   type: 'heading',
//                   depth: 4,
//                   sections: [
//                     {
//                       feId: 'generated_1',
//                       name: 'Input header 3',
//                       text: '### Input header 3',
//                       type: 'heading',
//                       depth: 5,
//                     },
//                   ],
//                 },
//                 {
//                   feId: 'generated_2',
//                   name: 'Input header 4',
//                   text: '## Input header 4',
//                   type: 'heading',
//                   depth: 4,
//                   sections: [
//                     {
//                       feId: 'generated_3',
//                       name: 'Input header 5',
//                       text: '### Input header 5',
//                       type: 'heading',
//                       depth: 5,
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
