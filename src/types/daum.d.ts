declare namespace daum {
  interface PostcodeData {
    address: string;
    addressType: string;
    bname: string;
    buildingName: string;
    jibunAddress: string;
  }

  class Postcode {
    constructor(options: { oncomplete: (data: PostcodeData) => void; width?: string; height?: string });
    open(): void;
    embed(element: HTMLElement): void;
  }
}

interface Window {
  daum: typeof daum;
}
