export const botText: string = `
Sure! Here's a solution that will help you achieve this layout:

1. **HTML Layout**:
   You can structure your HTML as follows:

   \`\`\`html
   <div class="container">
       <label class="sticky-label">Your Label</label>

       <div class="scrollable-content">
           <!-- Your Large Center Content Here -->
       </div>

       <input class="sticky-input" type="text" placeholder="Your Input">
   </div>
   \`\`\`

2. **CSS Styling**:
   Style your layout using CSS to achieve the sticky effect and make the center content scrollable.

   \`\`\`css
   .container {
       display: flex;
       flex-direction: column;
       height: 100vh; /* Take the full viewport height */
   }

   .sticky-label {
       flex-shrink: 0; /* Prevent shrinking */
       background: white; /* Ensure label background covers content behind */
   }

   .scrollable-content {
       flex-grow: 1; /* Allow the content to grow */
       overflow-y: auto; /* Make it scrollable */
   }

   .sticky-input {
       flex-shrink: 0; /* Prevent shrinking */
       background: white; /* Ensure input background covers content behind */
   }
   \`\`\`

3. **Explanation**:

   - The \`flex-shrink: 0\` property on the label and input ensures that they don't shrink regardless of the viewport size, essentially making them "stick" to the top and bottom respectively.

   - The \`flex-grow: 1\` property on the \`.scrollable-content\` ensures that it occupies all the available space between the label and the input.

   - The \`overflow-y: auto\` property on the \`.scrollable-content\` makes sure that when the content inside this div is more than the space allows, it becomes scrollable.

   - The \`background: white\` properties on the label and input ensure that if the scrollable content scrolls beneath them, it won't be visible through the label or input.

This approach allows you to have a fixed label at the top and an input at the bottom, with a scrollable content area in between, all fitting within the viewport's height. Adjustments can be made as needed based on your content and styling preferences.Sure! Here's a solution that will help you achieve this layout:

1. **HTML Layout**:
   You can structure your HTML as follows:

   \`\`\`html
   <div class="container">
       <label class="sticky-label">Your Label</label>

       <div class="scrollable-content">
           <!-- Your Large Center Content Here -->
       </div>

       <input class="sticky-input" type="text" placeholder="Your Input">
   </div>
   \`\`\`

2. **CSS Styling**:
   Style your layout using CSS to achieve the sticky effect and make the center content scrollable.

   \`\`\`css
   .container {
       display: flex;
       flex-direction: column;
       height: 100vh; /* Take the full viewport height */
   }

   .sticky-label {
       flex-shrink: 0; /* Prevent shrinking */
       background: white; /* Ensure label background covers content behind */
   }

   .scrollable-content {
       flex-grow: 1; /* Allow the content to grow */
       overflow-y: auto; /* Make it scrollable */
   }

   .sticky-input {
       flex-shrink: 0; /* Prevent shrinking */
       background: white; /* Ensure input background covers content behind */
   }
   \`\`\`

3. **Explanation**:

   - The \`flex-shrink: 0\` property on the label and input ensures that they don't shrink regardless of the viewport size, essentially making them "stick" to the top and bottom respectively.

   - The \`flex-grow: 1\` property on the \`.scrollable-content\` ensures that it occupies all the available space between the label and the input.

   - The \`overflow-y: auto\` property on the \`.scrollable-content\` makes sure that when the content inside this div is more than the space allows, it becomes scrollable.

   - The \`background: white\` properties on the label and input ensure that if the scrollable content scrolls beneath them, it won't be visible through the label or input.

This approach allows you to have a fixed label at the top and an input at the bottom, with a scrollable content area in between, all fitting within the viewport's height. Adjustments can be made as needed based on your content and styling preferences.Sure! Here's a solution that will help you achieve this layout:

1. **HTML Layout**:
   You can structure your HTML as follows:

   \`\`\`html
   <div class="container">
       <label class="sticky-label">Your Label</label>

       <div class="scrollable-content">
           <!-- Your Large Center Content Here -->
       </div>

       <input class="sticky-input" type="text" placeholder="Your Input">
   </div>
   \`\`\`

2. **CSS Styling**:
   Style your layout using CSS to achieve the sticky effect and make the center content scrollable.

   \`\`\`css
   .container {
       display: flex;
       flex-direction: column;
       height: 100vh; /* Take the full viewport height */
   }

   .sticky-label {
       flex-shrink: 0; /* Prevent shrinking */
       background: white; /* Ensure label background covers content behind */
   }

   .scrollable-content {
       flex-grow: 1; /* Allow the content to grow */
       overflow-y: auto; /* Make it scrollable */
   }

   .sticky-input {
       flex-shrink: 0; /* Prevent shrinking */
       background: white; /* Ensure input background covers content behind */
   }
   \`\`\`

3. **Explanation**:

   - The \`flex-shrink: 0\` property on the label and input ensures that they don't shrink regardless of the viewport size, essentially making them "stick" to the top and bottom respectively.

   - The \`flex-grow: 1\` property on the \`.scrollable-content\` ensures that it occupies all the available space between the label and the input.

   - The \`overflow-y: auto\` property on the \`.scrollable-content\` makes sure that when the content inside this div is more than the space allows, it becomes scrollable.

   - The \`background: white\` properties on the label and input ensure that if the scrollable content scrolls beneath them, it won't be visible through the label or input.

This approach allows you to have a fixed label at the top and an input at the bottom, with a scrollable content area in between, all fitting within the viewport's height. Adjustments can be made as needed based on your content and styling preferences.
`;
