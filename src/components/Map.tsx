import React from "react";

export default function Map({
  center,
  zoom,
  selectionModel,
  setSelectionModel,
  children,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  selectionModel: number[];
  setSelectionModel: React.Dispatch<React.SetStateAction<number[]>>;
  children?: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();
  const [shiftPressed, setShiftPressed] = React.useState(false);

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { center, zoom }));
    }
  }, [ref, map, center, zoom]);

  React.useEffect(() => {
    if (map) {
      ["mousemove", "mousedown", "mouseup"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      let bounds: google.maps.LatLngBounds | null = null,
        gribBoundingBox: google.maps.Rectangle | null = null,
        mouseIsDown = 0;

      map.addListener("mousemove", (e: google.maps.MapMouseEvent) => {
        if (mouseIsDown && shiftPressed) {
          if (gribBoundingBox !== null) {
            bounds?.extend(e.latLng as google.maps.LatLng);
            gribBoundingBox.setBounds(bounds);
          } else {
            bounds = new google.maps.LatLngBounds();
            bounds.extend(e.latLng as google.maps.LatLng);
            gribBoundingBox = new google.maps.Rectangle({
              map: map,
              bounds: bounds,
              fillOpacity: 0.15,
              strokeWeight: 0.9,
              clickable: false,
            });
          }
        }
      });

      map.addListener("mousedown", (e: google.maps.MapMouseEvent) => {
        if (shiftPressed) {
          mouseIsDown = 1;
          map.setOptions({
            draggable: false,
          });
        }
      });

      map.addListener("mouseup", (e: google.maps.MapMouseEvent) => {
        if (mouseIsDown && shiftPressed) {
          mouseIsDown = 0;
          if (gribBoundingBox !== null) {
            const array = React.Children.toArray(children);

            for (let item of array) {
              let val = item as React.ReactElement;
              let position: google.maps.LatLngLiteral = val.props.position;

              if (gribBoundingBox.getBounds()?.contains(position)) {
                const key = Number(val.key?.toString().replace(".$", ""));

                const idx = selectionModel.indexOf(key);

                if (idx > -1) {
                  selectionModel.splice(idx, 1);
                } else {
                  selectionModel.push(key);
                }
              }
            }
            setSelectionModel([...selectionModel]);
            gribBoundingBox?.setMap(null);
          }
          gribBoundingBox = null;
        }
        map.setOptions({
          draggable: true,
        });
      });
    }
  }, [children, map, selectionModel, setSelectionModel, shiftPressed]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.shiftKey) {
      setShiftPressed(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Shift") {
      setShiftPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <div style={{ height: "100vh", width: "100%" }} ref={ref} id="map" />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
}
