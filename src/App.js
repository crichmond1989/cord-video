import React, { Component } from 'react';
import './App.css';

export default class extends Component {
  isRecording = false;
  preview = React.createRef();
  previewVideo = React.createRef();
  recorder = null;
  recordingChunks = [];
  state = {};

  render() {
    return (
      <div style={{ display: "grid", gridTemplateRows: "auto auto 1fr", gridGap: "2rem" }}>
        <header style={{ textAlign: "center" }}>
          Cord Video
        </header>
        <article style={{ display: "grid", gridGap: "2rem", gridAutoColumns: "10rem", gridAutoRows: "10rem", gridAutoFlow: "column", justifyContent: "center" }}>
          <button onClick={() => this.handleRecord()}>Record</button>
        </article>
        <article style={{ display: "grid", gridTemplateRows: "auto 1fr", gridGap: "2rem", justifyContent: "center" }}>
          <input type="file" ref={this.preview} onChange={() => this.handlePreview()} />
          <video ref={this.previewVideo} autoPlay={true} controls={true} style={{ maxWidth: "100%", maxHeight: "30rem" }}></video>
        </article>
      </div>
    );
  }

  getPreviewFile() {
    const current = this.preview.current;
    return current && current.files[0];
  }

  handlePreview() {
    const file = this.getPreviewFile();

    if (!file) {
      return;
    }

    this.previewVideo.current.srcObject = null;
    this.previewVideo.current.src = URL.createObjectURL(file);
  }

  handleRecord() {
    console.log("handleRecording");
    console.log(this.isRecording);

    if (this.isRecording) {
      this.isRecording = false;
      this.recorder.stop();
      return;
    }

    navigator.mediaDevices.getUserMedia({video: {facingMode: "user"}, audio: true}).then(stream => {
      console.log("starting stream");

      this.recordingChunks = [];
      this.previewVideo.current.src = null;
      this.previewVideo.current.srcObject = stream;

      this.recorder = new MediaRecorder(stream);

      this.recorder.ondataavailable = e => this.recordingChunks.push(e.data);
      this.recorder.onstop = () => this.handleRecordingPreview();

      this.isRecording = true;
      this.recorder.start();
    });
  }

  handleRecordingPreview() {
    console.log("handleRecordingPreview");

    this.previewVideo.current.srcObject = null;
    this.previewVideo.current.src = URL.createObjectURL(new Blob(this.recordingChunks));
  }
}