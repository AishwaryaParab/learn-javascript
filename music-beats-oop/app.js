class DrumKit {
    constructor() {
        this.pads = document.querySelectorAll(".pad");
        this.playBtn = document.querySelector(".play");
        this.kickAudio = document.querySelector(".kick-sound");
        this.snareAudio = document.querySelector(".snare-sound");
        this.hihatAudio = document.querySelector(".hihat-sound");
        this.index = 0;
        this.bpm = 150; // beats per minute to control the speed
        this.isPlaying = null; // to start and stop play

        // to change audios
        this.currentKick = "./sounds/kick-classic.wav";
        this.currentSnare = "./sounds/snare-acoustic01.wav";
        this.currentHihat = "./sounds/hihat-acoustic01.wav";

        this.selects = document.querySelectorAll("select");
        this.muteBtns = document.querySelectorAll(".mute");
        this.tempoSlider = document.querySelector(".tempo-slider");
    }

    repeat() {
        let step = this.index % 8;
        const activeBars = document.querySelectorAll(`.b${step}`);
        
        activeBars.forEach(activeBar => {
            activeBar.style.animation = "playTrack 0.3s alternate ease-in-out 2";

            // to play sounds for active bars
            if(activeBar.classList.contains("active")) {
                if(activeBar.classList.contains("kick-pad")) {
                    this.kickAudio.currentTime = 0; // resets the audio
                    this.kickAudio.play();
                }
                if(activeBar.classList.contains("snare-pad")) {
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play();
                }
                if(activeBar.classList.contains("hihat-pad")) {
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                }
            }
        })

        this.index++;
    }

    start() {
        const interval = (60 / this.bpm) * 1000;

        if(!this.isPlaying) {
            // setInterval returns the interval number (unique + random)
            this.isPlaying = setInterval(() => {
                this.repeat(); // calling this func every second
            }, interval);
        } else {
            // stop playing
            clearInterval(this.isPlaying);
            this.isPlaying = null;
        }
    }

    activePad() {
        this.classList.toggle("active");
    }

    updateBtn() {
        // if NULL -> then onClick of PlayBtn -> display 'STOP'
        if(!this.isPlaying) {
            this.playBtn.innerText = "Stop";
            this.playBtn.classList.add('active');
        } else {
            this.playBtn.innerText = "Play";
            this.playBtn.classList.remove('active');
        }
    }

    changeSound(selectType, sound) {
        switch(selectType) {
            case "kick-select":
                this.kickAudio.src = sound;
                break;
            case "snare-select":
                this.snareAudio.src = sound;
                break;
            case "hihat-select":
                this.hihatAudio.src = sound;
                break;
        }
    }

    mute(e) {
        const muteIndex = e.target.getAttribute("data-track");
        e.target.classList.toggle("active");

        if(e.target.classList.contains("active")) {
            switch(muteIndex) {
                case "0":
                    this.kickAudio.volume = 0;
                    break;
                case "1":
                    this.snareAudio.volume = 0;
                    break;
                case "2":
                    this.hihatAudio.volume = 0;
                    break; 
            }
        } else {
            switch(muteIndex) {
                case "0":
                    this.kickAudio.volume = 1;
                    break;
                case "1":
                    this.snareAudio.volume = 1;
                    break;
                case "2":
                    this.hihatAudio.volume = 1;
                    break; 
            }
        }
    }

    changeTempo(e) {
        const tempoText = document.querySelector(".tempo-nr");
        tempoText.innerText = e.target.value;
    }

    // when tempo is changed, clear the interval as it depends on bpm
    updateTempo(e) {
        this.bpm = e.target.value;
        clearInterval(this.isPlaying);
        this.isPlaying = null;

        if(this.playBtn.classList.contains("active")) {
            this.start();
        }
    }
}

const drumKit = new DrumKit();

// if drumKit.start is directly called, this will point to playBtn & this.repeat will not make any sense
drumKit.playBtn.addEventListener("click", () => {
    drumKit.updateBtn();
    drumKit.start();
})

// Event Listeners
drumKit.pads.forEach(pad => {
    // here this will point to pad
    pad.addEventListener("click", drumKit.activePad);
    pad.addEventListener("animationend", function() {
        this.style.animation = "";
    });
})

drumKit.selects.forEach((select) => {
    select.addEventListener('change', (e) => {
        drumKit.changeSound(e.target.name, e.target.value);
    })
})

drumKit.muteBtns.forEach((muteBtn) => {
    muteBtn.addEventListener('click', (e) => {
        drumKit.mute(e);
    });
})

drumKit.tempoSlider.addEventListener('input', function(e) {
    drumKit.changeTempo(e);
})

drumKit.tempoSlider.addEventListener('change', function(e) {
    drumKit.updateTempo(e);
})


// different between input and change event listeners 
// the input event will be triggered continuously when you're updating the tempo
// whereas the change event will only be triggered after you change and let go