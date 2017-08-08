var fs = require('fs');
var page = require('webpage').create();
var url = 'https://www.google.com/recaptcha/api2/demo';

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
page.evaluate(function() {
    document.body.bgColor = 'white';
});

function clickRecaptchaCheckbox() {
  var cd = document.querySelector('iframe').contentDocument;
  var cb = cd.getElementsByClassName('recaptcha-checkbox-checkmark')[0];
  cb.click();
}

function getRecaptchaChallengeWords() {
  var cd = document.querySelectorAll('iframe')[1].contentDocument;
  var strong = cd.querySelector('strong');
  if(strong !== null) {
    return strong.innerHTML;
  } else {
    return null;
  }
}

page.open(url, function (status) {
  //Page is loaded!
  console.log('page loaded');
  setTimeout(function () {
    page.evaluate(clickRecaptchaCheckbox);
    console.log('button clicked');
    // Wait for Google to decide we are a bot
    setTimeout(function() {
      console.log('rendering image');
      page.render('after.png');
      const challengeWords = page.evaluate(getRecaptchaChallengeWords);
      console.log('words: ', challengeWords);
      phantom.exit();
    }, 4000);
    
  }, 1000);
});