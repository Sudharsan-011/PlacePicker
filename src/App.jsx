import { useRef, useState, useEffect, useCallback } from 'react';
import { sortPlacesByDistance } from './loc.js'; 
import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';

const storedId = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedId.map(id => AVAILABLE_PLACES.find((plc) => plc.id === id)).filter(Boolean); // Filter out undefined values

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlace, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
const[modalVal,setModalVal]=useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const sortedPlaces = sortPlacesByDistance(
          AVAILABLE_PLACES,
          pos.coords.latitude,
          pos.coords.longitude,
        );
        setAvailablePlaces(sortedPlaces);
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Handle error case
      }
    );
  }, []);

  function handleStartRemovePlace(id) {
    // modal.current.open();
    setModalVal(true);
    selectedPlace.current = id;
  } 

  function handleStopRemovePlace() {
    // modal.current.close();
    setModalVal(false);

  }

  function updateLocalStorage(id) {
    const storedId = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if (storedId.indexOf(id) === -1) {
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedId]));
    }
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      if (!place || prevPickedPlaces.some((p) => p.id === id)) {
        return prevPickedPlaces; // No update if place is not found or already selected
      }
      updateLocalStorage(id); // Update local storage here
      return [place, ...prevPickedPlaces];
    });
  }
const handleRemovePlace= useCallback(
  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    // modal.current.close();
setModalVal(false);
    const storedId = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem('selectedPlaces', JSON.stringify(storedId.filter((id) => id !== selectedPlace.current)));
  } 
,[])


  return (
    <>
      <Modal ref={modal}  onClose={handleStopRemovePlace} open={modalVal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlace}
          onSelectPlace={handleSelectPlace}
          fallbackText="sorting places by distance"
        />
      </main>
    </>
  );
}

export default App;
