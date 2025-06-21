export default class ToasterService {
  static callBack: ((args: { message: string; type: string }) => void) | null = null;

  static register = (toastCallback: (args: { message: string; type: string }) => void) => {
    ToasterService.callBack = toastCallback;
  };
  static showtoast = ({ message, type }: { message: string; type: string }) => {
    if (ToasterService.callBack) {
      ToasterService.callBack({ message, type });
    }
  };
}
