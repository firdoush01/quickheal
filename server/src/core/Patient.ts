class Patient {
  private static inc = 1; // Static counter for unique IDs
  private id: number;
  private name: string;
  private description: string;

  constructor(name: string, description: string) {
    this.id = Patient.inc++;
    this.name = name;
    this.description = description;
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }
}

export default Patient;
