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

function getRecaptchaChallengeWords(cb) {
  var words = page.evaluate(function() {
    var cd = document.querySelectorAll('iframe')[1].contentDocument;
    var strong = cd.querySelector('strong');
    if(strong !== null) {
      return strong.innerHTML;
    } else {
      return null;
    }
  });

  console.log('words is null ', words === null);
  console.log('words is undefined ', words === undefined);
  console.log('words is empty string ', words === '');
  page.render(Math.floor(Date.now() / 1000) + '.png');
  if(words !== null && words !== '') {
    cb(words);
  } else {
    console.log('They caught us!');
    phantom.exit();
  }
}

function getDifferentCaptcha() {
  page.evaluate(function() {
    var cd = document.querySelectorAll('iframe')[1].contentDocument;
    cd.getElementById('recaptcha-reload-button').click();
  });
}

function hideElements() {
  page.evaluate(function() {
    document.getElementsByClassName('sample-form')[0].remove();
    //var cd = document.querySelectorAll('iframe')[1].contentDocument;
  });
}

function haveWords(challengeWords) {
  console.log('challengeWords: ', challengeWords);
  hideElements();
  console.log('rendering image');
  page.render('after.png');
  phantom.exit();
}

page.open(url, function (status) {
  //Page is loaded!
  console.log('page loaded');
  setTimeout(function () {
    page.evaluate(clickRecaptchaCheckbox);
    console.log('button clicked');
    // Wait for Google to decide we are a bot
    setTimeout(function() {
      getRecaptchaChallengeWords(haveWords);
    }, 4000);
    
  }, 1000);
});