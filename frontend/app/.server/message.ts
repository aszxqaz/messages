class Message {
  constructor(
    public readonly id: number,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly processed: boolean,
    public readonly processingDelayMs: number
  ) {}

  static fromJSON(json: any): Message {
    const obj = JSON.parse(json);
    return new Message(
      obj.id,
      obj.content,
      new Date(obj.createdAt),
      obj.processed,
      obj.processingDelayMs
    );
  }
}
