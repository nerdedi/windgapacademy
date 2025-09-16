declare module "jspdf" {
  export default class jsPDF {
    constructor();
    text(text: string, x: number, y: number): void;
    save(filename: string): void;
  }
}

// Add more declarations as needed
