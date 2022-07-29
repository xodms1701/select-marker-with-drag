import React from "react";
import "./App.css";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from "./components/Map";
import Marker from "./components/Marker";

const addressList: {
  no: number;
  address: string;
  lat: number;
  lng: number;
  crew?: {
    no: number;
    color: string;
  };
}[] = [
  {
    no: 1,
    address: "Tesla 서울 여의도 스토어",
    lat: 37.526052,
    lng: 126.926526,
  },
  {
    no: 2,
    address: "서울대림초등학교",
    lat: 37.500676,
    lng: 126.925504,
  },
  {
    no: 3,
    address: "보라매공원",
    lat: 37.492702,
    lng: 126.919788,
  },
  {
    no: 4,
    address: "서울대학교",
    lat: 37.459554,
    lng: 126.952393,
  },
  {
    no: 5,
    address: "용산공원",
    lat: 37.528013,
    lng: 126.982744,
  },
  {
    no: 6,
    address: "블루스퀘어",
    lat: 37.540857,
    lng: 127.002543,
  },
  {
    no: 7,
    address: "동관왕묘",
    lat: 37.573048,
    lng: 127.018216,
  },
  {
    no: 8,
    address: "DDP 동대문 디자인플라자",
    lat: 37.567284,
    lng: 127.010179,
  },
  {
    no: 9,
    address: "한국체육대학교",
    lat: 37.519914,
    lng: 127.130784,
  },
  {
    no: 10,
    address: "CGV 강남",
    lat: 37.501691,
    lng: 127.026301,
  },
];

function App() {
  const [selectionModel, setSelectionModel] = React.useState<number[]>([]);

  const render = (status: Status) => {
    return <h1>{status}</h1>;
  };

  return (
    <Wrapper
      apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY as string}
      render={render}
    >
      <Map
        zoom={11}
        center={{ lat: 37.55397553606516, lng: 126.98918410871653 }}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
      >
        {addressList.map((val, idx) => {
          return (
            <Marker
              key={val.no}
              position={{ lat: val.lat, lng: val.lng }}
              clickable
              color={selectionModel.includes(val.no) ? "#000" : "#aaa"}
              onClick={(e) => {
                const exists = selectionModel.includes(val.no);

                if (exists) {
                  setSelectionModel(
                    selectionModel.filter((id) => id !== val.no)
                  );
                } else {
                  setSelectionModel([...selectionModel, val.no]);
                }
              }}
            />
          );
        })}
      </Map>
    </Wrapper>
  );
}

export default App;
