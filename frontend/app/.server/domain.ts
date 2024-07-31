export class Message {
  constructor(
    public readonly id: number,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly processed: boolean,
    public readonly processingDelayMs: number
  ) {}

  static fromJSON(obj: any): Message {
    return new Message(
      obj.id,
      obj.content,
      new Date(obj.created_at),
      obj.processed,
      obj.processing_delay
    );
  }
}

export class Statistics {
  constructor(
    public readonly totalMessages: number,
    public readonly unprocessedMessages: number,
    public readonly processedMessages: number
  ) {}

  static fromJSON(obj: any): Statistics {
    return new Statistics(
      obj.total_messages,
      obj.unprocessed_messages,
      obj.processed_messages
    );
  }
}
