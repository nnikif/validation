"use strict";

var MyForm = {
  validators: {"fio": validateFIO,
    "email":validateEmail,
    "phone":validatePhone},
  node: $("#myForm"),
  output_node: $("#resultContainer"),
  validate: function () {
    var errorFields = [];
    var data = this.getData();
    $.each(this.validators, function (field,validator) {
      if (!validator(data[field])) {errorFields.push(field);}
    });
    return {isValid: errorFields.length === 0, errorFields: errorFields};
  },
  getData: function () {
    var returned = {};
    this.node.find("input").each(function(){returned[$(this)[0].name] = $(this)[0].value;});
    return returned;

  },
  setData: function(form_values){
    this.node.find("input").each(function () {
      var field_name = $(this)[0].name;
      if (form_values.hasOwnProperty(field_name)){
        $(this)[0].value = form_values[field_name];
      }
    });
  },
  submit: function () {
    this.removeErrorClasses();
    var validation_result = this.validate();
    if (validation_result.isValid) {
      disableSubmit();
      this.makeAjaxCall();
      return;
    }
    this.setErrorClasses(validation_result.errorFields);
  },
  setErrorClasses: function(error_fields) {
    var self = this;
    error_fields.forEach(function(error_item){
      self.node.find("input[name=" + error_item + "]").addClass("error");
    });
  },
  removeErrorClasses: function() {
    this.node.find("input").each(function () {
      $(this).removeClass("error");
    });
  },
  makeAjaxCall: function () {
    var self = this;
    var my_action = self.node.attr("action");
    $.post( my_action,
      self.getData(), function( data ) {
        self.output_node.removeClass();
        self.output_node.addClass(data.status);

        switch (data.status){
          case "success":
            self.output_node.html("Success");
            break;

          case "error":
            self.output_node.html(data.reason);
            break;

          case "progress":
            setTimeout(self.makeAjaxCall(),data.timeout);
            break;
        }
      },"json");
  }
};

function validatePhone(number) {
  var  phoneRe = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
  if (!phoneRe.test(number)) {return false;}
  var only_digits = number.match(/\d/g);
  var sum = only_digits.reduce(function(a,b){
    return a+(+b);
  },0)
  return sum <= 30;
}
function validateFIO(fio) {
  return fio.split(" ").length === 3;
}
function validateEmail(email) {
  var emailRe = /^\w+([\.\-]?\w+)*@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/;
  return emailRe.test(email);
}
function disableSubmit() {
  $("#submitButton").attr("disabled","disabled");
}

