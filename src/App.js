import React, { Component } from 'react';
import './App.css';

var VideoEditor;
var VideoEditorOptions;

export default class extends Component {
  preview = React.createRef();
  state = {};

  render() {
    return (
      <div style={{ display: "grid", gridTemplateRows: "auto auto 1fr", gridGap: "2rem" }}>
        <header style={{ textAlign: "center" }}>
          Cord Video
        </header>
        <article style={{ display: "grid", gridGap: "2rem", gridAutoColumns: "10rem", gridAutoRows: "10rem", gridAutoFlow: "column", justifyContent: "center" }}>
          <button onClick={this.handleRecord}>Record</button>
        </article>
        <article style={{ display: "grid", gridTemplateRows: "auto 1fr", gridGap: "2rem", justifyContent: "center" }}>
          <input type="file" ref={this.preview} onChange={() => this.handlePreview()} />
          <video src={this.state.previewUrl} controls={true} style={{ maxWidth: "100%", maxHeight: "30rem" }}></video>
        </article>
      </div>
    );
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  getPreviewBase64() {
    return new Promise((res, rej) => {
      const source = this.getPreviewFile();

      if (!source) {
        return res();
      }

      this.getBase64(source).then(x => res(x)).catch(e => rej(e));
    });
  }

  getPreviewFile() {
    const current = this.preview.current;
    return current && current.files[0];
  }

  handleCompression(file) {
    const videoFileName = 'video-name-here'; // I suggest a uuid

    VideoEditor.transcodeVideo(
      () => { },
      e => console.error(e),
      {
        fileUri: file.fullPath,
        outputFileName: videoFileName,
        outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
        optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
        saveToLibrary: true,
        maintainAspectRatio: true,
        width: 640,
        height: 640,
        videoBitrate: 1000000, // 1 megabit
        audioChannels: 2,
        audioSampleRate: 44100,
        audioBitrate: 128000, // 128 kilobits
        progress: function (info) {
          console.log('transcodeVideo progress callback, info: ' + info);
        }
      }
    );
  }

  handlePreview() {
    //this.getPreviewBase64().then(preview => this.setState({ preview })).catch(e => console.error(e));
    const file = this.getPreviewFile();

    if (!file) {
      return;
    }

    this.setState({ previewUrl: URL.createObjectURL(file) });
  }

  handleRecord() {
    navigator.device.capture.captureVideo(x => this.handleCompression(x[0]));
  }
}