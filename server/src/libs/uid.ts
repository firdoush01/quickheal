class UID {
  private static characters: String =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private static id: String;

  public static generate(length: number) {
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.characters.length);
      this.id += this.characters[randomIndex];
    }
    return this.id;
  }
}

export default UID;
