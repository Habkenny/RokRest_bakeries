"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const POSITION: [number, number] = [53.3811, -1.4701];

/** Fix Leaflet default marker assets in bundled Next.js apps. */
function useLeafletIconFix() {
  useEffect(() => {
    const proto = L.Icon.Default.prototype as unknown as {
      _getIconUrl?: string;
    };
    delete proto._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);
}

export function SheffieldMap() {
  useLeafletIconFix();

  return (
    <MapContainer
      center={POSITION}
      zoom={15}
      scrollWheelZoom={false}
      className="z-0 aspect-[16/10] w-full rounded-xl border border-border"
      aria-label="Map of Sheffield city centre near RokRest Bakery"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={POSITION}>
        <Popup>
          RokRest International Bakery
          <br />
          22 Baker&apos;s Row, S1 2JH
        </Popup>
      </Marker>
    </MapContainer>
  );
}
