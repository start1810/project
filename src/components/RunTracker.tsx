import { useRef, useState } from "react";
import { TTracker } from "types/RunTracker";
const timeString = (seconds:number) => {
    const time = new Date(seconds);
    const hours = ((time.getUTCHours()).toString()).length === 1 ? '0' + time.getUTCHours().toString() : time.getUTCHours().toString()
    const minutes = ((time.getUTCMinutes()).toString()).length === 1 ? '0' + time.getUTCMinutes().toString() : time.getUTCMinutes().toString()
    const endedSeconds = ((time.getUTCSeconds()).toString()).length === 1 ? '0' + time.getUTCSeconds().toString() : time.getUTCSeconds().toString()
    
    //console.log(seconds)
    //console.log(time)
    return `${hours}:${minutes}:${endedSeconds}`;
}
let interval: any= null;
const RunTracker = () => {
    const currentCoords = [0,0];
    const [coords, setCoords] = useState(currentCoords);
    const getCoords = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCoords([position.coords.latitude, position.coords.longitude])
        })
    }
    getCoords();
    const [distanceKm, setDistanceKm] = useState(0);
    const [workoutTime, setWorkoutTime] = useState(0);
    const [startTime, setStartTime] = useState(0)
    const [tempo, setTempo] = useState(0);
    
       
    const [state, setState] = useState<TTracker>('off');
    const startClickHandler = () => {
        clearInterval(interval);
        setState('on')
        const currentTime = Date.now();
        setStartTime(Date.now())
        interval = setInterval(() => {
            setWorkoutTime(Date.now() - currentTime);
            getCoords();
            console.log(coords)
            setDistanceKm((distanceKm) => distanceKm + 10);
        }, 1000);
    }
    const stopClickHandler = () => {
        clearInterval(interval);
        setState('off')
    }
    const pauseClickHandler = () => {
        clearInterval(interval);
        setState('pause')
    }
    if (state === 'on') {
        const startBtn = document.querySelector('#startBtn');
        if (startBtn) startBtn.className = 'hidden';
        const settingsBtn = document.querySelector('#settingsBtn');
        if (settingsBtn) settingsBtn.className = 'hidden';
        const returnBtn = document.querySelector('#returnBtn');
        if (returnBtn) returnBtn.className = 'hidden';
        const stopBtn = document.querySelector('#stopBtn');
        if (stopBtn) stopBtn.className = 'hidden';
        const pauseBtn = document.querySelector('#pauseBtn');
        if (pauseBtn) pauseBtn.className = ''
    };
    if (state === 'pause') {
        const returnBtn = document.querySelector('#returnBtn');
        if (returnBtn) returnBtn.className = '';
        const stopBtn = document.querySelector('#stopBtn');
        if (stopBtn) stopBtn.className = '';
        const pauseBtn = document.querySelector('#pauseBtn');
        if (pauseBtn) pauseBtn.className = 'hidden'
    }
    return (
        <div>
            <div>
                <p>Расстояние (км)</p>
                <p>{distanceKm}</p>
            </div>
            <div>
                <p>Темп (мин/км)</p>
                <p>{tempo}</p>
            </div>
            <div>
                <p>Длительность</p>
                <p>{timeString(workoutTime)}</p>
            </div>
            <div>
                <button onClick={startClickHandler} id="startBtn">Старт</button>
                <button id="settingsBtn">Настройки</button>
                <button onClick={pauseClickHandler} id="pauseBtn" className="hidden">Пауза</button>
                <button onClick={startClickHandler} id="returnBtn" className="hidden">Продолжить</button>
                <button onClick={stopClickHandler} id="stopBtn" className="hidden">Закончить</button>
            </div>
        </div>
    )
}

export default RunTracker;