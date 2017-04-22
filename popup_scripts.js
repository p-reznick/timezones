var application;

(function() {
  application = {
    init: function() {
      this.cities = [{ id: 0, name: "Tokyo", tz: "Asia/Tokyo", visible: false },
                     { id: 1, name: "Seoul", tz: "Asia/Seoul", visible: false },
                     { id: 2, name: "Beijing", tz: "Asia/Shanghai", visible: false },
                     { id: 3, name: "Istanbul", tz: "Europe/Istanbul", visible: false },
                     { id: 4, name: "Vilnius", tz: "Europe/Vilnius", visible: false },
                     { id: 5, name: "Moscow", tz: "Europe/Moscow", visible: false },
                     { id: 6, name: "Munich", tz: "Europe/Munich", visible: false },
                    ];
      this.visibleCities = [];
      this.renderPopup();
    },
    renderPopup: function() {
      this.renderCities();
      this.renderButton();
      this.addListeners();
    },
    renderCities: function() {
      var source = $('#cityTemplate').html();
      var cityScript = Handlebars.compile(source);
      var context = { cities: this.visibleCities };
      var html = cityScript(context);
      $('ul li').not('#addButton').remove();
      $('ul').prepend(html);
      this.setTimes();
    },
    renderButton: function() {
      var source = $('#addTemplate').html();
      var addScript = Handlebars.compile(source);
      var invisibles = this.invisibleCities();
      var context = { cities: invisibles };
      var html = addScript(context);
      $('form').remove();
      $('#addButton').append(html);
    },
    addListeners: function() {
      $(document).off();
      var self = this;
      $(document).on('click', 'div', function(e) {
        console.log(e.target);
        console.log('click event fired');
        self.makeInvisible($(this).closest('li').attr('id'));
      });
      $('form').on('submit', function(e) {
        e.preventDefault();
        self.makeVisible($('select').val());
      });
    },
    setTimes: function() {
      var self = this;
      this.visibleCities.forEach(function(city, i) {
        var $li = $('#' + city.id);
        var time = self.getLocalTime(city.tz);
        $li.find('span').text(time);
        $li.find('div').css(self.getHourStyle(time));
      });
    },
    getLocalTime: function(tz) {
      var localDateStr = (new Date()).toLocaleString('en-US', { timeZone: tz });
      return localDateStr.replace(/\d+\/\d+\/\d+, /, '').replace(/:\d+ /, ' ');
    },
    getTimeStr: function(timeArr) {
      var hours = timeArr[0];
      var minutes = timeArr[1];
    
      var meridian = (hours % 24) < 12 ? 'AM' : 'PM';
    
      if (minutes.toString().length === 1) {
        minutes = '0' + minutes;
      }

      return (hours % 12) + ':' + minutes + ' ' + meridian;
    },
    invisibleCities: function() {
      return this.cities.filter(function(city) {
        return city.visible === false;
      });
    },
    getHourStyle(timeStr) {
      hour = parseInt(timeStr.match(/\d+/).toString(), 10);
      if (timeStr.match(/PM/)) {
        hour += 12;
      }
      var sunset = { background: "linear-gradient(45deg, #FFB732, #3232FF)"};
      var day = { backgroundColor: "#7EC0EE", color: "#FFFF00"};
      var sunrise = { background: "linear-gradient(280deg, #FFB732, #3232FF)"};
      var night = { backgroundColor: '#003366', color: '#D3D3D3'}
    
      if (hour > 20) {
        return night;
      } else if (hour > 17) {
        return sunset;
      } else if (hour > 10) {
        return day;
      } else if (hour > 6 ){
        return sunrise;
      } else {
        return night;
      }
    },
    makeVisible: function(id) {
      var city = this.cities.find(function(city) {
        return city.id.toString() === id;
      });
      city.visible = true;
      this.visibleCities.push(city);
      this.renderPopup();
    },
    makeInvisible: function(id) {
      console.log('make invisible');
      console.log(id);
      var self = this;
      var $li = $('#' + id).closest('li');
      var id = $li.attr('id');
      var city = this.visibleCities.find(function(city) {
        return city.id.toString() === id;
      });

      this.removeCityByID(this.visibleCities, id);

      this.cities.forEach(function(city) {
        if (city.id.toString() === id) {
          city.visible = false;
        }
      });

      $li.remove();
      this.renderPopup();
    },
    removeCityByID: function(arr, id) {
      var idx;

      arr.forEach(function(city, i) {
        if (city === undefined) {
          
        } else if (city.id.toString() === id) {
          idx = i;
        }
      });

      idx !== undefined ? arr.splice(idx, 1) : console.log("No such city");
    },
  };
})();

$(application.init.bind(application));
