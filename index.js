var MyForm = {

  validators: {"fio": validateFIO,
    "email":validateEmail,
    "phone":validatePhone},

  validate: function () {

    var errorFields=[];
    var data=this.getData();


    $.each(this.validators, function (field,validator) {
      if (!validator(data[field])) errorFields.push(field);
      
    });

    var isValid=(errorFields.length===0);
    return {isValid:isValid,errorFields:errorFields};

  },
  getData: function () {

    var returned={};
    $.each(this.validators, function(field) { returned[field] = $("#myForm input[name=" + field + "]").val() });


    return returned;

  },
  setData: function(form_values){

    $.each(this.validators, function (field) {
      if (form_values[field]) $("#myForm input[name=" + field + "]").val(form_values[field]);

    })


  },

  submit: function () {
    removeErrorClasses();
    var validation_result=this.validate();
    setErrorClasses(validation_result.errorFields);
    if (validation_result.isValid) {
      disableSubmit();
      makeAjaxCall();
    }


  }


}

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
  return fio.split(' ').length===3;

}

function validateEmail(email) {
  var emailRe = /^\w+([\.-]?\w+)*@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/
  return emailRe.test(email);
}

function setErrorClasses(error_fields) {
  error_fields.forEach(function(error_item){
    $("#myForm input[name="+error_item+"]").addClass("error");
  })

}
function removeErrorClasses() {
  $("#myForm input").each(function () {
    $( this ).removeClass("error");
  })

}
function disableSubmit() {
  $("#submitButton").attr("disabled","disabled");
}

function makeAjaxCall() {

  var my_action = $("#myForm").attr('action');
  $.post( my_action,
    MyForm.getData(), function( data ) {

      $("#resultContainer").addClass(data.status)

      switch (data.status){
        case "success":
          $("#resultContainer").html("Success");
          break;

        case "error":
          $("#resultContainer").html(data.reason);
          break;

        case "progress":
          setTimeout(makeAjaxCall(),data.timeout);
          break;

      }

    },"json");



}