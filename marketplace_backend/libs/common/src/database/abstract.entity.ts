export class AbstractEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
