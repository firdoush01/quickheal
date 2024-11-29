class Doctor {
  private id: string;
  private name: string;
  private available: boolean;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.available = false;
  }
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getAvailability() {
    return this.available;
  }
  setAvailable(isAvailable: boolean): void {
    this.available = isAvailable;
  }
}

export default Doctor;
