# YouWot
Node.js video editor built to combine the video and audio sources of two different YouTube videos. 

## Usage
Import the package.
```javascript
const youwot = require('youwot')
```
Then call the `replaceAudioFromVideo` function, which requires a valid video and audio id, as well as a callback function. 
```javascript
youwot.replaceAudioFromVideo(videoId, audioId, log)
```
A `path` variable, and `error` are passed to the callback. The `path` passed is the system path to the rendered file. The `error` value is `null` on successful edits. 
```javascript
function log(path, error){
    if(error) return console.error(`An error happened: ${error}`)
    console.log(`Completed! Video path: ${path}`)
}
```

## About
YouWot leans on the power of [ffmpeg](), and more specifically [fluent-ffmpeg](), to carry out the rendering involved with stripping, and merging media. 

The package may include additions features in later releases. 