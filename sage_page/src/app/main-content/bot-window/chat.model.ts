export class Chat {
  id!: number;
  user!: 'user' | 'assistant' | 'system';
  content!: string;
  constructor(user, content) {
    if (user == 'assistant') {
      this.user = 'assistant';
      this.content = content.choices[0].message.content;
    } else {
      this.user = user;
      this.content = content;
    }
  }
  toObject() {
    return {
      role: this.user,
      content: this.content,
    };
  }
}
