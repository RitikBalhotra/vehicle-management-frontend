type SpinnerCallback = (loading: boolean) => void;

class Spinnerservice {
  private static callBack: SpinnerCallback | null = null;

  static register(spinnerCallback: SpinnerCallback): void {
    Spinnerservice.callBack = spinnerCallback;
  }

  static showSpinner(): void {
    if (Spinnerservice.callBack) {
      Spinnerservice.callBack(true);
    }
  }

  static hideSpinner(): void {
    if (Spinnerservice.callBack) {
      Spinnerservice.callBack(false);
    }
  }
}

export default Spinnerservice;
