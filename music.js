const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main_audio"),
playPauseBtn =  wrapper.querySelector(".play-pause"),
prevBtn =  wrapper.querySelector("#prev"),
nextBtn =  wrapper.querySelector("#next"),
progressBar =  wrapper.querySelector(".progress-bar"),
progressArea =  wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");



let musicIndex = 2;

window.addEventListener("load", () =>{
    loadMusic(musicIndex);// calling load music functon once window is loaded
    playingNow();
})

// load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `/image/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `/music-file/${allMusic[indexNumb -1].src}`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}
//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();

}

//next music function
function nextMusic(){
//here we'll just increament of index by 1
    musicIndex++;
    //
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//prev music function
function prevMusic(){
    //here we'll just decrement of index by 1
        musicIndex--;
        //
        musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
        loadMusic(musicIndex);
        playMusic();
        playingNow();
    }

//play or music button event
playPauseBtn.addEventListener("click", () => {
   const isMusicPaused = wrapper.classList.contains("paused"); 
   //if musicIndex is less than 1 then musicIndex will be array length so the last song will play 
   isMusicPaused ? pauseMusic() : playMusic();
   playingNow();
});

//next music btn event
nextBtn.addEventListener("click", () => {
    nextMusic(); //calling next function
});
//prev music btn event
prevBtn.addEventListener("click", () => {
    prevMusic(); //calling prev function
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) =>{
    const currentTime = e.target.currentTime; //getting current time of song
    const duration = e.target.duration; //getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () =>{
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ // adding 0 if sec is less than 10 
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;

        
    });
     //update playing song current time
     let currentMin = Math.floor(currentTime / 60);
     let currentSec = Math.floor(currentTime % 60);
     if(currentSec < 10){ // adding 0 if sec is less than 10 
        currentSec = `0${currentSec}`;
     }
     musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//let's update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) =>{
    let progressWidthValue = progressArea.clientWidth; //getting with og progress bar 
    let clickedOffsetX = e.offsetX; //getting offset x value 
    let songDuration = mainAudio.duration; //getting song total duration
    
    mainAudio.currentTime = (clickedOffsetX / progressWidthValue) * songDuration;
    playMusic();
});

//let's work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    //first we get the innerText of the icon we'll cahange accordingly
    let getText = repeatBtn.innerText; // getting innerText at icon
    // let's do different changes on different icon click using switch
     switch(getText){
        case "repeat": //if this icon is repeat then change it to repeat_one
            repeatBtn.innerText = 'repeat_one';
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case 'repeat_one': //if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = 'shuffle';
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case 'shuffle': //if icon is shuffle then change it to repeat
            repeatBtn.innerText = 'repeat';
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
     }
});

//above we just changed the icon, now let's work on what to do after the song ended

mainAudio.addEventListener("ended", () =>{
    // we'll do according to the icon means if user has set icon to loop song then we'll repeat the current song and will do further according

    let getText = repeatBtn.innerText; //getting innerText of icon 
    //let's do different changes on different icon click using switch
    switch(getText){
        case "repeat": //if this icon is repeat then simply we call the nextMusic function so the next song will play
            nextMusic();
            break;
        case 'repeat_one': //if icon is repeat_one then we'll change the currrent playing song current time to 0 so song will play from beginning
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic(); //call playMusic function
            break;
        case 'shuffle': //if icon is shuffle then change it to repeat
        //generating random index between the max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                let randIndex = Math.floor((Math.random() * allMusic.length) + 1); 
            }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current music index
            musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex); //call loadMusic function
            playMusic(); //call playMusic function
            playingNow();
            break;
     }
});

showMoreBtn.addEventListener("click", () =>{
    musicList.classList.toggle("show")
});

hideMusicBtn.addEventListener("click", () =>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

let allMusic = [
    {
        name: "Harley Bird - Home",
        artist: "Jordan Schor",
        img: "music3",
        src: "music-1.mp3"
    },
    {
        name: "Ikson Anywhere - Ikson",
        artist: "Audio Library",
        img: "music2",
        src: "music-2.mp3"
    },
    {
        name: "Beauz & Jvna - Crazy",
        artist: "Beauz & Jvna",
        img: "music1",
        src: "music-3.mp3"
    },
    {
        name: "Hardwind - Want Me",
        artist: "Mike Archangelo",
        img: "music4",
        src: "music-4.mp3"
    },
    {
        name: "Jim - Sun Goes Down",
        artist: "Jim Yosef x Ray",
        img: "music5",
        src: "music-5.mp3"
    },
    {
        name: "Lost Sky - Vision NCS",
        artist: "NSC Release",
        img: "music6",
        src: "music-6.mp3"
    }
]

//let's create li according to the array length
for(let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array li

    let liTag = `<li li-index=${i + 1}>
                <div class="row">
                    <span>${allMusic[i].name}</span> 
                    <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${allMusic[i].src}" src="/music-file/${allMusic[i].src
                }"></audio>
                <span id="${allMusic[i].src}"  class="audio-duration">3:40</span>
            </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
    

    const liAudioTag = ulTag.children[i]
    const liAudio = liAudioTag.querySelector(`audio`);
    const liAudioDuration = liAudioTag.querySelector(`.audio-duration`)
    
    liAudio.addEventListener("loadeddata", (e) =>{
        //update song total duration
        let audioDuration = e.target.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ // adding 0 if sec is less than 10 
            totalSec = "0" + totalSec;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        //adding t duration attribute which we'll use below
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

// let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for(let j = 0; j < allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // let's remove playing class from all other li except the last one which is clicked
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            // let's get that audio duration and pass to audio-duration
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        //if there is an li tag which li-index is equal to musicIndex then this music is playing now and we'll style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        //adding onclick attribute in all li tags
        allLiTags[j].setAttribute('onclick', "clicked(this)");
    }
}

//let's play song on li click
function clicked(element){
    //getting li index of particular clicked li tags
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; // passing that li-index to musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}



