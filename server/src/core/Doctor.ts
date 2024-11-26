class Doctor {
  private id: string;
  private name: String;
  private available: boolean;
  constructor(id: string, name: String) {
    this.id = id;
    this.name = name;
    this.available = false;
  }
  getId(): string {
    return this.id;
  }
  getName(): String {
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
