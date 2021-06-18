import React, { useState, useEffect} from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({
  log: true,
  corePath: 'ffmpeg/ffmpeg-core.js',
});

function App() {

  const [ ready, setReady ] = useState(false)
  const [ video, setVideo ] = useState()
  const [ gif, setGif ] = useState();

  const load = async () => {
    await ffmpeg.load()
    setReady(true)
  }

  useEffect(()=> {
    load()
  }, [])

  const convertToGif = async ( ) => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif')

    const data = ffmpeg.FS('readFile', 'out.gif')

    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}))

    setGif(url)
  }

  return ready ? (
    <div className="previewWrapper">
      {video && <video autoPlay muted src={URL.createObjectURL(video)}></video>}
      <input type="file"  onChange={(e) => setVideo(e.target.files?.item(0))}/>

      <button onClick={convertToGif}>Convert</button>
      <img src={gif}/>
    </div>
  ): (<h1>Loading</h1>);
}

export default App;
