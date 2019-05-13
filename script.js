$(function() {
  // variables be here
  const url = "https://opentdb.com/api.php?amount=1&type=multiple";
  let options,
      category,
      question;
  // we start with ten lives - in later version this will increase the difficulty every time it reaches 15 or 20.
  let score = 10;
  let barWidth = 50;
  

  // DOES NOT WORK FOR SOME REASON IDK WHY!!!!!!!?!?!?!?!?!?!?!?!?!?!?!??!?
  const sound = new Howl({
    src: ['assets/audio/dirty.mp3'],
    loop: true
  });
  
  sound.play();

  // this one checks if the game is over with epic win or epic fail

  const gameOver = () => {
    if (score === 20){
      console.log("you win have a cookie");
    }else if(score === 0){
      console.log('game over. Wah-wah');
    }
  }
  
  // this one is a function to update the score clear all the stupid words from the game and load up next question
  
  const roundOver = () => {
    gameOver();
    $('.score').text(score);
    $('li').remove();
    play();
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

  // this one is fynction to get stuff from API
  const play = () => {
    axios.get(url)
    .then(res =>{

      console.log(res);
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
      const answer = `<li><h3>
          <span class="answer" id="${array.indexOf(element)}"></span> ${element.answer}
      </h3></li>`;
      $('ul').append(answer);
    });
  }

  // getting stuff for the initial round.
  play();

  // taking an answer and looking for  the corresponding object in the answer array 
  // THIS ONE HERE CANT USE ARROW FUNCTION BECUA IT MESSES UP the this keywoard, yay learning!
  $('ul').on('click', 'li', function(){
    const bloko = $(this);
    koko = (bloko.text().trim());
    const result = options.find(option => option.answer === koko);

    // checking if the answer is correct so you can feel better about yourself.... or not
    if (result.correct){
      // if you win you gain life
      barWidth = barWidth + 5;
      $(".bar").css('width', barWidth + "%");
      alert("Smart!!!");
      score++;
      roundOver();
    }else{
      // if you no win you loose life
      barWidth = barWidth - 5;
      $(".bar").css('width', barWidth + "%");
      alert("Dumb!!!");
      score--;
      roundOver();
    }
  });
});