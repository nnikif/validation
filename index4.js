var node;
var output_node;

$(document).ready(function() {
  node=$("#myForm");
  output_node=$("#resultContainer");
});

var validators= {"fio": validateFIO,
  "email":validateEmail,
  "phone":validatePhone};

var MyForm = {
  thnode: $("#myForm"),
  output_node: $("#resultContainer"),
  validate: function () {

    var errorFields=[];
    var data=this.getData();

    $.each(validators, function (field,validator) {
      if (!validator(data[field])) {errorFields.push(field);}
    });
    return {isValid:errorFields.length===0,errorFields:errorFields};

  },
  getData: function () {

    var returned={};
    $.each(validators, function(field) { returned[field] = this.node.find("input[name=" + field + "]").val();});
    return returned;

  },
  setData: function(form_values){

    $.each(validators, function (field) {
      if (form_values.hasOwnProperty(field)) {this.node.find("input[name=" + field + "]").val(form_values[field]);}

    });
  },
  submit: function () {
    removeErrorClasses();
    var validation_result=this.validate();
    if (validation_result.isValid) {
      disableSubmit();
      makeAjaxCall();
    }
    setErrorClasses(validation_result.errorFields);

  }

};

function validatePhone(number) {
  var  phoneRe=/\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
  if (!phoneRe.test(number)) return false;
  var only_digits=number.match(/\d/g);
  var sum=only_digits.reduce(function(a,b){
    return a+parseInt(b);
  },0)
  return sum<=30;

}
function validateFIO(fio) {
  return fio.split(" ").length===3;

}

function validateEmail(email) {
  var emailRe = /^\w+([\.\-]?\w+)*@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/;
  return emailRe.test(email);
}

function setErrorClasses(error_fields) {
  error_fields.forEach(function(error_item){
    node.find("input[name=" + error_item + "]").addClass("error")
  })

}
function removeErrorClasses() {
  node.find("input").each(function () {
    $( this ).removeClass("error");
  })

}
function disableSubmit() {
  $("#submitButton").attr("disabled","disabled");
}

function makeAjaxCall() {

  var my_action = node.attr("action");
  $.post( my_action,
    MyForm.getData(), function( data ) {

      output_node.addClass(data.status)

      switch (data.status){
        case "success":
          output_node.html("Success");
          break;

        case "error":
          output_node.html(data.reason);
          break;

        case "progress":
          setTimeout(makeAjaxCall(),data.timeout);
          break;
      }
    },"json");



}