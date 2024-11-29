import { socket } from "../utils/socket";

let peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

const userType = {
  doctor: "doctor",
  patient: "patient",
};

class RTCManager {
  #peerConnection;
  #localStream;
  #remoteStream;
  #didIOffer = false;
  #userId;

  getStream() {
    return {
      localStream: this.#localStream,
      remoteStream: this.#remoteStream,
    };
  }

  async call() {
    try {
      console.log("Creating offer");
      const offer = await this.#peerConnection.createOffer();

      this.#peerConnection.setLocalDescription(offer);

      socket.emit("newOffer", offer);
    } catch (error) {
      console.log(error);
    }
  }

  async answerOffer(offerObj) {
    await this.#peerConnection.setRemoteDescription(offerObj.offer);
    const answer = await this.#peerConnection.createAnswer({});
    await this.#peerConnection.setLocalDescription(answer);

    console.log(offerObj);
    console.log(answer);

    offerObj.answer = answer;

    const offerIceCandidates = await socket.emitWithAck("newAnswer", offerObj);

    offerIceCandidates.forEach((c) => {
      this.#peerConnection.addIceCandidate(c);
      console.log("Added Ice Candidate");
    });
    console.log(offerIceCandidates);
  }

  async addAnswer(offerObj) {
    await this.#peerConnection.setRemoteDescription(offerObj.answer);
  }

  // fetchmedia
  fetchMedia() {
    return new Promise(async (resolve, reject) => {
      try {
        const constraints = {
          video: true,
          audio: false,
        };
        this.#localStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );

        resolve(this.#localStream);
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }
  // create pc
  createPeerConnection(userId, didIOffer, offerObj) {
    this.#peerConnection = new RTCPeerConnection(peerConfiguration);
    this.#remoteStream = new MediaStream();

    this.#localStream.getTracks().forEach((track) => {
      this.#peerConnection.addTrack(track, this.#localStream);
    });

    this.#peerConnection.addEventListener("signalingstatechange", (e) => {
      console.log(this.#peerConnection.signalingState);
    });

    this.#peerConnection.addEventListener("icecandidate", (e) => {
      console.log("Ice candidate found..");
      if (e.candidate) {
        socket.emit("sendIceCandidateToSignalingServer", {
          iceCandidate: e.candidate,
          iceUserId: userId,
          didIOffer: didIOffer,
        });
      }
    });

    this.#peerConnection.addEventListener("track", (e) => {
      console.log("Got a track from the other peer!");
      e.streams[0].getTracks().forEach((track) => {
        this.#remoteStream.addTrack(track, this.#remoteStream);
      });
    });

    // if (offerObj) {
    //   await this.#peerConnection.setRemoteDescription(offerObj.offer);
    // }

    return {
      peerConnection: this.#peerConnection,
      remoteStream: this.#remoteStream,
    };
  }

  async addNewIceCandidate(iceCandidate) {
    await this.#peerConnection.addIceCandidate(iceCandidate);
    console.log("Added Ice Candidate");
  }
  // offer
}

const rtcmanager = new RTCManager();

export default rtcmanager;
