var application;

(function() {
  application = {
    init: function() {
      this.cities = [{ id: 0, name: "Shanghai", offset: 9 },
                     { id: 1, name: "Karachi", offset: 5 },
                     { id: 2, name: "Beijing", offset: 8 },
                     { id: 3, name: "Lahore", offset: 5 },
                     { id: 4, name: "Istanbul", offset: 2 },
                     { id: 5, name: "Tokyo", offset: 9 },
                     { id: 6, name: "Moscow", offset: 3 },
                     { id: 7, name: "Seoul", offset: 9 },
                     { id: 8, name: "Mexico City", offset: -5 },
                     { id: 9, name: "London", offset: 0 },
                     { id: 10, name: "New York", offset: -5 },
                     { id: 11, name: "Washington", offset: -5 },
                     { id: 12, name: "Los Angeles", offset: -8 },
                     { id: 13, name: "Chicago", offset: -5 },
                     { id: 14, name: "Vilnius", offset: 3 },
                     { id: 15, name: "Berlin", offset: 2 },
                    ];
      this.disabledCities = [{ id: 0, name: "Shanghai", offset: 9 },
                            { id: 1, name: "Karachi", offset: 5 },
                            { id: 2, name: "Beijing", offset: 8 },
                            { id: 3, name: "Lahore", offset: 5 },
                            { id: 4, name: "Istanbul", offset: 2 },
                            { id: 5, name: "Tokyo", offset: 9 },
                            { id: 6, name: "Moscow", offset: 3 },
                            { id: 7, name: "Seoul", offset: 9 },
                            { id: 8, name: "Mexico City", offset: -5 },
                            { id: 9, name: "London", offset: 0 },
                            { id: 10, name: "New York", offset: -5 },
                            { id: 11, name: "Washington", offset: -5 },
                            { id: 12, name: "Los Angeles", offset: -8 },
                            { id: 13, name: "Chicago", offset: -5 },
                            { id: 14, name: "Vilnius", offset: 3 },
                            { id: 15, name: "Berlin", offset: 2 },
                           ];
      this.enabledCities = [];
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
      var context = { cities: this.enabledCities };
      var html = cityScript(context);
      $('ul li').not('#addButton').remove();
      $('ul').prepend(html);
      this.setTimes();
    },
    renderButton: function() {
      var source = $('#addTemplate').html();
      var addScript = Handlebars.compile(source);
      var context = { cities: this.disabledCities };
      var html = addScript(context);
      $('form').remove();
      $('#addButton').append(html);
    },
    addListeners: function() {
      var self = this;
      $(document).on('click', 'div', function() {
        self.disableCity(this);
      });
      $('form').on('submit', function(e) {
        console.log('fired');
        e.preventDefault();
        self.enableCity($('select').val());
      });
    },
    setTimes: function() {
      var self = this;
      this.enabledCities.forEach(function(city, i) {
        var $li = $('#' + city.id);
        var time = self.getOffsetTime(city.offset);
        $li.find('span').text(self.getTimeStr(time));
        $li.find('div').css(self.getHourStyle(time));
      });
    },
    getOffsetTime: function(offset) {
      var UTCHours = (new Date).getUTCHours()
      var hours = UTCHours + offset > 0 ? UTCHours + offset : 24 + UTCHours + offset
      var minutes = (new Date).getMinutes();
      return [hours, minutes];
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
    getHourStyle(timeArr) {
      hour = timeArr[0];
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
    enableCity: function(id) {
      var city = this.disabledCities.find(function(city) {
        return city.id.toString() === id;
      });
      if (city) {
        this.removeCityByID(this.disabledCities, city.id.toString());
  
        this.enabledCities.push(city);
        this.renderPopup();
      }
    },
    disableCity: function(div) {
      var self = this;
      var $li = $(div).closest('li');
      var id = $li.attr('id');
      var city = this.enabledCities.find(function(city) {
        return city.id.toString() === id;
      });

      this.disabledCities.push(city);
      this.removeCityByID(this.enabledCities, id);

      $li.remove();
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
