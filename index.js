var MyForm = {

  validate: function () {

    var errorFields=[];
    if (!validateFIO(this.getData().fio)) errorFields.push("fio")
    if (!validateEmail(this.getData().email)) errorFields.push("email")
    if (!validatePhone(this.getData().phone)) errorFields.push("phone")
    var isValid=(errorFields.length===0)
    return {isValid:isValid,errorFields:errorFields}

  },
  getData: function () {
    var returned={};

    returned.fio=$("#myForm input[name=fio]").val();
    returned.email=$("#myForm input[name=email]").val();
    returned.phone=$("#myForm input[name=phone]").val()

    return returned;

  },
  setData: function(form_values){
    if (form_values.fio) $("#myForm input[name=fio]").val(form_values.fio);
    if (form_values.email) $("#myForm input[name=email]").val(form_values.email);
    if (form_values.phone) $("#myForm input[name=phone]").val(form_values.phone);

  },

  submit: function () {
    removeErrorClasses();
    var validation_result=this.validate();
    setErrorClasses(validation_result.errorFields)
    if (validation_result.isValid) {
      disableSubmit();
      makeAjaxCall();
    }


  }


}

function validatePhone(number) {
  var  phoneRe=/\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
  if (!phoneRe.test(number)) return false
  var only_digits=number.match(/\d/g);
  var sum=only_digits.reduce(function(a,b){
    return a+parseInt(b);
  },0)
  if (sum>30) return false
  else return true

}
function validateFIO(fio) {
  if (fio.split(' ').length===3) return true;
  return false;

}

function validateEmail(email) {
  var emailRe = /^\w+([\.-]?\w+)*@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/
  return emailRe.test(email)
}

function setErrorClasses(error_fields) {
  error_fields.forEach(function(error_item){
    $("#myForm input[name="+error_item+"]").addClass("error")
  })

}
function removeErrorClasses() {
  $("#myForm input").each(function () {
    $( this ).removeClass("error")
  })

}
function disableSubmit() {
  $("#submitButton").attr("disabled","disabled")
}

function makeAjaxCall() {
  var my_action = $("#myForm").attr('action');
  $.post( my_action,
    MyForm.getData())
    .done(function( data ) {
      $("#resultContainer").addClass(data.status);
      switch (data.status){
        case "success":
          $("#resultContainer").html("Success");
          break;
        case "error":
          $("#resultContainer").html(data.reason);
          break;
        case "progress":
          setTimeout(makeAjaxCall(),data.timeout)
          break;

      }

    });



}