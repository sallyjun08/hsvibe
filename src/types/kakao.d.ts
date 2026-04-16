/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace kakao.maps {
  function load(callback: () => void): void;

  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setLevel(level: number, options?: { animate?: boolean }): void;
    getCenter(): LatLng;
    getLevel(): number;
    panTo(latlng: LatLng): void;
    getProjection(): MapProjection;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
    setImage(image: MarkerImage): void;
  }

  class MarkerImage {
    constructor(src: string, size: Size, options?: MarkerImageOptions);
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
    setContent(content: string): void;
  }

  class CustomOverlay {
    constructor(options: CustomOverlayOptions);
    setMap(map: Map | null): void;
    setPosition(latlng: LatLng): void;
    setContent(content: string | HTMLElement): void;
    getPosition(): LatLng;
  }

  namespace event {
    function addListener(target: any, type: string, handler: () => void): void;
    function removeListener(target: any, type: string, handler: () => void): void;
  }

  interface MapOptions {
    center: LatLng;
    level: number;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    title?: string;
    image?: MarkerImage;
    clickable?: boolean;
  }

  interface MarkerImageOptions {
    offset?: Point;
    spriteOrigin?: Point;
    spriteSize?: Size;
  }

  interface InfoWindowOptions {
    content: string | HTMLElement;
    removable?: boolean;
    zIndex?: number;
  }

  interface CustomOverlayOptions {
    position: LatLng;
    content: string | HTMLElement;
    map?: Map;
    yAnchor?: number;
    zIndex?: number;
    clickable?: boolean;
  }

  interface MapProjection {
    coordsFromContainerPoint(point: Point): LatLng;
    containerPointFromCoords(latlng: LatLng): Point;
  }

  namespace services {
    type Coord2AddressResult = Array<{
      address: { address_name: string };
      road_address?: { address_name: string } | null;
    }>;
    class Geocoder {
      addressSearch(
        address: string,
        callback: (result: Array<{ x: string; y: string; address_name: string }>, status: string) => void
      ): void;
      coord2Address(
        lng: number,
        lat: number,
        callback: (result: Coord2AddressResult, status: string) => void
      ): void;
    }
    const Status: { OK: string; ZERO_RESULT: string; ERROR: string };
  }
}

interface Window {
  kakao: typeof kakao;
}
