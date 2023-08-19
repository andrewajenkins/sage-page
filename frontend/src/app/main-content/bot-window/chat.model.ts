export class Chat {
  id: number;
  constructor(query, chatResponse) {
    this.id = Math.floor(Math.random() * 1000000);
  }
}
