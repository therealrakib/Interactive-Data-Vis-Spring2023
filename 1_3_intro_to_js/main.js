const counter = document.getElementById('counter');
      const button = document.getElementById('clickButton');
      let count = 0;

      button.onclick = function() {
        count++;
        counter.innerText = count;
      };