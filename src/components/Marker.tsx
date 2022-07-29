import * as React from "react";

const Marker: React.FC<
  google.maps.MarkerOptions & {
    color: string;
    onClick?: (e: google.maps.MapMouseEvent) => void;
  }
> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();
  const pinSVGFilled =
    "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      const labelOriginFilled = new google.maps.Point(12, 9);
      let markerImage: google.maps.Symbol = {
        path: pinSVGFilled,
        anchor: new google.maps.Point(12, 17),
        fillOpacity: 1,
        fillColor: options.color,
        strokeWeight: 2,
        strokeColor: "white",
        scale: 1.5,
        labelOrigin: labelOriginFilled,
      };

      marker.setOptions({ ...options, icon: markerImage });
    }
  }, [marker, options]);

  React.useEffect(() => {
    if (marker) {
      ["click"].forEach((eventName) =>
        google.maps.event.clearListeners(marker, eventName)
      );

      if (options.onClick) {
        marker.addListener("click", options.onClick);
      }
    }
  }, [marker, options.onClick]);

  return null;
};

export default Marker;
