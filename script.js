$(function() {
  const url = "https://opentdb.com/api.php?amount=1&type=multiple";
  let options = [];
  let question = "";
  let score = "10";

  // getting stuff
  play();

  // taking an answer and looking for  the corresponding object in the answer array
  $('ul').on('click', 'li', function(){
    const bloko = $(this);
    koko = (bloko.text().trim());
    const result = options.find(option => option.answer === koko);

    // checking if the answer is correct so you can feel better about yourself.... or not
    if (result.correct){
      // THIS ONE HERE HAS TO GET REFACTORED COZ IT LOOKS RETARDED
      alert("WINNER!");
      score++;
      $('.score').text(score);
      $('li').remove();
      play();

    }else{
      alert("LOOSER!");
      score--;
      $('.score').text(score);
      $('li').remove();  
      play();
    }
  });

  // this one is fynction to get stuff from API
  function play(){
    axios.get(url)
    .then(function(res){
      console.log(res);

      // clear the array just in case
      options = [];
      
      // decode and save question into the variable
      question = he.decode(res.data.results[0].question);
      
      // decode and save the correct answer in the array
      options.push({answer:he.decode(res.data.results[0].correct_answer), correct:true});
      
      // save the answers in the options array
      res.data.results[0].incorrect_answers.forEach(function(element){
        options.push({answer:he.decode(element), correct:false});
      });
      
      // shuffle the array
      options = shuffle(options);

      //sending stuff to list and such 
      populate(options, question);
    })
    .catch(function(){
      console.log("ERROR!");
    });
  }

  // this one is function to populate data on the page in the ul
  function populate(array, question){
    $('ul').append(`<li><span class="question">${question}</span>`);
    array.forEach(function(element){
      const answer = `<li>
          <span class="answer" id="${array.indexOf(element)}"></span> ${element.answer}
      </li>`;
      $('ul').append(answer);
    });
  }

  // fucntion to scramble the array.
  function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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
});