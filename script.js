$(function() {
  // variables be here
  const url = "https://opentdb.com/api.php?amount=1&type=multiple";
  let options,
      category,
      question;
  // we start with ten lives - in later version this will increase the difficulty every time it reaches 15 or 20.
  let score = 5;
  // the healthbar starts at 50% and fluctuates from 0 to 100
  let barWidth = 50;
  
// save sounds for howler into a variables.
  
// this ome is for the winning sound
  const winSound = new Howl({
    src: ['assets/audio/bubbles.mp3']
  });
// this one is for the loosing sound
  const lostSound = new Howl({
    src: ['assets/audio/dotted-spiral.mp3']
  });

  // this one checks if the game is over with epic win or epic fail

  const gameOver = () => {
    if (score === 10){
      console.log("you win have a cookie");
      $('.content').empty().text('Victory!');

    }else if(score === 0){
      console.log('game over. Wah-wah');
      $('.content').empty().text('Defeat!');
    }
  }
  
  // this one is a function to update the score clear all the stupid words from the game and load up next question
  
  const roundOver = () => {
    gameOver();
    $('li').remove();
    play();
    $('ul').on('click', 'li', clicker);
  }

  // fucntion to scramble the array.
  const shuffle = array => {
    let currentIndex = array.length, 
        temporaryValue, 
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // this one is function to get stuff from API
  const play = () => {
    axios.get(url)
    .then(res =>{
      // clear the array just in case
      options = [];
      
      // decode and save question into the variable
      question = he.decode(res.data.results[0].question);
      
      // decode and save the correct answer in the array
      options.push({answer:he.decode(res.data.results[0].correct_answer), correct:true});
      
      // save the answers in the options array
      res.data.results[0].incorrect_answers.forEach((element)=>{
        options.push({answer:he.decode(element), correct:false});
      });

      // save category to the category... duh
      category = res.data.results[0].category;
      
      // shuffle the array
      options = shuffle(options);

      //sending stuff to list and such 
      populate(options, question);

      $('.content').toggleClass('invisible visible');
    })
    .catch(()=>{
      console.log("ERROR!");
    });
  }

  // this one is function to populate data on the page in the ul
  const populate = (array, question)=>{
    $('.question').text(question);
    $('.category').text(category);
    array.forEach((element) => {
      const answer = `<li class="answer"><h3>
         ${element.answer}
      </h3></li>`;
      $('ul').append(answer);
    });
  }

  // animations, timeout and end of turn sequence.
  const endSequence = () => {
    setTimeout(function(){
      $('.content').toggleClass('invisible visible');
        setTimeout(function(){
         roundOver();
        }, 1500);
    },500);
  }

  // taking an answer and looking for  the corresponding object in the answer array 
  // THIS ONE HERE CANT USE ARROW FUNCTION BECUA IT MESSES UP the this keywoard, yay learning!
  // also playing win and lose sounds and changing colors and turning off event listener for the duration of sound 
  const clicker = function(){
    const bloko = $(this);
    koko = (bloko.text().trim());
    const result = options.find(option => option.answer === koko);
    // checking if the answer is correct so you can feel better about yourself.... or not
    if (result.correct){
      // play cheerful winning music sound
      winSound.play();
      // change color of the answer to the friendly green
      $(this).css('color', '#6c3');
      // prevent changing colors to cute blue so user would know it is time for reflection
      $(".answer").removeClass('answer');
      // if you win the health bar goes up
      barWidth = barWidth + 10;
      $(".bar").css('width', barWidth + "%");
      // the score that keeps track of winning game goes up
      score++;
      // remove event listener from all the buttons coz silly user will keep clicking
      $('ul').off('click', 'li', clicker);
      // wait a little bit while proud silly user rejoices in victory
      endSequence();
    }else{
      // play slightly less cheerful music
      lostSound.play();
      // change the answer into mildy annoying pinkish-red
      $(this).css('color', '#c54');
      // prevent changing colors to cute blue so user would know it is time for reflection
      $(".answer").removeClass('answer');
      // healthbar goes down 
      barWidth = barWidth - 10;
      $(".bar").css('width', barWidth + "%");
      // score that keeps track of victory goes down
      score--;
      // wait a little while sad user conteplated life choices that led to this moment
      $('ul').off('click', 'li', clicker);
      endSequence();
    }
  }

  // getting stuff for the initial round.
  play();
  $('ul').on('click', 'li', clicker);
});