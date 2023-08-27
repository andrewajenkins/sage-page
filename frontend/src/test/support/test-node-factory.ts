export class TestNodeFactory {
  static createContentNode(text: string, parent_id?: string) {
    return text.split('\n').map((text) => {
      return {
        name: text,
        text,
        type: 'section',
        parent_id,
      };
    });
  }
}
